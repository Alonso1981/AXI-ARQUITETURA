import { INITIAL_STYLES } from '../constants';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, RefreshCw, Pencil } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Style } from '../types';

import { useSettings } from '../SettingsContext';
import Editable from '../components/Editable';
import AdminEditStatus from '../components/AdminEditStatus';

export default function Styles({ user }: { user: any }) {
  const settings = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [styles, setStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'styles'));
        if (snapshot.empty) {
          setStyles(INITIAL_STYLES);
        } else {
          setStyles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Style)));
        }
      } catch (err) {
        console.error(err);
        setStyles(INITIAL_STYLES);
      } finally {
        setLoading(false);
      }
    };
    fetchStyles();
  }, []);

  const filteredStyles = styles.filter(style => 
    style.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    style.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-32 pb-20 min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-400 mb-4">
            <Editable 
              value={settings.stylesPageTitle} 
              onSave={(val) => settings.updateSettings({ stylesPageTitle: val })}
              isAdmin={!!user}
            />
          </h2>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12">
            <Editable 
              value={settings.stylesPageTagline} 
              onSave={(val) => settings.updateSettings({ stylesPageTagline: val })}
              isAdmin={!!user}
            />
          </h1>
          
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input 
              type="text" 
              placeholder="Pesquisar estilo (ex: Minimalista, Barroco...)"
              className="w-full bg-white border-none pl-12 pr-6 py-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-black outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredStyles.map((style, idx) => (
            <motion.div
              key={style.id || style.slug + idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-zinc-100"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img 
                  src={style.images[0]} 
                  alt={style.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                {user && (
                  <Link 
                    to="/admin/estilos" 
                    className="absolute top-4 right-4 p-3 bg-black/60 text-white rounded-full backdrop-blur-md border border-white/20 shadow-xl hover:scale-110 transition-all z-20"
                    title="Editar Estilos"
                  >
                    <Pencil size={18} />
                  </Link>
                )}
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">{style.title}</h3>
                <p className="text-zinc-500 text-sm line-clamp-3 mb-6 leading-relaxed">
                  {style.description}
                </p>
                
                {style.characteristics && style.characteristics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-8">
                    {style.characteristics.slice(0, 3).map((char, cIdx) => (
                      <span key={cIdx} className="px-2 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-wider rounded-md">
                        {char}
                      </span>
                    ))}
                    {style.characteristics.length > 3 && (
                      <span className="px-2 py-1 bg-zinc-50 text-zinc-400 text-[10px] font-bold uppercase tracking-wider rounded-md">
                        +{style.characteristics.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <Link 
                  to={`/estilos/${style.slug}`}
                  className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-black group-hover:underline underline-offset-8"
                >
                  <span>Ver Detalhes</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredStyles.length === 0 && (
          <div className="text-center py-40">
            <p className="text-zinc-400 font-medium">Nenhum estilo encontrado para "{searchTerm}".</p>
          </div>
        )}
      </div>
      <AdminEditStatus user={user} />
    </div>
  );
}
