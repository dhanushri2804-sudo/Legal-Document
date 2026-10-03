import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateDocumentPage from './pages/CreateDocumentPage';
import EditorPage from './pages/EditorPage';
import MyDocumentsPage from './pages/MyDocumentsPage';
import DocumentDetailsPage from './pages/DocumentDetailsPage';
import ProfilePage from './pages/ProfilePage';
import AssistantPage from './pages/AssistantPage';
import AnalyzerPage from './pages/AnalyzerPage';
import TemplatesPage from './pages/TemplatesPage';
import WorkflowPage from './pages/WorkflowPage';
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg text-slate-700">Loading your workspace...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppLayout({ children }) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const section = document.getElementById(hash.slice(1));
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [pathname, hash]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/documents/new" element={<ProtectedRoute><CreateDocumentPage /></ProtectedRoute>} />
        <Route path="/documents/:id/edit" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
        <Route path="/documents" element={<ProtectedRoute><MyDocumentsPage /></ProtectedRoute>} />
        <Route path="/documents/:id" element={<ProtectedRoute><DocumentDetailsPage /></ProtectedRoute>} />
        <Route path="/tools/assistant" element={<ProtectedRoute><AssistantPage /></ProtectedRoute>} />
        <Route path="/tools/analyzer" element={<ProtectedRoute><AnalyzerPage /></ProtectedRoute>} />
        <Route path="/templates" element={<ProtectedRoute><TemplatesPage /></ProtectedRoute>} />
        <Route path="/workflows" element={<ProtectedRoute><WorkflowPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppLayout>
  );
}
