import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin, MessageCircle, Send } from 'lucide-react';
import { INITIAL_SETTINGS } from '../constants';
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

import { useSettings } from '../SettingsContext';
import Editable from '../components/Editable';
import AdminEditStatus from '../components/AdminEditStatus';

export default function Contact({ user }: { user: any }) {
  const settings = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'leads'), {
        ...formData,
        description: `[CONTATO DIRETO] Assunto: ${formData.subject}\n\nMensagem: ${formData.message}`,
        createdAt: new Date().toISOString(),
        projectType: 'Contato Direto',
        city: 'N/A',
        area: 'N/A',
        style: 'N/A'
      });
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-400 mb-4">
            <Editable 
              value={settings.contactPageTitle} 
              onSave={(val) => settings.updateSettings({ contactPageTitle: val })}
              isAdmin={!!user}
            />
          </h2>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12">
            <Editable 
              value={settings.contactPageTagline} 
              onSave={(val) => settings.updateSettings({ contactPageTagline: val })}
              isAdmin={!!user}
            />
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-12 mb-16">
              <div className="flex items-start space-x-6">
                <div className="p-4 bg-zinc-50 rounded-2xl text-zinc-400">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1">Telefone & WhatsApp</p>
                  <p className="text-xl font-bold">
                    <Editable 
                      value={settings.phone} 
                      onSave={(val) => settings.updateSettings({ phone: val })}
                      isAdmin={!!user}
                    />
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="p-4 bg-zinc-50 rounded-2xl text-zinc-400">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1">E-mail</p>
                  <p className="text-xl font-bold">
                    <Editable 
                      value={settings.email} 
                      onSave={(val) => settings.updateSettings({ email: val })}
                      isAdmin={!!user}
                    />
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="p-4 bg-zinc-50 rounded-2xl text-zinc-400">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1">Localização</p>
                  <p className="text-xl font-bold leading-tight">
                    <Editable 
                      value={settings.address} 
                      onSave={(val) => settings.updateSettings({ address: val })}
                      isAdmin={!!user}
                      type="textarea"
                    />
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Siga-nos</p>
              <div className="flex space-x-4">
                <a 
                  href={settings.socialLinks.instagram} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-zinc-50 rounded-2xl text-zinc-400 hover:bg-black hover:text-white transition-all"
                >
                  <Instagram size={24} />
                </a>
                <a 
                  href={settings.socialLinks.facebook} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-zinc-50 rounded-2xl text-zinc-400 hover:bg-black hover:text-white transition-all"
                >
                  <Facebook size={24} />
                </a>
                <a 
                  href={settings.socialLinks.linkedin} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-zinc-50 rounded-2xl text-zinc-400 hover:bg-black hover:text-white transition-all"
                >
                  <Linkedin size={24} />
                </a>
              </div>
            </div>

            <div className="mt-16">
              <a 
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-4 bg-green-500 text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
              >
                <MessageCircle size={24} />
                <span>Conversar no WhatsApp</span>
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-zinc-50 p-12 rounded-[3rem]"
          >
            {success ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mb-8">
                  <Send size={32} />
                </div>
                <h3 className="text-3xl font-bold mb-4">Mensagem Enviada!</h3>
                <p className="text-zinc-500 mb-8">Obrigado pelo contato. Nossa equipe retornará em breve.</p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="text-sm font-bold uppercase tracking-widest underline underline-offset-8"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                {/* Hidden fields to confuse browser autofill of sensitive data */}
                <input type="text" name="prevent_autofill" style={{ display: 'none' }} autoComplete="off" />
                <input type="password" name="password_fake" style={{ display: 'none' }} autoComplete="new-password" />
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Nome</label>
                  <input 
                    type="text" 
                    name="contact_full_name"
                    id="contact_full_name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-black outline-none"
                    required 
                    autoComplete="off"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">E-mail</label>
                    <input 
                      type="text" 
                      name="contact_identifier"
                      id="contact_identifier"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-black outline-none"
                      required 
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Telefone</label>
                    <input 
                      type="tel" 
                      name="contact_phone_number"
                      id="contact_phone_number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-black outline-none"
                      required 
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Assunto</label>
                  <input 
                    type="text" 
                    name="contact_topic"
                    id="contact_topic"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-black outline-none"
                    required 
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Mensagem</label>
                  <textarea 
                    rows={5}
                    name="contact_body"
                    id="contact_body"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-black outline-none resize-none"
                    required 
                    autoComplete="off"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-black text-white py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Enviar Mensagem</span>
                      <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
      <AdminEditStatus user={user} />
    </div>
  );
}
