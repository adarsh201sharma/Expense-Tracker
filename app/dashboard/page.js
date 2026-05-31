'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { TrendingUp, DollarSign, Calendar, Filter, ArrowUpDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import { CategoryPie, MonthlyBar } from '@/components/Charts';
import { CATEGORIES } from '@/lib/categories';

export default function Dashboard() {
  const { status } = useSession();
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [editing, setEditing] = useState(null);
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  const loadData = useCallback(async () => {
    try {
      const params = new URLSearchParams({ sortBy, order, ...(category !== 'all' && { category }) });
      const [expRes, statRes] = await Promise.all([
        fetch(`/api/expenses?${params}`),
        fetch('/api/stats'),
      ]);
      const expData = await expRes.json();
      const statData = await statRes.json();
      setExpenses(expData.expenses || []);
      setStats(statData);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [category, sortBy, order]);

  useEffect(() => {
    if (status === 'authenticated') loadData();
  }, [status, loadData]);

  const handleAdded = () => loadData();
  const handleUpdated = () => {
    setEditing(null);
    loadData();
  };
  const handleDelete = async (id) => {
    if (!confirm('Delete this expense?')) return;
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Deleted');
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Total Spent"
            value={`₹${(stats?.total || 0).toLocaleString('en-IN')}`}
            icon={DollarSign}
            color="bg-blue-50 text-blue-700"
          />
          <StatCard
            label="This Month"
            value={`₹${(stats?.thisMonth || 0).toLocaleString('en-IN')}`}
            icon={Calendar}
            color="bg-purple-50 text-purple-700"
          />
          <StatCard
            label="Transactions"
            value={(stats?.count || 0).toString()}
            icon={TrendingUp}
            color="bg-emerald-50 text-emerald-700"
          />
          <StatCard
            label="Avg / Expense"
            value={`₹${stats?.count ? Math.round(stats.total / stats.count).toLocaleString('en-IN') : 0}`}
            icon={TrendingUp}
            color="bg-amber-50 text-amber-700"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="card">
            <h2 className="font-semibold mb-3 text-slate-900">By Category</h2>
            <CategoryPie data={stats?.byCategory} />
          </div>
          <div className="card">
            <h2 className="font-semibold mb-3 text-slate-900">Last 6 Months</h2>
            <MonthlyBar data={stats?.monthly} />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <ExpenseForm
              onAdded={handleAdded}
              editing={editing}
              onUpdated={handleUpdated}
              onCancel={() => setEditing(null)}
            />
          </div>

          <div className="md:col-span-2 space-y-3">
            <div className="card flex flex-wrap items-center gap-3 py-3">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400" />
                <select
                  className="text-sm border border-slate-200 rounded-md px-2 py-1 bg-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="all">All categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <ArrowUpDown size={14} className="text-slate-400" />
                <select
                  className="text-sm border border-slate-200 rounded-md px-2 py-1 bg-white"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                </select>
                <select
                  className="text-sm border border-slate-200 rounded-md px-2 py-1 bg-white"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                >
                  <option value="desc">Desc</option>
                  <option value="asc">Asc</option>
                </select>
              </div>

              <div className="ml-auto text-xs text-slate-500">
                {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
              </div>
            </div>

            <ExpenseList
              expenses={expenses}
              onDelete={handleDelete}
              onEdit={setEditing}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="card">
      <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-2`}>
        <Icon size={16} />
      </div>
      <div className="text-xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}
