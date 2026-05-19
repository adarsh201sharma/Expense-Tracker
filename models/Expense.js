import mongoose from 'mongoose';

export const CATEGORIES = [
  'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment',
  'Health', 'Education', 'Travel', 'Groceries', 'Other',
];

const ExpenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, enum: CATEGORIES, required: true },
    description: { type: String, trim: true, default: '' },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

ExpenseSchema.index({ user: 1, date: -1 });
ExpenseSchema.index({ user: 1, category: 1 });

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
