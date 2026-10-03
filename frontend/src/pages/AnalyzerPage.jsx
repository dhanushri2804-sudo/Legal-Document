import { CalendarPlus, FileSearch, Upload } from 'lucide-react';
import { useState } from 'react';
import api from '../api';

export default function AnalyzerPage() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const analyze = async (event) => {
    event.preventDefault();
    if (!file) return;
    setLoading(true);
    setError('');
    setNotice('');
    setAnalysis(null);
    const data = new FormData();
    data.append('file', file);
    try {
      const response = await api.post('/analyzer/analyze', data);
      setAnalysis(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Unable to analyze this file. Please try another PDF or DOCX.');
    } finally {
      setLoading(false);
    }
  };

  const addReminder = async (item) => {
    try {
      await api.post('/reminders', { title: `Review date: ${item.source_text}`, due_date: item.date, notes: `Extracted from ${analysis.filename}` });
      setNotice(`Reminder added for ${item.date}.`);
    } catch (requestError) {
      setNotice(requestError.response?.data?.detail || 'Could not save this reminder.');
    }
  };

  return (
    <div className="app-shell py-12">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-gold"><FileSearch className="h-6 w-6" /></div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">AI workspace</p>
          <h1 className="text-4xl font-black text-navy">Contract Analyzer</h1>
        </div>
      </div>
      <div className="mx-auto max-w-4xl">
        <form onSubmit={analyze} className="soft-panel p-6 md:p-8">
          <p className="text-slate-600">Upload a text-based PDF or DOCX to review its summary, clauses, missing details, and dates. Files are analyzed in memory and are not saved to your account.</p>
          <label className="label-text mt-6" htmlFor="contract-file">Contract file (PDF or DOCX, up to 10 MB)</label>
          <input id="contract-file" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="input-field" onChange={(event) => { setFile(event.target.files?.[0] || null); setAnalysis(null); }} />
          <button className="primary-button mt-5 w-full" type="submit" disabled={loading || !file}>
            {loading ? 'Analyzing contract...' : <><Upload className="mr-2 h-4 w-4" /> Analyze contract</>}
          </button>
          {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        </form>

        {analysis && (
          <div className="mt-8 space-y-6">
            <div className="soft-panel p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-navy">{analysis.filename}</h2>
                <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-navy">{analysis.mode === 'ai-assisted' ? 'AI-assisted review' : 'Local review'}</span>
              </div>
              <h3 className="mt-6 font-bold text-navy">Summary</h3>
              <p className="mt-2 whitespace-pre-wrap text-slate-700">{analysis.summary}</p>
              {analysis.ai_review && <div className="mt-5 rounded-xl bg-slate-50 p-4"><h3 className="font-bold text-navy">AI review notes</h3><p className="mt-2 whitespace-pre-wrap text-slate-700">{analysis.ai_review}</p></div>}
              <h3 className="mt-6 font-bold text-navy">Clauses found</h3>
              {analysis.clauses.length ? <ul className="mt-3 space-y-3">{analysis.clauses.map((clause) => <li key={clause.name} className="rounded-xl border border-slate-200 p-4"><strong className="text-navy">{clause.name}</strong><p className="mt-1 text-sm text-slate-600">{clause.excerpt}</p></li>)}</ul> : <p className="mt-2 text-slate-600">No common clause language was detected.</p>}
              <h3 className="mt-6 font-bold text-navy">Details to review</h3>
              {analysis.missing_information.length ? <ul className="mt-2 list-inside list-disc space-y-1 text-slate-700">{analysis.missing_information.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mt-2 text-slate-600">No obvious gaps were detected by the initial checks.</p>}
              <h3 className="mt-6 font-bold text-navy">Dates detected</h3>
              {analysis.dates.length ? <ul className="mt-3 space-y-2">{analysis.dates.map((item) => <li key={`${item.date}-${item.source_text}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"><span className="text-slate-700">{item.source_text} <span className="text-sm text-slate-500">({item.date})</span></span><button type="button" onClick={() => addReminder(item)} className="secondary-button !px-3 !py-2 text-sm"><CalendarPlus className="mr-2 h-4 w-4" /> Add reminder</button></li>)}</ul> : <p className="mt-2 text-slate-600">No dates in a recognized format were found.</p>}
              {notice && <p role="status" className="mt-4 text-sm text-emerald-700">{notice}</p>}
              <p className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-500">{analysis.notice}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
