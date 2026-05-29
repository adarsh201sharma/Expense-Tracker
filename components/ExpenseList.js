'use client';
import { Trash2, Pencil } from 'lucide-react';
import { CATEGORY_COLORS } from '@/lib/categories';

export default function ExpenseList({ expenses, onDelete, onEdit }) {
  if (!expenses.length) {
    return (
      <div className="card text-center text-slate-500 py-10">
        <p className="text-sm">No expenses yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="divide-y divide-slate-100">
        {expenses.map((exp) => (
          <div key={exp._id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-medium text-xs flex-shrink-0"
              style={{ backgroundColor: CATEGORY_COLORS[exp.category] || '#6B7280' }}
            >
              {exp.category.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-slate-900">{exp.category}</span>
                <span className="text-xs text-slate-500">
                  {new Date(exp.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              {exp.description && (
                <p className="text-xs text-slate-600 truncate">{exp.description}</p>
              )}
            </div>
            <div className="font-semibold text-sm">
              ₹{Number(exp.amount).toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => onEdit(exp)}
                className="p-1 text-slate-400 hover:text-accent rounded"
                title="Edit"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => onDelete(exp._id)}
                className="p-1 text-slate-400 hover:text-red-600 rounded"
                title="Delete"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
