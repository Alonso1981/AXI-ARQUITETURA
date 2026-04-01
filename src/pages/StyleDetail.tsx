import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Style } from '../types';
import { INITIAL_STYLES } from '../constants';
import { motion } from 'motion/react';
import { ArrowLeft, User, Building, Loader2, Pencil } from 'lucide-react';
import { User as UserType } from '../types';
import AdminEditStatus from '../components/AdminEditStatus';

export default function StyleDetail({ user }: { user: UserType | null }) {
  const { slug } = useParams();
  const [style, setStyle] = useState<Style | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStyle() {
      try {
        const q = query(collection(db, 'styles'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setStyle({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Style);
        } else {
          // Fallback to initial styles
          const fallback = INITIAL_STYLES.find(s => s.slug === slug);
          if (fallback) setStyle(fallback);
        }
      } catch (error) {
        console.error("Error fetching style:", error);
        // Fallback on error too
        const fallback = INITIAL_STYLES.find(s => s.slug === slug);
        if (fallback) setStyle(fallback);
      } finally {
        setLoading(false);
      }
    }
    fetchStyle();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-40 flex justify-center">
        <Loader2 className="animate-spin text-zinc-400" size={40} />
      </div>
    );
  }

  if (!style) return <div className="pt-40 text-center">Estilo não encontrado. <Link to="/estilos" className="underline">Voltar</Link></div>;

  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <Link to="/estilos" className="inline-flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-black mb-12 transition-colors">
          <ArrowLeft size={16} />
          <span>Voltar aos Estilos</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative group">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-none">
                {style.title}
              </h1>
              {user && (
                <Link 
                  to="/admin/estilos" 
                  className="absolute -top-4 -right-4 p-2 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                  title="Editar Estilo"
                >
                  <Pencil size={14} />
                </Link>
              )}
            </div>
            
            <div className="prose prose-zinc max-w-none text-zinc-600 text-lg leading-relaxed mb-12">
              <p className="font-bold text-black mb-4">Resumo</p>
              <p>{style.description}</p>
            </div>

            {style.characteristics && style.characteristics.length > 0 && (
              <div className="mb-12">
                <p className="font-bold text-black mb-4 text-sm uppercase tracking-widest text-zinc-400">Principais Características</p>
                <div className="flex flex-wrap gap-2">
                  {style.characteristics.map((char, idx) => (
                    <span key={idx} className="px-4 py-2 bg-zinc-50 text-zinc-800 text-xs font-bold uppercase tracking-wider rounded-full border border-zinc-100">
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="prose prose-zinc max-w-none text-zinc-600 text-lg leading-relaxed mb-12 bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
              <p className="font-bold text-black mb-4">Contexto Histórico e Arquitetônico</p>
              <p>{style.context}</p>
            </div>

            <div className="mb-12">
              <p className="font-bold text-black mb-6">Principais Arquitetos e Obras</p>
              <div className="grid grid-cols-1 gap-6">
                {style.architectWorks?.map((aw, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
                    <p className="font-bold text-zinc-900 mb-2 flex items-center gap-2">
                      <User size={16} className="text-zinc-400" />
                      {aw.architect}
                    </p>
                    <ul className="list-disc list-inside text-zinc-500 text-sm space-y-1 ml-6">
                      {aw.works.map((work, wIdx) => (
                        <li key={wIdx}>{work}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8 pt-12 border-t border-zinc-100">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-zinc-100 rounded-xl text-zinc-500">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1">Arquitetos de Referência</p>
                  <p className="font-bold text-lg">{style.architects}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-zinc-100 rounded-xl text-zinc-500">
                  <Building size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1">Obras Exemplares</p>
                  <p className="font-bold text-lg">{style.examples}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-4"
          >
            {style.images.map((img, idx) => (
              <div key={idx} className={`rounded-3xl overflow-hidden shadow-lg ${idx === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}>
                <img 
                  src={img} 
                  alt={style.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
            {/* Placeholder images if only one provided */}
            {style.images.length === 1 && (
              <>
                <div className="aspect-square rounded-3xl overflow-hidden bg-zinc-100">
                  <img src={`https://picsum.photos/seed/${style.slug}-2/800/800`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="aspect-square rounded-3xl overflow-hidden bg-zinc-100">
                  <img src={`https://picsum.photos/seed/${style.slug}-3/800/800`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </>
            )}
          </motion.div>
        </div>

        <div className="bg-zinc-950 rounded-[3rem] p-12 md:p-20 text-white flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">Gostou deste estilo?</h3>
            <p className="text-zinc-400">Podemos aplicar os conceitos da {style.title} no seu próximo projeto, adaptando-os às suas necessidades específicas.</p>
          </div>
          <Link to="/contato" className="bg-white text-black px-12 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all whitespace-nowrap">
            Solicitar Orçamento
          </Link>
        </div>
      </div>
      <AdminEditStatus user={user} />
    </div>
  );
}
