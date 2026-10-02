import { Download, FileText, LoaderCircle, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function EditorPage() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

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

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasChanges) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const handleSave = async () => {
    if (!document) return;
    setSaving(true);
    setStatus('');

    try {
      await api.put(`/documents/${id}`, { content: document.content, title: document.title, document_type: document.document_type, parties: document.parties, terms: document.terms, effective_date: document.effective_date, jurisdiction: document.jurisdiction || '', additional_instructions: document.additional_instructions || '', company_name: document.company_name || '' });
      setHasChanges(false);
      setStatus('Changes saved successfully.');
    } catch (error) {
      setStatus('Unable to save changes right now.');
    } finally {
      setSaving(false);
    }
  };

  const downloadDocument = async (format) => {
    try {
      const response = await api.get(`/documents/${id}/download?format=${format}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${document.title || 'document'}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setStatus('Download failed. Please try again.');
    }
  };

  if (loading) {
    return <div className="app-shell py-16 text-center text-lg text-slate-700">Loading document editor...</div>;
  }

  if (!document) {
    return <div className="app-shell py-16 text-center text-lg text-slate-700">Document not found.</div>;
  }

  return (
    <div className="app-shell py-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Editor</p>
          <h1 className="mt-2 text-4xl font-black text-navy">{document.title}</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleSave} className="primary-button" disabled={saving}>
            {saving ? <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
          </button>
          <button onClick={() => downloadDocument('pdf')} className="secondary-button"><Download className="mr-2 h-4 w-4" /> PDF</button>
          <button onClick={() => downloadDocument('docx')} className="secondary-button"><Download className="mr-2 h-4 w-4" /> DOCX</button>
          <button onClick={() => downloadDocument('txt')} className="secondary-button"><Download className="mr-2 h-4 w-4" /> TXT</button>
        </div>
      </div>

      <div className="soft-panel p-6 md:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="label-text">Document title</label>
            <input className="input-field" value={document.title} onChange={(e) => { setDocument({ ...document, title: e.target.value }); setHasChanges(true); }} />
          </div>
          <div>
            <label className="label-text">Document type</label>
            <input className="input-field" value={document.document_type} onChange={(e) => { setDocument({ ...document, document_type: e.target.value }); setHasChanges(true); }} />
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <label className="label-text mb-0">Document content</label>
            <span className="text-sm text-slate-500">{hasChanges ? 'Unsaved changes' : 'All changes saved'}</span>
          </div>
          <textarea className="input-field min-h-[440px]" value={document.content} onChange={(e) => { setDocument({ ...document, content: e.target.value }); setHasChanges(true); }} />
        </div>

        {status && <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{status}</div>}
      </div>
    </div>
  );
}
