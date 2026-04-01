import { useState, useEffect, useCallback, useTransition, memo } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { BlogPost } from '../../types';
import { Plus, Edit2, Trash2, X, FileText, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import ConfirmModal from '../../components/ConfirmModal';
import FileUpload from '../../components/FileUpload';
import { handleFirestoreError, OperationType } from '../../lib/firestore-errors';

const PostItem = memo(({ post, onEdit, onDelete }: { post: BlogPost; onEdit: (post: BlogPost) => void; onDelete: (id: string) => void }) => (
  <div className="bg-white p-6 rounded-2xl border border-zinc-100 flex items-center justify-between group">
    <div className="flex items-center space-x-6">
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-100">
        <img src={post.images?.[0] || post.image} alt="" className="w-full h-full object-cover" />
      </div>
      <div>
        <h3 className="font-bold text-lg">{post.title}</h3>
        <div className="flex items-center space-x-3 text-xs text-zinc-400 font-bold uppercase tracking-widest">
          <Calendar size={12} />
          <span>{post.date ? format(new Date(post.date), "dd/MM/yyyy") : 'Sem data'}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button 
        onClick={() => onEdit(post)}
        className="p-3 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-xl transition-all"
      >
        <Edit2 size={18} />
      </button>
      <button 
        onClick={() => onDelete(post.id!)}
        className="p-3 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
      >
        <Trash2 size={18} />
      </button>
    </div>
  </div>
));

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Form state
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    author: 'Equipe Axis',
    images: [''],
    slug: '',
    date: new Date().toISOString()
  });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'blog'), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      setPosts(snapshot.docs.map(doc => {
        const data = doc.data();
        // Handle legacy single image field
        const images = data.images || (data.image ? [data.image] : ['']);
        return { id: doc.id, ...data, images } as BlogPost;
      }));
    } catch (err: any) {
      console.error(err);
      handleFirestoreError(err, OperationType.LIST, 'blog');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // Helper to compress base64 images if they are too large
  const compressBase64IfNeeded = async (base64: string): Promise<string> => {
    if (!base64.startsWith('data:image/')) return base64;
    if (base64.length < 500000) return base64;

    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const max = 1200;
        if (width > height) {
          if (width > max) {
            height *= max / width;
            width = max;
          }
        } else {
          if (height > max) {
            width *= max / height;
            height = max;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = () => resolve(base64);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const slug = formData.title?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      
      // Filter and compress images
      const rawImages = (formData.images || []).filter(img => img.trim() !== '');
      const compressedImages = await Promise.all(rawImages.map(img => compressBase64IfNeeded(img)));
      
      const data = { 
        ...formData, 
        slug, 
        images: compressedImages,
        date: editingPost?.date || new Date().toISOString() 
      };

      if (editingPost?.id) {
        await updateDoc(doc(db, 'blog', editingPost.id), data);
      } else {
        await addDoc(collection(db, 'blog'), data);
      }
      setIsModalOpen(false);
      setEditingPost(null);
      setFormData({ title: '', content: '', author: 'Equipe Axis', images: [''], slug: '' });
      fetchPosts();
    } catch (err: any) {
      console.error(err);
      handleFirestoreError(err, editingPost?.id ? OperationType.UPDATE : OperationType.CREATE, `blog/${editingPost?.id || 'new'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = useCallback(async (id: string) => {
    setPostToDelete(id);
    setIsConfirmModalOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (postToDelete) {
      try {
        await deleteDoc(doc(db, 'blog', postToDelete));
        setPostToDelete(null);
        setIsConfirmModalOpen(false);
        fetchPosts();
      } catch (err: any) {
        console.error(err);
        handleFirestoreError(err, OperationType.DELETE, `blog/${postToDelete}`);
      }
    }
  }, [postToDelete, fetchPosts]);

  const openModal = useCallback((post: BlogPost | null = null) => {
    startTransition(() => {
      if (post) {
        setEditingPost(post);
        setFormData({
          ...post,
          images: post.images && post.images.length > 0 ? post.images : ['']
        });
      } else {
        setEditingPost(null);
        setFormData({ title: '', content: '', author: 'Equipe Axis', images: [''], slug: '' });
      }
      setIsModalOpen(true);
    });
  }, []);

  const addImageField = useCallback(() => {
    setFormData(prev => ({ ...prev, images: [...(prev.images || []), ''] }));
  }, []);

  const removeImageField = useCallback((idx: number) => {
    setFormData(prev => ({ ...prev, images: prev.images?.filter((_, i) => i !== idx) }));
  }, []);

  const handleImageChange = useCallback((idx: number, val: string) => {
    setFormData(prev => {
      const newImgs = [...(prev.images || [])];
      newImgs[idx] = val;
      return { ...prev, images: newImgs };
    });
  }, []);

  return (
    <div>
      <ConfirmModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Artigo"
        message="Tem certeza que deseja excluir este artigo do blog? Esta ação não pode ser desfeita."
      />
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter">Blog</h2>
          <p className="text-zinc-500">Escreva artigos e novidades.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 hover:bg-zinc-800 transition-all"
        >
          <Plus size={18} />
          <span>Novo Artigo</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {posts.map(post => (
            <PostItem 
              key={post.id} 
              post={post} 
              onEdit={openModal} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-8 border-b border-zinc-100 flex justify-between items-center">
              <h3 className="text-2xl font-bold tracking-tighter">{editingPost ? 'Editar Artigo' : 'Novo Artigo'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Título</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-zinc-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Autor</label>
                  <input 
                    type="text" 
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-zinc-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Imagens do Artigo</label>
                  <button 
                    type="button"
                    onClick={addImageField}
                    className="text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700"
                  >
                    + Adicionar Imagem
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {formData.images?.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <FileUpload 
                        value={img}
                        onChange={(val) => handleImageChange(idx, val)}
                        label={`Imagem ${idx + 1}`}
                      />
                      {formData.images!.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(idx)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Conteúdo (Markdown)</label>
                <textarea 
                  rows={10}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-zinc-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none resize-none font-mono text-sm"
                  required
                ></textarea>
              </div>

              <div className="pt-6 border-t border-zinc-100">
                <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all">
                  Publicar Artigo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
