import { ArrowRight, UserCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="app-shell py-12">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy text-gold">
            <UserCircle2 className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Profile</p>
            <h1 className="text-3xl font-black text-navy">{user?.name || 'User Profile'}</h1>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Full name</p>
            <p className="mt-2 text-lg font-semibold text-slate-800">{user?.name}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Email address</p>
            <p className="mt-2 text-lg font-semibold text-slate-800">{user?.email}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/dashboard" className="primary-button">Go to Dashboard</Link>
          <Link to="/documents/new" className="secondary-button">Create a Document</Link>
        </div>
      </div>
    </div>
  );
}
