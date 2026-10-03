import { CalendarClock, FileSignature, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api';

const emptySignature = { document_id: '', recipient_name: '', recipient_email: '' };
const emptyReminder = { title: '', due_date: '', document_id: '', notes: '' };

export default function WorkflowPage() {
  const [documents, setDocuments] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [signatureForm, setSignatureForm] = useState(emptySignature);
  const [reminderForm, setReminderForm] = useState(emptyReminder);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadWorkflows = async () => {
    const [docsResponse, signaturesResponse, remindersResponse] = await Promise.all([
      api.get('/documents'),
      api.get('/signatures'),
      api.get('/reminders'),
    ]);
    setDocuments(docsResponse.data);
    setSignatures(signaturesResponse.data);
    setReminders(remindersResponse.data);
  };

  useEffect(() => {
    loadWorkflows()
      .catch(() => setError('Unable to load workflow records. Please refresh and try again.'))
      .finally(() => setLoading(false));
  }, []);

  const createSignature = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await api.post('/signatures', { ...signatureForm, document_id: Number(signatureForm.document_id) });
      setSignatureForm(emptySignature);
      await loadWorkflows();
      setNotice('Signature request added to your tracker. No email has been sent.');
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Unable to add this signature request.');
    } finally {
      setSaving(false);
    }
  };

  const createReminder = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await api.post('/reminders', { ...reminderForm, document_id: reminderForm.document_id ? Number(reminderForm.document_id) : null });
      setReminderForm(emptyReminder);
      await loadWorkflows();
      setNotice('Reminder saved.');
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Unable to save this reminder.');
    } finally {
      setSaving(false);
    }
  };

  const updateSignature = async (id, status) => {
    setError('');
    try {
      await api.patch(`/signatures/${id}`, { status });
      await loadWorkflows();
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Unable to update the signature status.');
    }
  };

  const updateReminder = async (reminder) => {
    setError('');
    try {
      await api.patch(`/reminders/${reminder.id}`, { completed: !reminder.completed });
      await loadWorkflows();
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Unable to update this reminder.');
    }
  };

  if (loading) return <div className="app-shell py-16 text-center text-lg text-slate-700">Loading workflow records...</div>;

  return (
    <div className="app-shell py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Document workflow</p>
        <h1 className="mt-2 text-4xl font-black text-navy">Signatures & Reminders</h1>
        <p className="mt-3 max-w-3xl text-slate-600">Track who needs to sign and keep important dates visible. Signature statuses are manually tracked here; this app does not send emails or collect legally binding signatures.</p>
      </div>
      {(error || notice) && <div role={error ? 'alert' : 'status'} className={`mb-6 rounded-xl border p-3 text-sm ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>{error || notice}</div>}

      <div className="grid items-start gap-8 xl:grid-cols-2">
        <section className="soft-panel p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3"><FileSignature className="h-6 w-6 text-gold" /><h2 className="text-2xl font-bold text-navy">Signature tracker</h2></div>
          <form onSubmit={createSignature} className="space-y-4">
            <div><label className="label-text">Document</label><select className="input-field" value={signatureForm.document_id} onChange={(event) => setSignatureForm({ ...signatureForm, document_id: event.target.value })} required><option value="">Select a document</option>{documents.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="label-text">Recipient name</label><input className="input-field" value={signatureForm.recipient_name} onChange={(event) => setSignatureForm({ ...signatureForm, recipient_name: event.target.value })} minLength={2} maxLength={100} required /></div>
              <div><label className="label-text">Recipient email</label><input type="email" className="input-field" value={signatureForm.recipient_email} onChange={(event) => setSignatureForm({ ...signatureForm, recipient_email: event.target.value })} required /></div>
            </div>
            <button type="submit" className="primary-button w-full" disabled={saving || !documents.length}><Plus className="mr-2 h-4 w-4" /> Add to tracker</button>
          </form>
          <div className="mt-7 space-y-3">
            {signatures.length ? signatures.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold text-navy">{item.recipient_name}</h3><p className="text-sm text-slate-500">{item.recipient_email}</p><p className="mt-1 text-sm text-slate-700">{item.document_title}</p></div>
                  <select aria-label={`Status for ${item.recipient_name}`} className="rounded-lg border border-slate-200 p-2 text-sm" value={item.status} onChange={(event) => updateSignature(item.id, event.target.value)}>{['pending', 'signed', 'declined', 'cancelled'].map((value) => <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}</select>
                </div>
              </article>
            )) : <p className="rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">No signature requests to track yet.</p>}
          </div>
        </section>

        <section className="soft-panel p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3"><CalendarClock className="h-6 w-6 text-gold" /><h2 className="text-2xl font-bold text-navy">Important dates</h2></div>
          <form onSubmit={createReminder} className="space-y-4">
            <div><label className="label-text">Reminder title</label><input className="input-field" value={reminderForm.title} onChange={(event) => setReminderForm({ ...reminderForm, title: event.target.value })} placeholder="e.g. Renewal deadline" minLength={3} maxLength={200} required /></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><label className="label-text">Due date</label><input type="date" className="input-field" value={reminderForm.due_date} onChange={(event) => setReminderForm({ ...reminderForm, due_date: event.target.value })} required /></div>
              <div><label className="label-text">Related document (optional)</label><select className="input-field" value={reminderForm.document_id} onChange={(event) => setReminderForm({ ...reminderForm, document_id: event.target.value })}><option value="">No linked document</option>{documents.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></div>
            </div>
            <div><label className="label-text">Notes (optional)</label><input className="input-field" value={reminderForm.notes} onChange={(event) => setReminderForm({ ...reminderForm, notes: event.target.value })} maxLength={2000} /></div>
            <button type="submit" className="primary-button w-full" disabled={saving}><Plus className="mr-2 h-4 w-4" /> Save reminder</button>
          </form>
          <div className="mt-7 space-y-3">
            {reminders.length ? reminders.map((item) => (
              <label key={item.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${item.completed ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200'}`}>
                <input type="checkbox" className="mt-1" checked={item.completed} onChange={() => updateReminder(item)} />
                <span className="min-w-0 flex-1"><span className={`block font-semibold ${item.completed ? 'text-slate-500 line-through' : 'text-navy'}`}>{item.title}</span><span className="mt-1 block text-sm text-slate-500">{new Date(`${item.due_date}T00:00:00`).toLocaleDateString()} {item.document_title && `· ${item.document_title}`}</span>{item.notes && <span className="mt-1 block text-sm text-slate-600">{item.notes}</span>}</span>
              </label>
            )) : <p className="rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">No reminders saved yet. Add due dates manually or create one from a date found in the analyzer.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
