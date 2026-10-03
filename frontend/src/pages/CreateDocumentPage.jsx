import { FileText, LoaderCircle, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';

const defaultForm = {
  title: '',
  document_type: 'Employment Contract',
  parties: '',
  terms: '',
  effective_date: '',
  jurisdiction: '',
  additional_instructions: '',
  company_name: '',
};

export default function CreateDocumentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.documentType) {
      setForm((current) => ({ ...current, document_type: location.state.documentType }));
    }
    if (location.state?.template) {
      const { title, type, terms } = location.state.template;
      setForm((current) => ({ ...current, title, document_type: type, terms }));
    }
  }, [location.state]);

  const handleChange = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...form,
        logo_filename: logoFile ? logoFile.name : null,
      };
      const response = await api.post('/documents/generate', payload);
      navigate(`/documents/${response.data.document.id}/edit`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to generate the document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell py-12">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-gold">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Create</p>
          <h1 className="text-4xl font-black text-navy">New Legal Document</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="soft-panel p-6 md:p-8">
          {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="label-text">Document title</label>
              <input className="input-field" value={form.title} onChange={(e) => handleChange('title', e.target.value)} required />
            </div>

            <div>
              <label className="label-text">Document type</label>
              <select className="input-field" value={form.document_type} onChange={(e) => handleChange('document_type', e.target.value)}>
                <option>Employment Contract</option>
                <option>Non-Disclosure Agreement</option>
                <option>Lease Agreement</option>
                <option>Freelance Contract</option>
                <option>Employment Offer Letter</option>
                <option>General Agreement</option>
              </select>
            </div>

            <div>
              <label className="label-text">Effective date</label>
              <input type="date" className="input-field" value={form.effective_date} onChange={(e) => handleChange('effective_date', e.target.value)} required />
            </div>

            <div className="md:col-span-2">
              <label className="label-text">Parties involved</label>
              <textarea className="input-field min-h-[100px]" value={form.parties} onChange={(e) => handleChange('parties', e.target.value)} required />
            </div>

            <div className="md:col-span-2">
              <label className="label-text">Terms and conditions</label>
              <textarea className="input-field min-h-[180px]" value={form.terms} onChange={(e) => handleChange('terms', e.target.value)} required />
            </div>

            <div>
              <label className="label-text">Jurisdiction</label>
              <input className="input-field" value={form.jurisdiction} onChange={(e) => handleChange('jurisdiction', e.target.value)} />
            </div>

            <div>
              <label className="label-text">Company name</label>
              <input className="input-field" value={form.company_name} onChange={(e) => handleChange('company_name', e.target.value)} />
            </div>

            <div className="md:col-span-2">
              <label className="label-text">Additional instructions</label>
              <textarea className="input-field min-h-[120px]" value={form.additional_instructions} onChange={(e) => handleChange('additional_instructions', e.target.value)} />
            </div>

            <div className="md:col-span-2">
              <label className="label-text">Logo upload</label>
              <input type="file" className="input-field" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} accept="image/*" />
            </div>
          </div>

          <button type="submit" className="primary-button mt-8 w-full" disabled={loading}>
            {loading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Generating document...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Generate Document
              </>
            )}
          </button>
        </div>

        <aside className="soft-panel p-6 md:p-8">
          <h2 className="text-2xl font-bold text-navy">Draft Preview</h2>
          <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p><span className="font-semibold text-slate-800">Title:</span> {form.title || 'Untitled draft'}</p>
            <p><span className="font-semibold text-slate-800">Type:</span> {form.document_type}</p>
            <p><span className="font-semibold text-slate-800">Effective:</span> {form.effective_date || 'Not specified'}</p>
            <p><span className="font-semibold text-slate-800">Parties:</span> {form.parties || 'Not yet specified'}</p>
            <p><span className="font-semibold text-slate-800">Company:</span> {form.company_name || 'Not specified'}</p>
            <p><span className="font-semibold text-slate-800">Logo:</span> {logoFile ? logoFile.name : 'No file uploaded'}</p>
          </div>
        </aside>
      </form>
    </div>
  );
}
