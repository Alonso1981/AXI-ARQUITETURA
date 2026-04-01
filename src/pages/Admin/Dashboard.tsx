import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Palette, 
  FileText, 
  Users, 
  Settings as SettingsIcon,
  Plus,
  LogOut,
  ChevronRight,
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { doc, writeBatch } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { INITIAL_SETTINGS, INITIAL_STYLES } from '../../constants';
import ProjectsAdmin from './ProjectsAdmin';
import StylesAdmin from './StylesAdmin';
import BlogAdmin from './BlogAdmin';
import LeadsAdmin from './LeadsAdmin';
import SettingsAdmin from './SettingsAdmin';
import ConfirmModal from '../../components/ConfirmModal';
import { handleFirestoreError, OperationType } from '../../lib/firestore-errors';

export default function Dashboard({ user }: { user: any }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Projetos', path: '/admin/projetos', icon: <Briefcase size={20} /> },
    { name: 'Estilos', path: '/admin/estilos', icon: <Palette size={20} /> },
    { name: 'Blog', path: '/admin/blog', icon: <FileText size={20} /> },
    { name: 'Leads', path: '/admin/leads', icon: <Users size={20} /> },
    { name: 'Configurações', path: '/admin/configuracoes', icon: <SettingsIcon size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50 pt-20">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 hidden md:block">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Admin</p>
              <p className="text-sm font-bold truncate max-w-[120px]">{user?.email || 'Administrador'}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === item.path 
                    ? 'bg-black text-white shadow-lg shadow-black/10' 
                    : 'text-zinc-500 hover:bg-zinc-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
                {location.pathname === item.path && <ChevronRight size={14} />}
              </Link>
            ))}
            
            <button
              onClick={async () => {
                await signOut(auth);
                navigate('/');
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all mt-8"
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12 overflow-y-auto">
        <Routes>
          <Route path="/" element={<AdminHome user={user} />} />
          <Route path="/projetos" element={<ProjectsAdmin />} />
          <Route path="/estilos" element={<StylesAdmin />} />
          <Route path="/blog" element={<BlogAdmin />} />
          <Route path="/leads" element={<LeadsAdmin />} />
          <Route path="/configuracoes" element={<SettingsAdmin />} />
        </Routes>
      </main>
    </div>
  );
}

function AdminHome({ user }: { user: any }) {
  const [seeding, setSeeding] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const confirmSeedData = async () => {
    setSeeding(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const batch = writeBatch(db);
      
      // Seed settings
      batch.set(doc(db, 'settings', 'global'), INITIAL_SETTINGS, { merge: true });
      
      // Seed styles
      INITIAL_STYLES.forEach((style) => {
        const styleRef = doc(db, 'styles', style.slug);
        batch.set(styleRef, style, { merge: true });
      });
      
      await batch.commit();
      setSuccessMessage('Dados iniciais semeados com sucesso!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error: any) {
      console.error('Error seeding data:', error);
      setErrorMessage(`Erro ao semear dados: ${error.message}`);
      handleFirestoreError(error, OperationType.WRITE, 'multiple collections');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmSeedData}
        title="Semear Dados Iniciais"
        message="Isso irá preencher o banco de dados com as configurações e estilos iniciais. Deseja continuar?"
      />

      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter mb-4">Bem-vindo, {(user?.email || 'Admin').split('@')[0]}!</h1>
          <p className="text-zinc-500">Gerencie todo o conteúdo do site Axis Arquitetura através deste painel.</p>
        </div>
        <button 
          onClick={() => setIsConfirmOpen(true)}
          disabled={seeding}
          className="flex items-center space-x-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-xl text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
        >
          <Database size={14} />
          <span>{seeding ? 'Semeando...' : 'Semear Dados Iniciais'}</span>
        </button>
      </div>

      {successMessage && (
        <div className="mb-8 p-4 bg-green-50 text-green-600 rounded-xl flex items-center space-x-3 text-sm animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl flex items-center space-x-3 text-sm animate-in fade-in slide-in-from-top-4">
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Projetos</p>
          <p className="text-3xl font-bold mb-4">Portfólio</p>
          <Link to="/admin/projetos" className="text-sm font-bold text-black hover:underline">Gerenciar →</Link>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Conteúdo</p>
          <p className="text-3xl font-bold mb-4">Blog</p>
          <Link to="/admin/blog" className="text-sm font-bold text-black hover:underline">Escrever →</Link>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Contatos</p>
          <p className="text-3xl font-bold mb-4">Leads</p>
          <Link to="/admin/leads" className="text-sm font-bold text-black hover:underline">Visualizar →</Link>
        </div>
      </div>
    </div>
  );
}
