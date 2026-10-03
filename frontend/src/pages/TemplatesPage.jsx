import { FileText, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const templates = [
  { title: 'Employment Agreement', type: 'Employment Contract', category: 'Work', description: 'Outline role, compensation, confidentiality, and termination terms.', terms: 'Describe the job responsibilities, compensation, benefits, working hours, confidentiality requirements, and termination notice.' },
  { title: 'Independent Contractor Agreement', type: 'Freelance Contract', category: 'Work', description: 'Set project scope, fees, deliverables, and intellectual-property expectations.', terms: 'Describe project scope, deliverables, deadlines, payment milestones, expenses, and ownership of work product.' },
  { title: 'Non-Disclosure Agreement', type: 'Non-Disclosure Agreement', category: 'Business', description: 'Document confidential information, permitted use, and protection duties.', terms: 'Identify confidential information, permitted use, exclusions, handling requirements, and the duration of confidentiality.' },
  { title: 'Residential Lease', type: 'Lease Agreement', category: 'Property', description: 'Capture tenancy dates, rent, deposit, maintenance, and notice terms.', terms: 'Describe the property, lease term, rent schedule, deposit, utilities, maintenance responsibilities, and notice requirements.' },
  { title: 'Employment Offer Letter', type: 'Employment Offer Letter', category: 'Work', description: 'Present a role, proposed start date, compensation, and offer conditions.', terms: 'Describe the position, reporting line, compensation, benefits, proposed start date, and any conditions of employment.' },
  { title: 'General Services Agreement', type: 'General Agreement', category: 'Business', description: 'Define services, responsibilities, fees, and a practical end-of-service process.', terms: 'Describe the services, each party’s responsibilities, fees and expenses, timelines, and termination process.' },
];

const categories = ['All', ...new Set(templates.map((template) => template.category))];

export default function TemplatesPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const visibleTemplates = useMemo(() => templates.filter((template) => {
    const matchesCategory = category === 'All' || template.category === category;
    const searchText = `${template.title} ${template.description} ${template.category}`.toLowerCase();
    return matchesCategory && searchText.includes(query.trim().toLowerCase());
  }), [category, query]);

  return (
    <div className="app-shell py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Reusable drafting starts</p>
        <h1 className="mt-2 text-4xl font-black text-navy">Template Library</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Browse starting points, then tailor the fields to your situation. Templates are drafts and should be reviewed for your jurisdiction.</p>
      </div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search templates</span>
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className="input-field !mt-0 pl-11" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search templates..." />
        </label>
        <select className="input-field !mt-0 md:max-w-xs" aria-label="Filter by category" value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      {visibleTemplates.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleTemplates.map((template) => (
            <article key={template.title} className="soft-panel flex flex-col p-6">
              <div className="flex items-center justify-between gap-3"><span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-navy">{template.category}</span><FileText className="h-5 w-5 text-gold" /></div>
              <h2 className="mt-5 text-xl font-bold text-navy">{template.title}</h2>
              <p className="mt-2 flex-1 text-slate-600">{template.description}</p>
              <Link to="/documents/new" state={{ template }} className="primary-button mt-6">Customize this template</Link>
            </article>
          ))}
        </div>
      ) : <div className="soft-panel p-10 text-center text-slate-600">No templates match your search. Try another term or category.</div>}
      <p className="mt-8 text-xs text-slate-500">Templates are educational starting points, not legal advice or jurisdiction-specific forms.</p>
    </div>
  );
}
