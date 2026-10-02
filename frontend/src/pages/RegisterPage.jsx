import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await register(form);
      setSuccess('Registration successful. Redirecting to your dashboard...');
      setTimeout(() => navigate('/dashboard'), 700);
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to register right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell py-16">
      <div className="mx-auto grid max-w-5xl gap-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft lg:grid-cols-2">
        <div className="rounded-[1.5rem] bg-navy p-8 text-white">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold text-navy">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-gold">Secure access</p>
              <h2 className="text-2xl font-bold">Create your account</h2>
            </div>
          </div>
          <ul className="space-y-4 text-slate-200">
            <li>• AI-assisted legal drafting</li>
            <li>• Protected document workspace</li>
            <li>• PDF, DOCX, and TXT export</li>
            <li>• Professional support for everyday legal workflows</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-8">
          <h1 className="text-3xl font-black text-navy">Get Started</h1>
          <p className="mt-2 text-slate-600">Create an account to generate and manage legal drafts.</p>

          {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          {success && <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</div>}

          <div className="mt-6 space-y-5">
            <div>
              <label className="label-text">Full name</label>
              <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label-text">Email address</label>
              <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="label-text">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} className="input-field pr-12" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                <button type="button" aria-label="Toggle password visibility" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <button type="submit" className="primary-button mt-7 w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>

          <p className="mt-5 text-center text-sm text-slate-600">
            Already have an account? <Link to="/login" className="font-semibold text-navy">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
