import { useState, useEffect, useCallback, useTransition, memo } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Lead } from '../../types';
import { Trash2, Mail, Phone, MapPin, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ConfirmModal from '../../components/ConfirmModal';
import { handleFirestoreError, OperationType } from '../../lib/firestore-errors';

const LeadItem = memo(({ lead, onDelete }: { lead: Lead; onDelete: (id: string) => void }) => (
  <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm group">
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400">
          <User size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold">{lead.name}</h3>
          <div className="flex items-center space-x-2 text-xs text-zinc-400 font-bold uppercase tracking-widest">
            <Calendar size={12} />
            <span>{lead.createdAt ? format(new Date(lead.createdAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR }) : 'Sem data'}</span>
          </div>
        </div>
      </div>
      <button 
        onClick={() => onDelete(lead.id!)}
        className="p-3 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={18} />
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="flex items-center space-x-3 text-sm text-zinc-600">
        <Mail size={16} className="text-zinc-400" />
        <span>{lead.email}</span>
      </div>
      <div className="flex items-center space-x-3 text-sm text-zinc-600">
        <Phone size={16} className="text-zinc-400" />
        <span>{lead.phone}</span>
      </div>
      <div className="flex items-center space-x-3 text-sm text-zinc-600">
        <MapPin size={16} className="text-zinc-400" />
        <span>{lead.city}</span>
      </div>
    </div>

    <div className="bg-zinc-50 p-6 rounded-2xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1">Tipo de Projeto</p>
          <p className="text-sm font-bold">{lead.projectType}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1">Área</p>
          <p className="text-sm font-bold">{lead.area || 'Não informado'}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1">Estilo</p>
          <p className="text-sm font-bold">{lead.style || 'Não informado'}</p>
        </div>
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1">Descrição</p>
        <p className="text-sm text-zinc-600 leading-relaxed">{lead.description}</p>
      </div>
    </div>
  </div>
));

export default function LeadsAdmin() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead)));
    } catch (err: any) {
      console.error(err);
      handleFirestoreError(err, OperationType.LIST, 'leads');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleDelete = useCallback(async (id: string) => {
    setLeadToDelete(id);
    setIsConfirmModalOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (leadToDelete) {
      try {
        await deleteDoc(doc(db, 'leads', leadToDelete));
        setLeadToDelete(null);
        setIsConfirmModalOpen(false);
        fetchLeads();
      } catch (err: any) {
        console.error(err);
        handleFirestoreError(err, OperationType.DELETE, `leads/${leadToDelete}`);
      }
    }
  }, [leadToDelete, fetchLeads]);

  return (
    <div>
      <ConfirmModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Lead"
        message="Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita."
      />
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tighter">Leads</h2>
        <p className="text-zinc-500">Contatos recebidos pelo formulário do site.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div></div>
      ) : leads.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {leads.map(lead => (
            <LeadItem 
              key={lead.id} 
              lead={lead} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-40 border-2 border-dashed border-zinc-100 rounded-3xl">
          <p className="text-zinc-400 font-medium">Nenhum lead recebido ainda.</p>
        </div>
      )}
    </div>
  );
}
