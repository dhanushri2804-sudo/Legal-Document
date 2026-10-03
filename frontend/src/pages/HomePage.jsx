import { ArrowRight, BadgeCheck, BookOpen, BriefcaseBusiness, CalendarClock, FileCheck2, FileSearch, FileSignature, FileText, GanttChart, History, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const featureCards = [
  { icon: Sparkles, title: 'AI-Powered Document Generation', description: 'Turn your inputs into polished legal drafts with guided prompts and professional structure.' },
  { icon: FileText, title: 'Editable Document Preview', description: 'Review, revise, and refine every clause in a clean, distraction-free editor.' },
  { icon: FileCheck2, title: 'PDF, DOCX, and TXT Downloads', description: 'Export ready-to-share files in the formats your workflow needs most.' },
  { icon: ShieldCheck, title: 'Secure Document Storage', description: 'Keep user-specific documents protected and organized in a personal workspace.' },
  { icon: GanttChart, title: 'Professional Formatting', description: 'Keep each draft consistent, readable, and presentation-ready for clients or teams.' },
  { icon: BriefcaseBusiness, title: 'Easy Document Management', description: 'See all your drafts, edit details, and track recent activity from one dashboard.' },
  { icon: MessageCircle, title: 'AI Legal Assistant', description: 'Ask questions about saved drafts, understand legal terms, and get plain-English summaries.' },
  { icon: FileSearch, title: 'AI Contract Analyzer', description: 'Review PDF and DOCX files for key clauses, missing details, and dates worth checking.' },
  { icon: FileSignature, title: 'E-Signature Status Tracking', description: 'Keep recipient and signing status details together; connect a signing provider for legally binding e-signatures.' },
  { icon: History, title: 'Document Version History', description: 'Compare saved drafts and restore an earlier version when you need to revisit changes.' },
  { icon: BookOpen, title: 'Smart Template Library', description: 'Search reusable starting points by category and customize them for your situation.' },
  { icon: CalendarClock, title: 'Important Date Reminders', description: 'Track renewal and expiry dates, and turn dates found during contract analysis into reminders.' },
];

const steps = [
  'Choose a document type.',
  'Enter your details and generate a draft.',
  'Edit, save, and download your document.',
];

const documentTypes = [
  'Employment Contracts',
  'Non-Disclosure Agreements',
  'Lease Agreements',
  'Freelance Contracts',
  'Employment Offer Letters',
  'General Agreements',
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const section = document.getElementById(location.hash.slice(1));
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [location.hash]);

  return (
    <div>
      <section className="app-shell grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-sm font-medium text-navy">
            <BadgeCheck className="h-4 w-4" /> Trusted legal drafting platform
          </div>
          <h1 className="max-w-xl text-5xl font-black tracking-tight text-navy md:text-6xl">
            Legal Documents. Made Simple.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-600">
            LegalEase helps you create, edit, and download professional legal draft documents with AI-powered guidance, secure storage, and clean formatting.
          </p>
          <div className="relative z-10 mt-8 flex flex-wrap items-center gap-4">
            <Link to={isAuthenticated ? '/documents/new' : '/register'} className="primary-button relative z-10 cursor-pointer pointer-events-auto">
              Create Your Document
            </Link>
            <Link to="/#features" className="secondary-button relative z-10 cursor-pointer pointer-events-auto">Explore Features</Link>
          </div>
        </div>

        <div className="relative">
          <div className="grid-pattern pointer-events-none absolute -left-8 top-8 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
          <div className="soft-panel relative overflow-hidden p-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-sm text-slate-500">Document Draft</p>
                <h3 className="text-2xl font-bold text-navy">Employment Contract</h3>
              </div>
              <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Draft Ready</div>
            </div>
            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between font-medium text-slate-700">
                  <span>Employer</span>
                  <span>Northbridge Legal</span>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between font-medium text-slate-700">
                  <span>Employee</span>
                  <span>Elena Morris</span>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between font-medium text-slate-700">
                  <span>Effective Date</span>
                  <span>2026-11-01</span>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h4 className="mb-2 text-sm font-semibold uppercase text-slate-500">Key Terms</h4>
                <ul className="space-y-2 text-slate-700">
                  <li>• Compensation and bonus terms</li>
                  <li>• Confidentiality obligations</li>
                  <li>• Termination and dispute clauses</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="app-shell py-20">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Features</p>
          <h2 className="section-title mt-3">Everything you need to draft smarter.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card-glow rounded-3xl border border-slate-200 bg-white p-6">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-gold">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-navy">{title}</h3>
              <p className="text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-slate-100/80 py-20">
        <div className="app-shell">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">How It Works</p>
            <h2 className="section-title mt-3">Draft in three simple steps.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="soft-panel p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-navy text-lg font-black text-gold">
                  {index + 1}
                </div>
                <p className="text-lg font-semibold text-slate-800">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="document-types" className="app-shell py-20">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Supported Documents</p>
          <h2 className="section-title mt-3">Tailored templates for common legal needs.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {documentTypes.map((document) => (
            <Link
              key={document}
              to="/documents/new"
              state={{ documentType: document }}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-gold hover:shadow-soft"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-navy">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-navy">{document}</h3>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy">
                Create draft <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="app-shell pb-20">
        <div className="rounded-[2rem] bg-navy px-8 py-12 text-center text-white shadow-soft md:px-16">
          <h2 className="text-3xl font-black tracking-tight md:text-5xl">Ready to Create Your First Document?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-200">
            Start with a polished template and transform your legal drafting workflow with AI-powered support.
          </p>
          <Link to={isAuthenticated ? '/documents/new' : '/register'} className="mt-8 inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 font-semibold text-navy transition hover:bg-yellow-300">
            {isAuthenticated ? 'Create a Document' : 'Get Started'}
          </Link>
        </div>
      </section>
    </div>
  );
}
