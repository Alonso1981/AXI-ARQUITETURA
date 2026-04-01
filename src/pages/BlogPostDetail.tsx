import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { BlogPost, User } from '../types';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User as UserIcon, Share2, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import AdminEditStatus from '../components/AdminEditStatus';

export default function BlogPostDetail({ user }: { user: User | null }) {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const q = query(collection(db, 'blog'), where('slug', '==', slug), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setPost({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as BlogPost);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div></div>;
  if (!post) return <div className="pt-40 text-center">Artigo não encontrado. <Link to="/blog" className="underline">Voltar</Link></div>;

  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/blog" className="inline-flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-black mb-12 transition-colors">
          <ArrowLeft size={16} />
          <span>Voltar ao Blog</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center space-x-6 text-xs font-bold uppercase tracking-widest text-zinc-400 mb-8">
            <div className="flex items-center space-x-2">
              <Calendar size={14} />
              <span>{format(new Date(post.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <UserIcon size={14} />
              <span>{post.author}</span>
            </div>
          </div>

          <div className="relative group">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-12 leading-tight">
              {post.title}
            </h1>
            {user && (
              <Link 
                to="/admin/blog" 
                className="absolute -top-4 -right-4 p-2 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                title="Editar Artigo"
              >
                <Pencil size={14} />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 gap-8 mb-16">
            {(post.images && post.images.length > 0 ? post.images : [post.image]).map((img, idx) => (
              <div key={idx} className={`rounded-3xl overflow-hidden shadow-2xl ${idx === 0 ? 'aspect-video' : 'aspect-[16/10]'}`}>
                <img 
                  src={img} 
                  alt={`${post.title} - ${idx + 1}`} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>

          <div className="prose prose-zinc prose-lg max-w-none text-zinc-600 leading-relaxed mb-20">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          <div className="pt-12 border-t border-zinc-100 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center font-bold text-black">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold">{post.author}</p>
                <p className="text-xs text-zinc-400">Arquiteto & Urbanista</p>
              </div>
            </div>
            <button className="p-3 bg-zinc-50 rounded-full hover:bg-black hover:text-white transition-all">
              <Share2 size={20} />
            </button>
          </div>
        </motion.div>
      </div>
      <AdminEditStatus user={user} />
    </div>
  );
}
