import { MessageCircle, Send, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api';

const suggestedQuestions = [
  'Summarize this document in plain English.',
  'Explain the termination clause.',
  'What obligations does each party have?',
];

export default function AssistantPage() {
  const [documents, setDocuments] = useState([]);
  const [documentId, setDocumentId] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/documents')
      .then((response) => setDocuments(response.data))
      .catch(() => setError('Unable to load your documents. Please refresh and try again.'))
      .finally(() => setLoading(false));
  }, []);

  const askQuestion = async (event) => {
    event.preventDefault();
    if (!documentId || !question.trim()) return;
    setAsking(true);
    setError('');
    setAnswer(null);
    try {
      const response = await api.post('/assistant/ask', { document_id: Number(documentId), question: question.trim() });
      setAnswer(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Unable to answer right now. Please try again.');
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="app-shell py-12">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-gold"><MessageCircle className="h-6 w-6" /></div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">AI workspace</p>
          <h1 className="text-4xl font-black text-navy">Legal Assistant</h1>
        </div>
      </div>
      <div className="mx-auto max-w-3xl soft-panel p-6 md:p-8">
        <p className="text-slate-600">Ask questions about one of your saved drafts, get clauses explained in plain English, or request a summary.</p>
        <label className="label-text mt-6">Choose a document</label>
        <select className="input-field" value={documentId} onChange={(event) => setDocumentId(event.target.value)} disabled={loading}>
          <option value="">{loading ? 'Loading documents...' : 'Select a document'}</option>
          {documents.map((document) => <option key={document.id} value={document.id}>{document.title}</option>)}
        </select>
        {documents.length === 0 && !loading && <p className="mt-2 text-sm text-slate-500">Create a document before using the assistant.</p>}

        <div className="mt-5 flex flex-wrap gap-2">
          {suggestedQuestions.map((suggestion) => (
            <button key={suggestion} type="button" className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:border-gold" onClick={() => setQuestion(suggestion)}>{suggestion}</button>
          ))}
        </div>
        <form onSubmit={askQuestion} className="mt-5">
          <label className="label-text" htmlFor="assistant-question">Your question</label>
          <textarea id="assistant-question" className="input-field min-h-28" maxLength={2000} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about a clause, responsibility, or legal term..." required />
          <button className="primary-button mt-4 w-full" type="submit" disabled={asking || !documentId}>
            {asking ? 'Reviewing document...' : <><Send className="mr-2 h-4 w-4" /> Ask about this document</>}
          </button>
        </form>
        {error && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {answer && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5" aria-live="polite">
            <h2 className="flex items-center gap-2 font-bold text-navy"><Sparkles className="h-4 w-4 text-gold" /> Response {answer.mode === 'ai' ? '(AI-assisted)' : '(local text match)'}</h2>
            <p className="mt-3 whitespace-pre-wrap text-slate-700">{answer.answer}</p>
            {answer.notice && <p className="mt-4 border-t border-slate-200 pt-3 text-xs text-slate-500">{answer.notice}</p>}
          </section>
        )}
        <p className="mt-6 text-xs text-slate-500">This tool provides general information, not legal advice. Have important documents reviewed by a qualified lawyer.</p>
      </div>
    </div>
  );
}
