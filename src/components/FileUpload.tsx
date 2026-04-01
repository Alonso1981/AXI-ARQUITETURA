import React, { useState, memo } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  value: string;
  onChange: (value: string) => void;
  accept?: string;
  label?: string;
  placeholder?: string;
}

const FileUpload = memo(function FileUpload({ value, onChange, accept = "image/*", label, placeholder }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const compressImage = (dataUrl: string, maxWidth = 1200, maxHeight = 1200, quality = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
    });
  };

  const handleFile = (file: File) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const result = reader.result as string;
      if (file.type.startsWith('image/')) {
        const compressed = await compressImage(result);
        onChange(compressed);
      } else {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const isImage = value && (value.startsWith('data:image/') || value.match(/\.(jpg|jpeg|png|gif|webp)$/i));
  const isPdf = value && (value.startsWith('data:application/pdf') || value.match(/\.pdf$/i));

  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">{label}</label>}
      
      <div className="flex flex-col gap-4">
        {value && (
          <div className="relative group aspect-video rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
            {isImage ? (
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            ) : isPdf ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
                <FileText size={48} />
                <span className="text-[10px] font-bold uppercase tracking-widest mt-2">Arquivo PDF</span>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400">
                <FileText size={48} />
              </div>
            )}
            <button 
              onClick={() => onChange('')}
              className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-black"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer ${
            isDragging ? 'border-black bg-zinc-50' : 'border-zinc-200 hover:border-zinc-400'
          }`}
          onClick={() => document.getElementById(`file-input-${label}`)?.click()}
        >
          <input 
            id={`file-input-${label}`}
            type="file" 
            accept={accept}
            onChange={onFileChange}
            className="hidden"
          />
          <Upload size={24} className="text-zinc-400 mb-2" />
          <p className="text-sm font-medium text-zinc-600">Arraste ou clique para selecionar</p>
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1">PNG, JPG ou PDF</p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Ou cole a URL</label>
          <input 
            type="text" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "https://exemplo.com/arquivo.ext"}
            className="w-full bg-zinc-50 border-none px-4 py-2 rounded-lg text-xs outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>
    </div>
  );
});

export default FileUpload;
