import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="app-shell flex min-h-[60vh] items-center justify-center py-16">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">404</p>
        <h1 className="mt-3 text-5xl font-black text-navy">Page Not Found</h1>
        <p className="mt-4 text-slate-600">The page you are looking for could not be found.</p>
        <Link to="/" className="primary-button mt-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> Return Home
        </Link>
      </div>
    </div>
  );
}
