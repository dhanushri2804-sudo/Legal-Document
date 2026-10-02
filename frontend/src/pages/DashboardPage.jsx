import { FileText, Plus, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/dashboard')
      .then((response) => setDashboard(response.data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="app-shell py-16 text-center text-lg text-slate-700">Loading dashboard...</div>;
  }

  if (!dashboard) {
    return <div className="app-shell py-16 text-center text-lg text-slate-700">Unable to load dashboard data.</div>;
  }

  return (
    <div className="app-shell py-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Dashboard</p>
          <h1 className="mt-2 text-4xl font-black text-navy">{dashboard.welcome}</h1>
        </div>
        <Link to="/documents/new" className="primary-button">
          <Plus className="mr-2 h-4 w-4" /> Create New Document
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="soft-panel p-6">
          <p className="text-sm font-medium text-slate-500">Total Documents</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="rounded-2xl bg-navy p-3 text-gold"><FileText className="h-5 w-5" /></div>
            <span className="text-3xl font-black text-navy">{dashboard.total_documents}</span>
          </div>
        </div>

        <div className="soft-panel p-6">
          <p className="text-sm font-medium text-slate-500">Document Types</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="rounded-2xl bg-gold/20 p-3 text-navy"><TrendingUp className="h-5 w-5" /></div>
            <span className="text-3xl font-black text-navy">{dashboard.document_stats.length}</span>
          </div>
        </div>

        <div className="soft-panel p-6">
          <p className="text-sm font-medium text-slate-500">Quick Action</p>
          <div className="mt-4">
            <Link to="/documents" className="secondary-button w-full">View My Documents</Link>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="soft-panel p-6">
          <h2 className="text-2xl font-bold text-navy">Recently Created Documents</h2>
          {dashboard.recent_documents.length > 0 ? (
            <div className="mt-6 space-y-4">
              {dashboard.recent_documents.map((doc) => (
                <Link key={doc.id} to={`/documents/${doc.id}`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-gold">
                  <div>
                    <p className="font-semibold text-slate-800">{doc.title}</p>
                    <p className="text-sm text-slate-500">{doc.document_type}</p>
                  </div>
                  <span className="text-sm text-slate-500">{new Date(doc.created_at).toLocaleDateString()}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
              You have not created a document yet. Start with a new draft.
            </div>
          )}
        </div>

        <div className="soft-panel p-6">
          <h2 className="text-2xl font-bold text-navy">Document Type Statistics</h2>
          <div className="mt-6 space-y-4">
            {dashboard.document_stats.length > 0 ? (
              dashboard.document_stats.map((stat) => (
                <div key={stat.name}>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                    <span>{stat.name}</span>
                    <span>{stat.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-gold" style={{ width: `${Math.min((stat.count / Math.max(dashboard.total_documents, 1)) * 100, 100)}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
                No document stats yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
