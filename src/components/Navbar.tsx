import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useSettings } from '../SettingsContext';
import Editable from './Editable';

export default function Navbar({ user }: { user: any }) {
  const settings = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Portfólio', path: '/portfolio' },
    { name: 'Estilos', path: '/estilos' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contato', path: '/contato' },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex flex-col items-start leading-none">
          <Link to="/" className="flex flex-col items-start leading-none">
            <motion.div
              drag={!!user}
              dragMomentum={false}
              onDragEnd={(_e, info) => {
                settings.updateSettings({
                  logoTopPosition: {
                    x: (settings.logoTopPosition?.x || 0) + info.offset.x,
                    y: (settings.logoTopPosition?.y || 0) + info.offset.y
                  }
                });
              }}
              animate={{ 
                x: settings.logoTopPosition?.x || 0, 
                y: settings.logoTopPosition?.y || 0 
              }}
              className={user ? 'cursor-move' : ''}
            >
              <Editable 
                key="nav-site-name-top"
                value={settings.siteNameTop} 
                onSave={(val) => settings.updateSettings({ siteNameTop: val })}
                isAdmin={!!user}
                fontSize={settings.logoFontSize}
                onFontSizeChange={(size) => settings.updateSettings({ logoFontSize: size })}
                className={`font-bold tracking-tighter ${!scrolled && location.pathname === '/' ? 'text-white' : 'text-black'}`}
              />
            </motion.div>
            <motion.div
              drag={!!user}
              dragMomentum={false}
              onDragEnd={(_e, info) => {
                settings.updateSettings({
                  logoBottomPosition: {
                    x: (settings.logoBottomPosition?.x || 0) + info.offset.x,
                    y: (settings.logoBottomPosition?.y || 0) + info.offset.y
                  }
                });
              }}
              animate={{ 
                x: settings.logoBottomPosition?.x || 0, 
                y: settings.logoBottomPosition?.y || 0 
              }}
              className={user ? 'cursor-move' : ''}
            >
              <Editable 
                key="nav-site-name-bottom"
                value={settings.siteNameBottom} 
                onSave={(val) => settings.updateSettings({ siteNameBottom: val })}
                isAdmin={!!user}
                fontSize={Math.max(10, (settings.logoFontSize || 24) * 0.4)}
                className={`font-medium tracking-[0.2em] uppercase ${!scrolled && location.pathname === '/' ? 'text-white/80' : 'text-black/60'}`}
              />
            </motion.div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:opacity-70 ${!scrolled && location.pathname === '/' ? 'text-white' : 'text-zinc-600'} ${location.pathname === link.path ? 'opacity-100 font-semibold underline underline-offset-8' : 'opacity-80'}`}
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-zinc-200">
              <div className={`hidden lg:block text-right ${!scrolled && location.pathname === '/' ? 'text-white/70' : 'text-zinc-400'}`}>
                <p className="text-[10px] font-bold uppercase tracking-widest">Logado como</p>
                <p className={`text-xs font-bold truncate max-w-[150px] ${!scrolled && location.pathname === '/' ? 'text-white' : 'text-zinc-900'}`}>{user.email}</p>
              </div>
              <Link to="/admin" className={`text-sm font-medium ${!scrolled && location.pathname === '/' ? 'text-white' : 'text-black'}`}>
                Painel
              </Link>
              <button onClick={handleLogout} className="text-zinc-400 hover:text-red-500 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/admin/login" className={`p-2 rounded-full transition-colors ${!scrolled && location.pathname === '/' ? 'text-white hover:bg-white/10' : 'text-zinc-400 hover:bg-zinc-100'}`}>
              <User size={20} />
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className={`md:hidden p-2 ${!scrolled && location.pathname === '/' ? 'text-white' : 'text-black'}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-zinc-100 md:hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-lg font-medium text-zinc-800"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {user && (
                <>
                  <Link
                    to="/admin"
                    className="text-lg font-medium text-black border-t pt-4"
                    onClick={() => setIsOpen(false)}
                  >
                    Painel
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-lg font-medium text-red-500 text-left"
                  >
                    Sair
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
