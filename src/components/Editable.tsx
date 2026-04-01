import React, { useState, useTransition, memo } from 'react';
import { Pencil, Check, X, Loader2, FileText } from 'lucide-react';
import FileUpload from './FileUpload';

interface EditableProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  type?: 'text' | 'textarea' | 'image' | 'pdf';
  isAdmin?: boolean;
  className?: string;
  label?: string;
  fontSize?: number;
  onFontSizeChange?: (newSize: number) => Promise<void>;
  editButtonClassName?: string;
}

const Editable = memo(function Editable({ 
  value, 
  onSave, 
  type = 'text', 
  isAdmin = false, 
  className = '', 
  label,
  fontSize,
  onFontSizeChange,
  editButtonClassName = ''
}: EditableProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [currentFontSize, setCurrentFontSize] = useState(fontSize || 16);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  React.useEffect(() => {
    if (!isEditing) {
      setCurrentValue(value);
    }
  }, [value, isEditing]);

  React.useEffect(() => {
    if (!isEditing && fontSize) {
      setCurrentFontSize(fontSize);
    }
  }, [fontSize, isEditing]);

  if (!isAdmin) {
    if (type === 'image') return <img src={value} alt="" className={className} referrerPolicy="no-referrer" />;
    if (type === 'pdf') {
      return (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${className}`}
        >
          <FileText size={14} />
          <span>Visualizar PDF</span>
        </a>
      );
    }
    return <span className={className}>{value}</span>;
  }

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(currentValue);
      if (onFontSizeChange && fontSize !== currentFontSize) {
        await onFontSizeChange(currentFontSize);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(() => {
      setIsEditing(true);
    });
  };

  if (isEditing) {
    return (
      <div className={`inline-flex flex-col gap-2 w-full ${className} bg-zinc-50 p-4 rounded-2xl border border-zinc-200 shadow-lg z-[100]`}>
        {label && <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</label>}
        <div className="flex flex-col gap-3">
          {type === 'textarea' ? (
            <textarea
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className="w-full bg-white border border-zinc-200 p-3 rounded-xl text-black outline-none min-h-[120px] text-sm"
              style={onFontSizeChange ? { fontSize: `${currentFontSize}px` } : undefined}
              autoFocus
            />
          ) : (type === 'image' || type === 'pdf') ? (
            <FileUpload 
              value={currentValue}
              onChange={(val) => setCurrentValue(val)}
              accept={type === 'image' ? "image/*" : "application/pdf"}
              label={label}
            />
          ) : (
            <input
              type="text"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className="w-full bg-white border border-zinc-200 p-3 rounded-xl text-black outline-none text-sm"
              style={onFontSizeChange ? { fontSize: `${currentFontSize}px` } : undefined}
              autoFocus
            />
          )}
          
          {onFontSizeChange && (
            <div className="flex flex-col gap-2 p-3 bg-white border border-zinc-200 rounded-xl">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Tamanho da Fonte: {currentFontSize}px</label>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={currentFontSize}
                onChange={(e) => setCurrentFontSize(parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-black"
              />
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-grow flex items-center justify-center gap-2 py-3 bg-black text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 transition-all"
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              <span>Salvar Alterações</span>
            </button>
            <button
              onClick={() => { setIsEditing(false); setCurrentValue(value); }}
              disabled={isLoading}
              className="p-3 bg-zinc-200 text-zinc-600 rounded-xl hover:bg-zinc-300 disabled:opacity-50 transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`group relative inline-block w-full ${className}`} 
      style={fontSize ? { fontSize: `${fontSize}px` } : undefined}
      onClick={(e) => isEditing && e.stopPropagation()}
    >
      {type === 'image' ? (
        <div className="relative w-full h-full">
          <img src={value} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <button
            onClick={startEditing}
            className={`absolute top-4 right-4 p-3 bg-black/60 text-white rounded-full opacity-60 hover:opacity-100 transition-all backdrop-blur-md border border-white/20 shadow-xl hover:scale-110 z-50 ${editButtonClassName}`}
          >
            <Pencil size={18} />
          </button>
        </div>
      ) : type === 'pdf' ? (
        <div className="flex items-center gap-3">
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
          >
            <FileText size={14} />
            <span>Visualizar PDF</span>
          </a>
          <button
            onClick={startEditing}
            className="p-2 bg-zinc-100 text-zinc-400 hover:text-black hover:bg-zinc-200 rounded-lg opacity-60 hover:opacity-100 transition-all shadow-sm"
          >
            <Pencil size={14} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span>{value}</span>
          <button
            onClick={startEditing}
            className="p-1.5 bg-zinc-100 text-zinc-400 hover:text-black hover:bg-zinc-200 rounded-lg opacity-60 hover:opacity-100 transition-all shadow-sm"
          >
            <Pencil size={14} />
          </button>
        </div>
      )}
    </div>
  );
});

export default Editable;
