import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home, LogOut } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/admin/login';
    } catch (error) {
      console.error("Error signing out:", error);
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = "Ocorreu um erro inesperado no sistema.";
      let isFirestoreError = false;

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.operationType) {
            isFirestoreError = true;
            errorMessage = `Erro de Permissão: Você não tem autorização para realizar a operação de ${parsed.operationType} em ${parsed.path || 'este local'}.`;
          }
        }
      } catch (e) {
        // Not a JSON error message
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-6 py-12">
          <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-2xl border border-zinc-100 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <AlertCircle size={40} />
            </div>
            
            <h1 className="text-3xl font-bold tracking-tighter mb-4">Ops! Algo deu errado.</h1>
            
            <div className="bg-zinc-50 p-6 rounded-2xl mb-8 text-left">
              <p className="text-sm text-zinc-600 leading-relaxed">
                {errorMessage}
              </p>
              {isFirestoreError && (
                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mt-4">
                  Código do Erro: PERMISSION_DENIED
                </p>
              )}
            </div>

            <div className="space-y-4">
              <button
                onClick={this.handleReset}
                className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center space-x-3"
              >
                <RefreshCw size={18} />
                <span>Tentar Novamente</span>
              </button>
              
              {isFirestoreError && (
                <button
                  onClick={this.handleLogout}
                  className="w-full bg-zinc-100 text-zinc-900 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center space-x-3"
                >
                  <LogOut size={18} />
                  <span>Sair e Tentar Novamente</span>
                </button>
              )}

              <a
                href="/"
                className="w-full bg-zinc-100 text-zinc-900 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center space-x-3"
              >
                <Home size={18} />
                <span>Voltar ao Início</span>
              </a>
            </div>

            <div className="mt-12 pt-8 border-t border-zinc-100">
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                Axis Arquitetura & Urbanismo
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
