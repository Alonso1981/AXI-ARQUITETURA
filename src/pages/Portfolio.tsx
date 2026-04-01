import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Project } from '../types';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Filter, Pencil } from 'lucide-react';

import { useSettings } from '../SettingsContext';
import Editable from '../components/Editable';
import AdminEditStatus from '../components/AdminEditStatus';

export default function Portfolio({ user }: { user: any }) {
  const settings = useSettings();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = ['Todos', 'Residencial', 'Comercial', 'Institucional', 'Urbanístico'];
  const filteredProjects = filter === 'Todos' ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="pt-32 pb-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-400 mb-4">
            <Editable 
              value={settings.portfolioTitle} 
              onSave={(val) => settings.updateSettings({ portfolioTitle: val })}
              isAdmin={!!user}
            />
          </h2>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12">
            <Editable 
              value={settings.portfolioTagline} 
              onSave={(val) => settings.updateSettings({ portfolioTagline: val })}
              isAdmin={!!user}
            />
          </h1>
          
          <div className="flex flex-wrap gap-4 items-center">
            <Filter size={18} className="text-zinc-400 mr-2" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${filter === cat ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-video bg-zinc-100 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group"
              >
                <div className="block overflow-hidden rounded-2xl aspect-video relative">
                  <Link to={`/portfolio/${project.slug}`} className="block w-full h-full">
                    <img 
                      src={project.images[0]} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                  </Link>
                  
                  {user && (
                    <Link 
                      to="/admin/projetos" 
                      className="absolute top-6 right-6 p-3 bg-black/60 text-white rounded-full backdrop-blur-md border border-white/20 shadow-xl hover:scale-110 transition-all z-20"
                      title="Editar Projetos"
                    >
                      <Pencil size={18} />
                    </Link>
                  )}
                  
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur-sm text-black px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="mt-6 flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                    <p className="text-zinc-500 text-sm line-clamp-2 max-w-md">{project.description}</p>
                  </div>
                  <Link to={`/portfolio/${project.slug}`} className="p-3 bg-zinc-100 rounded-full hover:bg-black hover:text-white transition-all">
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 border-2 border-dashed border-zinc-100 rounded-3xl">
            <p className="text-zinc-400 font-medium">Nenhum projeto encontrado nesta categoria.</p>
          </div>
        )}
      </div>
      <AdminEditStatus user={user} />
    </div>
  );
}
