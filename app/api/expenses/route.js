import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Expense from '@/models/Expense';

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sortBy') || 'date';
    const order = searchParams.get('order') === 'asc' ? 1 : -1;
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500);
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);

    const query = { user: session.user.id };
    if (category && category !== 'all') query.category = category;

    const total = await Expense.countDocuments(query);
    const expenses = await Expense.find(query)
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({ expenses, total, page, limit });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { amount, category, description, date } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount required' }, { status: 400 });
    }
    if (!category) {
      return NextResponse.json({ error: 'Category required' }, { status: 400 });
    }

    await connectDB();
    const expense = await Expense.create({
      user: session.user.id,
      amount: Number(amount),
      category,
      description: description || '',
      date: date ? new Date(date) : new Date(),
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
