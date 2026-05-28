'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, X } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';

export default function ExpenseForm({ onAdded, editing, onCancel, onUpdated }) {
  const [form, setForm] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().slice(0, 10),
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        amount: editing.amount,
        category: editing.category,
        description: editing.description || '',
        date: new Date(editing.date).toISOString().slice(0, 10),
      });
    }
  }, [editing]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        const res = await fetch(`/api/expenses/${editing._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Update failed');
        const data = await res.json();
        toast.success('Updated!');
        onUpdated(data);
      } else {
        const res = await fetch('/api/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Create failed');
        const data = await res.json();
        toast.success('Expense added!');
        setForm({
          amount: '',
          category: 'Food',
          description: '',
          date: new Date().toISOString().slice(0, 10),
        });
        onAdded(data);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-slate-900">
          {editing ? 'Edit expense' : 'Add expense'}
        </h2>
        {editing && (
          <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="label">Amount (₹)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            required
            className="input"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="label">Date</label>
          <input
            type="date"
            required
            className="input"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="label">Category</label>
        <select
          className="input"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="label">Description (optional)</label>
        <input
          type="text"
          className="input"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="What did you spend on?"
        />
      </div>

      <button className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
        <Plus size={16} />
        {loading ? 'Saving...' : editing ? 'Update Expense' : 'Add Expense'}
      </button>
    </form>
  );
}
