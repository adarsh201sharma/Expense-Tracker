'use client';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { CATEGORY_COLORS } from '@/lib/categories';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function CategoryPie({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-sm text-slate-400">
        No data yet
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: d._id,
    value: d.total,
    color: CATEGORY_COLORS[d._id] || '#6B7280',
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`}
          contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconSize={10}
          wrapperStyle={{ fontSize: 12 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function MonthlyBar({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-sm text-slate-400">
        No data yet
      </div>
    );
  }

  const chartData = data.map((d) => ({
    month: `${MONTH_NAMES[d._id.month - 1]} ${String(d._id.year).slice(2)}`,
    total: d.total,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
        <YAxis
          tick={{ fontSize: 11, fill: '#64748b' }}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`}
          contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
        />
        <Bar dataKey="total" fill="#2E75B6" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
