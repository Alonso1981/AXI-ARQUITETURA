import { Instagram, Facebook, Linkedin, Phone, Mail, MapPin } from 'lucide-react';
import { useSettings } from '../SettingsContext';
import { Link } from 'react-router-dom';
import Editable from './Editable';

export default function Footer({ user }: { user?: any }) {
  const settings = useSettings();
  return (
    <footer className="bg-zinc-950 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <div className="mb-4">
            <Editable 
              value={settings.siteName} 
              onSave={(val) => settings.updateSettings({ siteName: val })}
              isAdmin={!!user}
              className="text-xl font-bold tracking-tighter"
            />
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            {settings.description}
          </p>
          <div className="flex space-x-4">
            {settings.socialLinks.instagram && (
              <a 
                href={settings.socialLinks.instagram} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest font-bold mb-6 text-zinc-500">Navegação</h4>
          <ul className="space-y-4 text-sm text-zinc-400">
            <li><Link to="/" className="hover:text-white transition-colors">Início</Link></li>
            <li><Link to="/portfolio" className="hover:text-white transition-colors">Portfólio</Link></li>
            <li><Link to="/estilos" className="hover:text-white transition-colors">Estilos Arquitetônicos</Link></li>
            <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            <li><Link to="/admin/login" className="hover:text-white transition-colors opacity-50">Área do Usuário</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest font-bold mb-6 text-zinc-500">Contato</h4>
          <ul className="space-y-4 text-sm text-zinc-400">
            <li className="flex items-center space-x-3">
              <Phone size={16} className="text-zinc-600" />
              <span>{settings.phone}</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={16} className="text-zinc-600" />
              <span>{settings.email}</span>
            </li>
            <li className="flex items-start space-x-3">
              <MapPin size={16} className="text-zinc-600 mt-1" />
              <span>{settings.address}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest font-bold mb-6 text-zinc-500">Newsletter</h4>
          <p className="text-zinc-400 text-sm mb-4">Receba novidades e tendências de arquitetura.</p>
          <form className="flex">
            <input 
              type="email" 
              placeholder="Seu e-mail" 
              className="bg-zinc-900 border-none text-sm px-4 py-2 w-full focus:ring-1 focus:ring-white outline-none"
            />
            <button className="bg-white text-black px-4 py-2 text-sm font-bold hover:bg-zinc-200 transition-colors">
              OK
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-600 space-y-4 md:space-y-0">
        <p>© {new Date().getFullYear()} Axis Arquitetura & Urbanismo. Todos os direitos reservados.</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-zinc-400">Privacidade</a>
          <a href="#" className="hover:text-zinc-400">Termos de Uso</a>
        </div>
      </div>
    </footer>
  );
}
