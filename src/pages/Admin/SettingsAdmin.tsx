import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { SiteSettings } from '../../types';
import { INITIAL_SETTINGS } from '../../constants';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../../lib/firestore-errors';

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'global');
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setSettings(snapshot.data() as SiteSettings);
        }
      } catch (err: any) {
        console.error(err);
        setError(`Erro ao carregar configurações: ${err.message}`);
        handleFirestoreError(err, OperationType.GET, 'settings/global');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await setDoc(doc(db, 'settings', 'global'), settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError(`Erro ao salvar: ${err.message}`);
      handleFirestoreError(err, OperationType.WRITE, 'settings/global');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tighter">Configurações</h2>
        <p className="text-zinc-500">Edite as informações globais do seu escritório.</p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl flex items-start space-x-3 text-sm">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold mb-4">Informações Gerais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Nome da Empresa (Topo)</label>
              <input 
                type="text" 
                value={settings.siteNameTop}
                onChange={(e) => setSettings({ ...settings, siteNameTop: e.target.value })}
                className="w-full bg-zinc-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Nome da Empresa (Base)</label>
              <input 
                type="text" 
                value={settings.siteNameBottom}
                onChange={(e) => setSettings({ ...settings, siteNameBottom: e.target.value })}
                className="w-full bg-zinc-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Nome da Empresa (SEO)</label>
              <input 
                type="text" 
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full bg-zinc-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Frase Institucional</label>
              <input 
                type="text" 
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-zinc-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Descrição Curta</label>
            <textarea 
              rows={3}
              value={settings.description}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              className="w-full bg-zinc-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none resize-none"
            ></textarea>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold mb-4">Aparência e Tipografia</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Tamanho da Logo (Menu)</label>
                <span className="text-xs font-bold bg-zinc-100 px-2 py-1 rounded-md">{settings.logoFontSize}px</span>
              </div>
              <input 
                type="range" 
                min="12" 
                max="48" 
                value={settings.logoFontSize}
                onChange={(e) => setSettings({ ...settings, logoFontSize: parseInt(e.target.value) })}
                className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-black"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Tamanho da Logo (Destaque)</label>
                <span className="text-xs font-bold bg-zinc-100 px-2 py-1 rounded-md">{settings.heroLogoFontSize}px</span>
              </div>
              <input 
                type="range" 
                min="24" 
                max="120" 
                value={settings.heroLogoFontSize}
                onChange={(e) => setSettings({ ...settings, heroLogoFontSize: parseInt(e.target.value) })}
                className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-black"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold mb-4">Contato e Localização</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">E-mail de Contato</label>
              <input 
                type="email" 
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-zinc-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">WhatsApp (apenas números)</label>
              <input 
                type="text" 
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full bg-zinc-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Telefone Fixo</label>
              <input 
                type="text" 
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full bg-zinc-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Endereço Completo</label>
              <input 
                type="text" 
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-zinc-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Instagram (URL completa)</label>
              <input 
                type="text" 
                value={settings.socialLinks?.instagram || ''}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  socialLinks: { ...settings.socialLinks, instagram: e.target.value } 
                })}
                className="w-full bg-zinc-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
                placeholder="https://instagram.com/seu-perfil"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {success && (
            <div className="flex items-center space-x-2 text-green-600 font-bold text-sm animate-bounce">
              <CheckCircle2 size={18} />
              <span>Configurações salvas com sucesso!</span>
            </div>
          )}
          <button 
            type="submit" 
            disabled={saving}
            className="ml-auto bg-black text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center space-x-3 disabled:opacity-50"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={18} />
                <span>Salvar Alterações</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
