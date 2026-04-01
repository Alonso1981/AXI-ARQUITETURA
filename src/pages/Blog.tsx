import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { BlogPost } from '../types';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useSettings } from '../SettingsContext';
import Editable from '../components/Editable';
import AdminEditStatus from '../components/AdminEditStatus';

export default function Blog({ user }: { user: any }) {
  const settings = useSettings();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'blog'), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="pt-32 pb-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-400 mb-4">
            <Editable 
              value={settings.blogPageTitle} 
              onSave={(val) => settings.updateSettings({ blogPageTitle: val })}
              isAdmin={!!user}
            />
          </h2>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12">
            <Editable 
              value={settings.blogPageTagline} 
              onSave={(val) => settings.updateSettings({ blogPageTagline: val })}
              isAdmin={!!user}
            />
          </h1>
          <div className="text-zinc-500 max-w-2xl text-lg">
            <Editable 
              value={settings.blogPageDescription} 
              onSave={(val) => settings.updateSettings({ blogPageDescription: val })}
              type="textarea"
              isAdmin={!!user}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-4">
                <div className="aspect-[16/10] bg-zinc-100 animate-pulse rounded-2xl"></div>
                <div className="h-6 bg-zinc-100 animate-pulse w-3/4"></div>
                <div className="h-4 bg-zinc-100 animate-pulse w-full"></div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {posts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group"
              >
                <div className="block aspect-[16/10] overflow-hidden rounded-2xl mb-6 relative">
                  <Link to={`/blog/${post.slug}`} className="block w-full h-full">
                    <img 
                      src={post.images?.[0] || post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                  {user && (
                    <Link 
                      to="/admin/blog" 
                      className="absolute top-4 right-4 p-3 bg-black/60 text-white rounded-full backdrop-blur-md border border-white/20 shadow-xl hover:scale-110 transition-all z-20"
                      title="Editar Blog"
                    >
                      <Pencil size={18} />
                    </Link>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>{format(new Date(post.date), "dd MMM, yyyy", { locale: ptBR })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User size={12} />
                    <span>{post.author}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-zinc-600 transition-colors">{post.title}</h3>
                <p className="text-zinc-500 text-sm line-clamp-3 mb-6 leading-relaxed">
                  {post.content.substring(0, 150)}...
                </p>
                <Link 
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-black hover:underline underline-offset-8"
                >
                  <span>Ler Artigo</span>
                  <ArrowRight size={14} />
                </Link>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 border-2 border-dashed border-zinc-100 rounded-3xl">
            <p className="text-zinc-400 font-medium">Nenhum artigo publicado ainda.</p>
          </div>
        )}
      </div>
      <AdminEditStatus user={user} />
    </div>
  );
}
