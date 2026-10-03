import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { featureCards } from './HomePage';
import { useAuth } from '../context/AuthContext';

export default function FeaturesPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-shell py-12 md:py-16">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">LegalEase features</p>
        <h1 className="section-title mt-3">Everything you need to draft smarter.</h1>
        <p className="mt-5 text-lg text-slate-600">
          Explore document drafting, AI assistance, secure storage, reusable templates, and tools for managing your legal workflow.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {featureCards.map(({ icon: Icon, title, description }) => (
          <article key={title} className="card-glow rounded-3xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-gold">
              <Icon className="h-6 w-6" />
            </div>
            <h2 className="mb-3 text-xl font-bold text-navy">{title}</h2>
            <p className="text-slate-600">{description}</p>
          </article>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link to={isAuthenticated ? '/dashboard' : '/register'} className="primary-button">
          Get started <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
