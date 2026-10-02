import { ArrowLeft, Download, Edit3, FileText, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api';

export default function DocumentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await api.get(`/documents/${id}`);
        setDocument(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await api.delete(`/documents/${id}`);
      navigate('/documents');
    } catch (error) {
      console.error(error);
    }
  };

  const downloadDocument = async (format) => {
    try {
      const response = await api.get(`/documents/${id}/download?format=${format}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${document.title}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="app-shell py-16 text-center text-lg text-slate-700">Loading document details...</div>;
  }

  if (!document) {
    return <div className="app-shell py-16 text-center text-lg text-slate-700">Document not found.</div>;
  }

  return (
    <div className="app-shell py-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link to="/documents" className="secondary-button inline-flex">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Documents
        </Link>

        <div className="flex gap-3">
          <Link to={`/documents/${id}/edit`} className="primary-button"><Edit3 className="mr-2 h-4 w-4" /> Edit</Link>
          <button onClick={handleDelete} className="secondary-button text-red-700 border-red-200 hover:bg-red-50">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </button>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <aside className="soft-panel p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-navy p-3 text-gold"><FileText className="h-5 w-5" /></div>
            <div>
              <p className="text-sm text-slate-500">Document type</p>
              <h2 className="text-xl font-bold text-navy">{document.document_type}</h2>
            </div>
          </div>

          <dl className="space-y-4 text-sm text-slate-600">
            <div><dt className="font-semibold text-slate-800">Title</dt><dd>{document.title}</dd></div>
            <div><dt className="font-semibold text-slate-800">Effective Date</dt><dd>{document.effective_date}</dd></div>
            <div><dt className="font-semibold text-slate-800">Jurisdiction</dt><dd>{document.jurisdiction || 'Not specified'}</dd></div>
            <div><dt className="font-semibold text-slate-800">Company Name</dt><dd>{document.company_name || 'Not specified'}</dd></div>
            <div><dt className="font-semibold text-slate-800">Parties</dt><dd>{document.parties}</dd></div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => downloadDocument('pdf')} className="secondary-button"><Download className="mr-2 h-4 w-4" /> PDF</button>
            <button onClick={() => downloadDocument('docx')} className="secondary-button"><Download className="mr-2 h-4 w-4" /> DOCX</button>
            <button onClick={() => downloadDocument('txt')} className="secondary-button"><Download className="mr-2 h-4 w-4" /> TXT</button>
          </div>
        </aside>

        <div className="soft-panel p-6">
          <h1 className="text-3xl font-black text-navy">{document.title}</h1>
          <div className="mt-6 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-700">{document.content}</div>
        </div>
      </div>
    </div>
  );
}
