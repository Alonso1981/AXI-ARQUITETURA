import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { LogOut } from 'lucide-react';

export default function AdminEditStatus({ user }: { user: any }) {
  if (!user) return null;

  return (
    <section className="py-20 bg-zinc-100 border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="inline-flex items-center space-x-2 text-zinc-500 mb-6">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <p>Você está no modo de edição administrativa.</p>
        </div>
        <br />
        <button 
          onClick={() => signOut(auth)}
          className="bg-black text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center space-x-3 mx-auto"
        >
          <LogOut size={18} />
          <span>Sair do Modo de Edição</span>
        </button>
      </div>
    </section>
  );
}
