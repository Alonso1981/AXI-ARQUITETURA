import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tighter">{title}</h3>
              <p className="text-zinc-500 text-sm">{message}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-xs bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-all"
            >
              Cancelar
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-xs bg-red-500 text-white hover:bg-red-600 transition-all"
            >
              Confirmar Exclusão
            </button>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-full transition-all"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
