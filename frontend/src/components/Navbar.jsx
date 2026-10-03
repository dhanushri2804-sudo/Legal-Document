import { FileText, Menu, ShieldCheck, UserCircle2, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/#features', label: 'Features' },
  { to: '/#how-it-works', label: 'How It Works' },
  { to: '/#document-types', label: 'Document Types' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="app-shell flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-white shadow-soft">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-black tracking-tight text-navy">LegalEase</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-navy' : 'text-slate-600 hover:text-navy'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="secondary-button">Dashboard</Link>
              <Link to="/tools/assistant" className="hidden text-sm font-semibold text-slate-700 hover:text-navy xl:inline">Assistant</Link>
              <Link to="/tools/analyzer" className="hidden text-sm font-semibold text-slate-700 hover:text-navy xl:inline">Analyzer</Link>
              <Link to="/templates" className="hidden text-sm font-semibold text-slate-700 hover:text-navy xl:inline">Templates</Link>
              <Link to="/workflows" className="hidden text-sm font-semibold text-slate-700 hover:text-navy xl:inline">Workflows</Link>
              <Link to="/profile" className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                <UserCircle2 className="h-4 w-4" />
                {user?.name || 'Profile'}
              </Link>
              <button onClick={handleLogout} className="primary-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="secondary-button">Login</Link>
              <Link to="/register" className="primary-button">Get Started</Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-slate-700"
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="secondary-button">Dashboard</Link>
                <Link to="/tools/assistant" onClick={() => setMobileOpen(false)} className="secondary-button">Legal Assistant</Link>
                <Link to="/tools/analyzer" onClick={() => setMobileOpen(false)} className="secondary-button">Contract Analyzer</Link>
                <Link to="/templates" onClick={() => setMobileOpen(false)} className="secondary-button">Template Library</Link>
                <Link to="/workflows" onClick={() => setMobileOpen(false)} className="secondary-button">Signatures & Reminders</Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="secondary-button">Profile</Link>
                <button onClick={handleLogout} className="primary-button">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="secondary-button">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="primary-button">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
