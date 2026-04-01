import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Project, User } from '../types';
import { motion } from 'motion/react';
import { ArrowLeft, FileText, Layout, Camera, ChevronRight, ChevronLeft, Pencil } from 'lucide-react';
import AdminEditStatus from '../components/AdminEditStatus';

export default function ProjectDetail({ user }: { user: User | null }) {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const q = query(collection(db, 'projects'), where('slug', '==', slug), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setProject({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Project);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div></div>;
  if (!project) return <div className="pt-40 text-center">Projeto não encontrado. <Link to="/portfolio" className="underline">Voltar</Link></div>;

  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <Link to="/portfolio" className="inline-flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-black mb-12 transition-colors">
          <ArrowLeft size={16} />
          <span>Voltar ao Portfólio</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-zinc-100 text-black px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 inline-block">
              {project.category}
            </span>
            <div className="relative group">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-none">
                {project.title}
              </h1>
              {user && (
                <Link 
                  to="/admin/projetos" 
                  className="absolute -top-4 -right-4 p-2 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                  title="Editar Projeto"
                >
                  <Pencil size={14} />
                </Link>
              )}
            </div>
            <div className="relative group">
              <p className="text-zinc-500 text-lg leading-relaxed mb-12">
                {project.description}
              </p>
              {user && (
                <Link 
                  to="/admin/projetos" 
                  className="absolute -top-4 -right-4 p-2 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                  title="Editar Descrição"
                >
                  <Pencil size={14} />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 gap-8 pt-12 border-t border-zinc-100">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-2">Localização</p>
                <p className="font-bold">São Sebastião, SP</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-2">Ano</p>
                <p className="font-bold">{new Date(project.createdAt).getFullYear()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative group">
              <img 
                src={project.images[activeImage]} 
                alt={project.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setActiveImage(prev => (prev === 0 ? project.images.length - 1 : prev - 1))}
                  className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-black shadow-lg"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setActiveImage(prev => (prev === project.images.length - 1 ? 0 : prev + 1))}
                  className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-black shadow-lg"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {project.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`shrink-0 w-24 aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-black scale-105' : 'border-transparent opacity-60'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Project Details Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="p-10 bg-zinc-50 rounded-3xl">
            <Layout className="mb-6 text-zinc-400" size={32} />
            <h3 className="text-xl font-bold mb-4">Plantas Arquitetônicas</h3>
            <p className="text-zinc-500 text-sm mb-6">Visualize a distribuição espacial e técnica deste projeto.</p>
            <button className="text-xs font-bold uppercase tracking-widest flex items-center space-x-2 hover:underline">
              <span>Ver Plantas</span>
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="p-10 bg-zinc-50 rounded-3xl">
            <Camera className="mb-6 text-zinc-400" size={32} />
            <h3 className="text-xl font-bold mb-4">Renderizações 3D</h3>
            <p className="text-zinc-500 text-sm mb-6">Estudos fotorrealistas de iluminação e materiais.</p>
            <button className="text-xs font-bold uppercase tracking-widest flex items-center space-x-2 hover:underline">
              <span>Ver Renders</span>
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="p-10 bg-zinc-50 rounded-3xl">
            <FileText className="mb-6 text-zinc-400" size={32} />
            <h3 className="text-xl font-bold mb-4">Documentação PDF</h3>
            <p className="text-zinc-500 text-sm mb-6">Memorial descritivo e especificações técnicas.</p>
            {project.pdfUrl ? (
              <a href={project.pdfUrl} target="_blank" rel="noreferrer" className="text-xs font-bold uppercase tracking-widest flex items-center space-x-2 hover:underline">
                <span>Baixar PDF</span>
                <ChevronRight size={14} />
              </a>
            ) : (
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">Indisponível</span>
            )}
          </div>
        </div>
      </div>
      <AdminEditStatus user={user} />
    </div>
  );
}
