import { FileText, Mail, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-navy text-slate-200">
      <div className="app-shell grid gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-navy">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xl font-black text-white">LegalEase</span>
          </div>
          <p className="text-sm text-slate-300">
            AI-powered drafting, secure storage, and straightforward document management built for modern legal work.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-gold">Navigation</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/documents">My Documents</Link></li>
            <li><Link to="/documents/new">Create Document</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-gold">Contact</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> contact@legalease.ai</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Privacy-first workflow</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-gold">Legal</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link to="/">Privacy Policy</Link></li>
            <li><Link to="/">Terms of Service</Link></li>
            <li className="text-slate-300">AI legal disclaimer: outputs are drafting aids and not legal advice.</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
