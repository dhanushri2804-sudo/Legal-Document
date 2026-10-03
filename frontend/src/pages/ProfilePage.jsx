import { ArrowRight, ImagePlus, Trash2, Upload, UserCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function ProfilePage() {
  const { user } = useAuth();
  const [logoUrl, setLogoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loadingLogo, setLoadingLogo] = useState(true);
  const [savingLogo, setSavingLogo] = useState(false);
  const [logoMessage, setLogoMessage] = useState('');
  const [logoError, setLogoError] = useState('');

  const refreshLogo = async () => {
    try {
      const response = await api.get('/profile/logo', { responseType: 'blob' });
      const nextUrl = URL.createObjectURL(response.data);
      setLogoUrl(nextUrl);
    } catch (error) {
      if (error.response?.status === 404) {
        setLogoUrl('');
        return;
      }
      setLogoError('Unable to load the saved logo.');
    } finally {
      setLoadingLogo(false);
    }
  };

  useEffect(() => {
    refreshLogo();
  }, []);

  useEffect(() => () => {
    if (logoUrl) URL.revokeObjectURL(logoUrl);
  }, [logoUrl]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(logoUrl);
      return undefined;
    }
    const localUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(localUrl);
    return () => URL.revokeObjectURL(localUrl);
  }, [selectedFile, logoUrl]);

  const saveLogo = async () => {
    if (!selectedFile) return;
    setSavingLogo(true);
    setLogoError('');
    setLogoMessage('');
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      await api.post('/profile/logo', formData);
      setSelectedFile(null);
      await refreshLogo();
      setLogoMessage('Logo saved. It will appear in the header of every generated PDF.');
    } catch (error) {
      setLogoError(error.response?.data?.detail || 'Unable to save this logo. Choose a PNG, JPEG, or WebP image up to 5 MB.');
    } finally {
      setSavingLogo(false);
    }
  };

  const removeLogo = async () => {
    setSavingLogo(true);
    setLogoError('');
    setLogoMessage('');
    try {
      await api.delete('/profile/logo');
      setSelectedFile(null);
      await refreshLogo();
      setLogoMessage('Custom logo removed. PDFs will use the LegalEase logo.');
    } catch (error) {
      setLogoError(error.response?.data?.detail || 'Unable to remove the saved logo.');
    } finally {
      setSavingLogo(false);
    }
  };

  return (
    <div className="app-shell py-12">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy text-gold">
            <UserCircle2 className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Profile</p>
            <h1 className="text-3xl font-black text-navy">{user?.name || 'User Profile'}</h1>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Full name</p>
            <p className="mt-2 text-lg font-semibold text-slate-800">{user?.name}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Email address</p>
            <p className="mt-2 text-lg font-semibold text-slate-800">{user?.email}</p>
          </div>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <ImagePlus className="h-5 w-5 text-gold" />
            <div>
              <h2 className="text-lg font-bold text-navy">Organization logo for PDFs</h2>
              <p className="mt-1 text-sm text-slate-600">Your logo is stored privately with your account and included in each page header. Without a custom logo, PDFs use the LegalEase mark.</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-5">
            <div className="flex h-24 min-w-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
              {previewUrl ? <img src={previewUrl} alt="Organization logo preview" className="max-h-16 max-w-52 object-contain" /> : <div className="text-center"><div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-navy font-black text-gold">L</div><span className="mt-1 block text-xs font-semibold text-navy">LegalEase</span></div>}
            </div>
            <div className="flex flex-wrap gap-3">
              <label className="secondary-button cursor-pointer">
                <Upload className="mr-2 h-4 w-4" /> Choose logo
                <input type="file" className="sr-only" accept="image/png,image/jpeg,image/webp" onChange={(event) => { setSelectedFile(event.target.files?.[0] || null); setLogoError(''); setLogoMessage(''); }} />
              </label>
              {selectedFile && <button type="button" onClick={saveLogo} className="primary-button" disabled={savingLogo}><ImagePlus className="mr-2 h-4 w-4" />{savingLogo ? 'Saving...' : 'Save logo'}</button>}
              {logoUrl && !selectedFile && <button type="button" onClick={removeLogo} className="secondary-button text-red-700" disabled={savingLogo}><Trash2 className="mr-2 h-4 w-4" />Remove logo</button>}
            </div>
          </div>
          {selectedFile && <p className="mt-3 text-sm text-slate-600">Previewing {selectedFile.name}. Save to use it in PDFs.</p>}
          {loadingLogo && <p className="mt-3 text-sm text-slate-500">Loading saved logo...</p>}
          {logoMessage && <p role="status" className="mt-3 text-sm text-emerald-700">{logoMessage}</p>}
          {logoError && <p role="alert" className="mt-3 text-sm text-red-700">{logoError}</p>}
          <p className="mt-3 text-xs text-slate-500">PNG, JPEG, or WebP · maximum 5 MB and 40 megapixels.</p>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/dashboard" className="primary-button">Go to Dashboard</Link>
          <Link to="/documents/new" className="secondary-button">Create a Document</Link>
        </div>
      </div>
    </div>
  );
}
