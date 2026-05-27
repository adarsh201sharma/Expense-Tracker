'use client';
import { signOut, useSession } from 'next-auth/react';
import { Wallet, LogOut } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-navy text-white rounded-lg flex items-center justify-center">
            <Wallet size={18} />
          </div>
          <span className="font-semibold text-navy">Expense Tracker</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600 hidden sm:block">
            Hi, {session?.user?.name}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-sm text-slate-600 hover:text-red-600 flex items-center gap-1"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
