import { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate, Navigate } from 'react-router-dom';
import { LogIn, ShieldCheck, AlertCircle } from 'lucide-react';
import { useSettings } from '../../SettingsContext';

export default function Login({ user }: { user: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isConfigAdmin = email.toLowerCase().trim() === 'alonsofarma@terra.com.br' || email.toLowerCase().trim() === 'beneditoalonsoalbuquerque@gmail.com';

  if (user) return <Navigate to="/admin" />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const normalizedEmail = email.toLowerCase().trim();
      await signInWithEmailAndPassword(auth, normalizedEmail, password);
      navigate('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      const normalizedEmail = email.toLowerCase().trim();
      
      // Se for o admin configurado e o login falhou (provavelmente senha errada ou usuário não existe)
      if (isConfigAdmin) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
          try {
            // Tenta criar o usuário com a senha fornecida (caso ele não exista)
            await createUserWithEmailAndPassword(auth, normalizedEmail, password);
            navigate('/admin');
            return;
          } catch (createErr: any) {
            if (createErr.code === 'auth/email-already-in-use') {
              setError('Este e-mail já está cadastrado com outra senha no sistema do Google (Firebase). Como você quer usar a senha "270afc", você PRECISA entrar no Console do Firebase e EXCLUIR o usuário atual para que eu possa criá-lo novamente com a senha nova.');
            } else {
              setError(`Erro ao criar acesso: ${createErr.message}`);
            }
            setLoading(false);
            return;
          }
        }
      }
      
      setError('E-mail ou senha incorretos. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-6">
      <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-2xl border border-zinc-100">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter mb-2">Área do Usuário</h1>
          <p className="text-zinc-500 text-sm">Acesso restrito para administração.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl flex items-start space-x-3 text-sm animate-shake">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-50 border-none px-4 py-4 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all"
              placeholder="seu-email@exemplo.com"
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-50 border-none px-4 py-4 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all"
              placeholder="••••••••"
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-5 rounded-xl font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Entrar</span>
                <LogIn size={18} />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-12 pt-8 border-t border-zinc-100 text-center">
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
            {useSettings().siteName}
          </p>
        </div>
      </div>
    </div>
  );
}
