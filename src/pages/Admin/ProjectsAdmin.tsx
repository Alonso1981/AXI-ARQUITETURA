import { useState, useEffect, useCallback, useTransition, memo, useMemo } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Project } from '../../types';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, FileText, AlertCircle } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import FileUpload from '../../components/FileUpload';
import { handleFirestoreError, OperationType } from '../../lib/firestore-errors';

const ProjectItem = memo(({ project, onEdit, onDelete }: { project: Project, onEdit: (p: Project) => void, onDelete: (id: string) => void }) => (
  <div className="bg-white p-6 rounded-2xl border border-zinc-100 flex items-center justify-between group">
    <div className="flex items-center space-x-6">
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-100">
        {project.images && project.images.length > 0 && (
          <img src={project.images[0]} alt="" className="w-full h-full object-cover" />
        )}
      </div>
      <div>
        <h3 className="font-bold text-lg">{project.title}</h3>
        <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">{project.category}</p>
      </div>
    </div>
    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button 
        onClick={() => onEdit(project)}
        className="p-3 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-xl transition-all"
      >
        <Edit2 size={18} />
      </button>
      <button 
        onClick={() => onDelete(project.id!)}
        className="p-3 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
      >
        <Trash2 size={18} />
      </button>
    </div>
  </div>
));

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  // Form state
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    category: 'Residencial',
    images: [''],
    slug: '',
    createdAt: new Date().toISOString()
  });

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
    } catch (err: any) {
      console.error(err);
      setError(`Erro ao carregar projetos: ${err.message}`);
      handleFirestoreError(err, OperationType.LIST, 'projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleImageChange = useCallback((idx: number, val: string) => {
    setFormData(prev => {
      const newImgs = [...(prev.images || [])];
      newImgs[idx] = val;
      return { ...prev, images: newImgs };
    });
  }, []);

  const addImageField = useCallback(() => {
    setFormData(prev => ({ ...prev, images: [...(prev.images || []), ''] }));
  }, []);

  const removeImageField = useCallback((idx: number) => {
    setFormData(prev => ({ ...prev, images: prev.images?.filter((_, i) => i !== idx) }));
  }, []);

  const openModal = useCallback((project: Project | null) => {
    startTransition(() => {
      if (project) {
        setEditingProject(project);
        setFormData(project);
      } else {
        setEditingProject(null);
        setFormData({ title: '', description: '', category: 'Residencial', images: [''], slug: '' });
      }
      setIsModalOpen(true);
    });
  }, []);

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
    setError('');
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
        createdAt: editingProject?.createdAt || new Date().toISOString() 
      };

      if (editingProject?.id) {
        await updateDoc(doc(db, 'projects', editingProject.id), data);
      } else {
        await addDoc(collection(db, 'projects'), data);
      }
      setIsModalOpen(false);
      setEditingProject(null);
      setFormData({ title: '', description: '', category: 'Residencial', images: [''], slug: '' });
      fetchProjects();
    } catch (err: any) {
      console.error(err);
      setError(`Erro ao salvar projeto: ${err.message}`);
      handleFirestoreError(err, editingProject?.id ? OperationType.UPDATE : OperationType.CREATE, `projects/${editingProject?.id || 'new'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = useCallback((id: string) => {
    setProjectToDelete(id);
    setIsConfirmModalOpen(true);
  }, []);

  const confirmDelete = async () => {
    if (projectToDelete) {
      setError('');
      try {
        await deleteDoc(doc(db, 'projects', projectToDelete));
        setProjectToDelete(null);
        setIsConfirmModalOpen(false);
        fetchProjects();
      } catch (err: any) {
        console.error(err);
        setError(`Erro ao excluir projeto: ${err.message}`);
        handleFirestoreError(err, OperationType.DELETE, `projects/${projectToDelete}`);
      }
    }
  };

  return (
    <div>
      <ConfirmModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Projeto"
        message="Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita."
      />
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter">Projetos</h2>
          <p className="text-zinc-500">Gerencie seu portfólio de obras.</p>
        </div>
        <button 
          onClick={() => openModal(null)}
          className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 hover:bg-zinc-800 transition-all"
        >
          <Plus size={18} />
          <span>Novo Projeto</span>
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl flex items-start space-x-3 text-sm">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.map(project => (
            <ProjectItem 
              key={project.id} 
              project={project} 
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
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-8 border-b border-zinc-100 flex justify-between items-center">
              <h3 className="text-2xl font-bold tracking-tighter">{editingProject ? 'Editar Projeto' : 'Novo Projeto'}</h3>
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
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Categoria</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-zinc-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none appearance-none"
                  >
                    <option>Residencial</option>
                    <option>Comercial</option>
                    <option>Institucional</option>
                    <option>Urbanístico</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Descrição</label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-zinc-50 border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-black outline-none resize-none"
                ></textarea>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex justify-between">
                  <span>Imagens do Projeto</span>
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
                  Salvar Projeto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
