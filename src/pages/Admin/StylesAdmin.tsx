import { useState, useEffect, useCallback, useTransition, memo } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase';
import { Style, ArchitectWork } from '../../types';
import { INITIAL_STYLES } from '../../constants';
import { Plus, Edit2, Trash2, X, Palette, RefreshCw, AlertCircle } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import FileUpload from '../../components/FileUpload';
import { handleFirestoreError, OperationType } from '../../lib/firestore-errors';

const StyleItem = memo(({ style, onEdit, onDelete }: { style: Style; onEdit: (style: Style) => void; onDelete: (id: string) => void }) => (
  <div className="bg-white p-6 rounded-2xl border border-zinc-100 flex items-center justify-between group">
    <div className="flex items-center space-x-6">
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-100">
        {style.images && style.images.length > 0 && style.images[0] && (
          <img src={style.images[0]} alt="" className="w-full h-full object-cover" />
        )}
      </div>
      <div>
        <h3 className="font-bold text-lg">{style.title}</h3>
        <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Estilo</p>
      </div>
    </div>
    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button 
        onClick={() => onEdit(style)}
        className="p-3 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-xl transition-all"
      >
        <Edit2 size={18} />
      </button>
      <button 
        onClick={() => onDelete(style.id!)}
        className="p-3 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
      >
        <Trash2 size={18} />
      </button>
    </div>
  </div>
));

export default function StylesAdmin() {
  const [styles, setStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStyle, setEditingStyle] = useState<Style | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Style>>({
    title: '',
    description: '',
    context: '',
    characteristics: [],
    architects: '',
    architectWorks: [{ architect: '', works: [''] }],
    examples: '',
    images: [''],
    slug: ''
  });

  const fetchStyles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const snapshot = await getDocs(collection(db, 'styles'));
      if (snapshot.empty) {
        setStyles([]);
      } else {
        setStyles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Style)));
      }
    } catch (err: any) {
      console.error(err);
      setError(`Erro ao carregar estilos: ${err.message}`);
      handleFirestoreError(err, OperationType.LIST, 'styles');
    } finally {
      setLoading(false);
    }
  }, []);

  const seedStyles = useCallback(async () => {
    setConfirmAction({
      title: 'Carregar Estilos Iniciais',
      message: 'Isso irá carregar os estilos iniciais detalhados (Enciclopédia) no banco de dados. Continuar?',
        onConfirm: async () => {
          setLoading(true);
          setError('');
          try {
            // Clear existing styles first
            const snapshot = await getDocs(collection(db, 'styles'));
            const deleteBatch = writeBatch(db);
            snapshot.docs.forEach(d => {
              deleteBatch.delete(d.ref);
            });
            await deleteBatch.commit();

            // Add new styles
            const batch = writeBatch(db);
            INITIAL_STYLES.forEach(style => {
              const newDocRef = doc(collection(db, 'styles'));
              batch.set(newDocRef, style);
            });
            await batch.commit();
            fetchStyles();
          } catch (err: any) {
          console.error(err);
          setError(`Erro ao carregar estilos iniciais: ${err.message}`);
          handleFirestoreError(err, OperationType.WRITE, 'styles/seed');
        } finally {
          setLoading(false);
        }
      }
    });
    setIsConfirmModalOpen(true);
  }, [fetchStyles]);

  useEffect(() => { fetchStyles(); }, [fetchStyles]);

    // Helper to compress base64 images if they are too large
    const compressBase64IfNeeded = async (base64: string): Promise<string> => {
      if (!base64.startsWith('data:image/')) return base64;
      // If it's already small enough (roughly < 500KB to be safe with base64 overhead), skip
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
      setError('');
      setLoading(true);
      
      try {
        const slug = formData.title?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        
        // Filter and compress images
        const rawImages = (formData.images || []).filter(img => img.trim() !== '');
        const compressedImages = await Promise.all(rawImages.map(img => compressBase64IfNeeded(img)));
        
        const filteredArchitectWorks = (formData.architectWorks || []).filter(aw => aw.architect.trim() !== '');
        
        const data = { 
          ...formData, 
          slug, 
          images: compressedImages,
          architectWorks: filteredArchitectWorks
        };

        if (editingStyle?.id) {
          await updateDoc(doc(db, 'styles', editingStyle.id), data);
        } else {
          await addDoc(collection(db, 'styles'), data);
        }
        setIsModalOpen(false);
        setEditingStyle(null);
        setFormData({ title: '', description: '', context: '', characteristics: [], architects: '', architectWorks: [{ architect: '', works: [''] }], examples: '', images: [''], slug: '' });
        fetchStyles();
      } catch (err: any) {
        console.error(err);
        setError(`Erro ao salvar estilo: ${err.message}`);
        handleFirestoreError(err, editingStyle?.id ? OperationType.UPDATE : OperationType.CREATE, `styles/${editingStyle?.id || 'new'}`);
      } finally {
        setLoading(false);
      }
    };

  const handleDelete = useCallback(async (id: string) => {
    setConfirmAction({
      title: 'Excluir Estilo',
      message: 'Tem certeza que deseja excluir este estilo? Esta ação não pode ser desfeita.',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'styles', id));
          fetchStyles();
        } catch (err: any) {
          console.error(err);
          setError(`Erro ao excluir estilo: ${err.message}`);
          handleFirestoreError(err, OperationType.DELETE, `styles/${id}`);
        }
      }
    });
    setIsConfirmModalOpen(true);
  }, [fetchStyles]);

  const openModal = useCallback((style: Style | null = null) => {
    startTransition(() => {
      if (style) {
        setEditingStyle(style);
        setFormData({
          ...style,
          images: style.images && style.images.length > 0 ? style.images : [''],
          architectWorks: style.architectWorks && style.architectWorks.length > 0 ? style.architectWorks : [{ architect: '', works: [''] }]
        });
      } else {
        setEditingStyle(null);
        setFormData({ title: '', description: '', context: '', characteristics: [], architects: '', architectWorks: [{ architect: '', works: [''] }], examples: '', images: [''], slug: '' });
      }
      setIsModalOpen(true);
    });
  }, []);

  const addArchitectWork = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      architectWorks: [...(prev.architectWorks || []), { architect: '', works: [''] }]
    }));
  }, []);

  const removeArchitectWork = useCallback((idx: number) => {
    setFormData(prev => ({
      ...prev,
      architectWorks: prev.architectWorks?.filter((_, i) => i !== idx)
    }));
  }, []);

  const updateArchitectWork = useCallback((idx: number, field: 'architect' | 'works', value: any) => {
    setFormData(prev => {
      const newAW = [...(prev.architectWorks || [])];
      if (field === 'architect') {
        newAW[idx] = { ...newAW[idx], architect: value };
      } else {
        newAW[idx] = { ...newAW[idx], works: value.split(',').map((s: string) => s.trim()) };
      }
      return { ...prev, architectWorks: newAW };
    });
  }, []);

  const addImageField = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), '']
    }));
  }, []);

  const removeImageField = useCallback((idx: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== idx)
    }));
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
        onConfirm={confirmAction?.onConfirm || (() => {})}
        title={confirmAction?.title || ''}
        message={confirmAction?.message || ''}
      />
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter">Estilos Arquitetônicos</h2>
          <p className="text-zinc-500">Gerencie o catálogo de estilos do site.</p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={seedStyles}
            className="bg-zinc-100 text-black px-6 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 hover:bg-zinc-200 transition-all"
          >
            <RefreshCw size={18} />
            <span>Carregar Iniciais</span>
          </button>
          <button 
            onClick={() => openModal()}
            className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 hover:bg-zinc-800 transition-all"
          >
            <Plus size={18} />
            <span>Novo Estilo</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl flex items-start space-x-3 text-sm">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div></div>
      ) : styles.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {styles.map(style => (
            <StyleItem 
              key={style.id} 
              style={style} 
              onEdit={openModal} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-40 border-2 border-dashed border-zinc-100 rounded-3xl">
          <p className="text-zinc-400 font-medium mb-4">Nenhum estilo cadastrado no banco de dados.</p>
          <button onClick={seedStyles} className="text-black font-bold underline">Carregar estilos padrão</button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-8 border-b border-zinc-100 flex justify-between items-center">
              <h3 className="text-2xl font-bold tracking-tighter">{editingStyle ? 'Editar Estilo' : 'Novo Estilo'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Título do Estilo</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-zinc-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
                  required 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Resumo (Descrição Curta)</label>
                <textarea 
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-zinc-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none resize-none"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Características (separadas por vírgula)</label>
                <input 
                  type="text" 
                  value={formData.characteristics?.join(', ')}
                  onChange={(e) => setFormData({ ...formData, characteristics: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full bg-zinc-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Contexto Histórico (Enciclopédia)</label>
                <textarea 
                  rows={6}
                  value={formData.context}
                  onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                  className="w-full bg-zinc-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none resize-none"
                ></textarea>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex justify-between">
                  <span>Arquitetos e Obras</span>
                  <button 
                    type="button" 
                    onClick={addArchitectWork}
                    className="text-black hover:underline"
                  >
                    + Adicionar Arquiteto
                  </button>
                </label>
                <div className="space-y-4">
                  {formData.architectWorks?.map((aw, idx) => (
                    <div key={idx} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-4 relative">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Nome do Arquiteto</label>
                        <input 
                          type="text" 
                          value={aw.architect}
                          onChange={(e) => updateArchitectWork(idx, 'architect', e.target.value)}
                          className="w-full bg-white border-none px-4 py-2 rounded-lg focus:ring-2 focus:ring-black outline-none text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Obras (separadas por vírgula)</label>
                        <input 
                          type="text" 
                          value={aw.works.join(', ')}
                          onChange={(e) => updateArchitectWork(idx, 'works', e.target.value)}
                          className="w-full bg-white border-none px-4 py-2 rounded-lg focus:ring-2 focus:ring-black outline-none text-sm"
                        />
                      </div>
                      {idx > 0 && (
                        <button 
                          type="button" 
                          onClick={() => removeArchitectWork(idx)}
                          className="absolute top-2 right-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Arquitetos de Referência (Texto Simples)</label>
                  <input 
                    type="text" 
                    value={formData.architects}
                    onChange={(e) => setFormData({ ...formData, architects: e.target.value })}
                    className="w-full bg-zinc-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Exemplos de Obras (Texto Simples)</label>
                  <input 
                    type="text" 
                    value={formData.examples}
                    onChange={(e) => setFormData({ ...formData, examples: e.target.value })}
                    className="w-full bg-zinc-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex justify-between">
                  <span>Imagens do Estilo</span>
                  <button 
                    type="button" 
                    onClick={addImageField}
                    className="text-black hover:underline"
                  >
                    + Adicionar Imagem
                  </button>
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.images?.map((img, idx) => (
                    <div key={idx} className="relative p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <FileUpload 
                        value={img}
                        onChange={(val) => handleImageChange(idx, val)}
                        label={`Imagem ${idx + 1}`}
                      />
                      {idx > 0 && (
                        <button 
                          type="button" 
                          onClick={() => removeImageField(idx)}
                          className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Remover Imagem"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-100">
                <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all">
                  Salvar Estilo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
