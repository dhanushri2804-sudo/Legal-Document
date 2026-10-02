import { FileText, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function MyDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/documents')
      .then((response) => setDocuments(response.data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="app-shell py-16 text-center text-lg text-slate-700">Loading your documents...</div>;
  }

  return (
    <div className="app-shell py-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Documents</p>
          <h1 className="mt-2 text-4xl font-black text-navy">My Documents</h1>
        </div>
        <Link to="/documents/new" className="primary-button">
          <Plus className="mr-2 h-4 w-4" /> New Draft
        </Link>
      </div>

      {documents.length === 0 ? (
        <div className="soft-panel p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-gold" />
          <h2 className="mt-4 text-2xl font-bold text-navy">No documents yet</h2>
          <p className="mt-2 text-slate-600">Create your first draft to begin managing legal documentation.</p>
          <Link to="/documents/new" className="primary-button mt-6">Create Document</Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {documents.map((document) => (
            <div key={document.id} className="soft-panel p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-navy">{document.document_type}</span>
                <span className="text-xs text-slate-500">{new Date(document.created_at).toLocaleDateString()}</span>
              </div>
              <h2 className="text-2xl font-bold text-navy">{document.title}</h2>
              <p className="mt-3 line-clamp-3 text-slate-600">{document.content.slice(0, 140)}...</p>
              <div className="mt-6 flex gap-3">
                <Link to={`/documents/${document.id}`} className="secondary-button flex-1 justify-center">View</Link>
                <Link to={`/documents/${document.id}/edit`} className="primary-button flex-1 justify-center">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
