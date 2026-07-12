'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  // We can also keep track of profile_type if we want, but keeping it simple for now

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error logging in:', error.message);
      setErrorMsg(error.message || 'Falha ao iniciar sessão. Verifique as credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full flex bg-surface text-on-surface overflow-hidden font-body text-[16px] antialiased min-h-screen">
      {/* Left Split: Branding Canvas */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-primary text-on-primary relative overflow-hidden p-10 lg:p-14 shadow-[inset_-10px_0_20px_-10px_rgba(0,0,0,0.1)]">
        {/* Decorative Background Element */}
        <div className="absolute -left-20 -bottom-20 opacity-10 pointer-events-none transform rotate-12 scale-150">
          <span className="material-symbols-outlined text-[400px]">menu_book</span>
        </div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary-fixed-dim/20 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <img alt="Institution Logo" className="h-16 w-auto mix-blend-screen opacity-90 rounded" src="/img/logo.png" />
        </div>
        <div className="relative z-10 max-w-md mt-auto mb-20">
          <h1 className="font-headline text-[36px] font-bold text-on-primary mb-4 leading-tight">Academic Management System</h1>
          <p className="font-body text-[18px] text-on-primary/80">Streamlining institutional administration with clarity and structure.</p>
        </div>
        <div className="relative z-10 flex items-center gap-2 font-label text-[14px] font-semibold text-on-primary/60">
          <span className="material-symbols-outlined text-sm">school</span>
          <span>ISPNE - Uíge</span>
        </div>
      </div>
      
      {/* Right Split: Login Canvas */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-14 bg-surface relative">
        {/* Abstract subtle pattern for right side */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-surface-variant/30 via-transparent to-transparent"></div>
        <div className="w-full max-w-md bg-surface-container-lowest rounded-lg shadow-sm p-8 relative z-10 border border-outline-variant/30">
          <div className="text-center mb-8">
            {/* Mobile Logo Fallback */}
            <img alt="Institution Logo" className="h-12 w-auto mx-auto mb-6 lg:hidden opacity-90 rounded" src="/img/logo.png" />
            <h2 className="font-headline text-[28px] font-bold text-primary mb-2">Bem-vindo ao SIGA</h2>
            <p className="font-body text-[14px] text-on-surface-variant">Por favor, insira as suas credenciais para aceder ao sistema.</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="block font-label text-[14px] font-semibold text-on-surface" htmlFor="email">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">mail</span>
                </div>
                <input 
                  className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-lg font-body text-[16px] text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow" 
                  id="email" 
                  placeholder="nome@instituicao.edu" 
                  required 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block font-label text-[14px] font-semibold text-on-surface" htmlFor="password">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">lock</span>
                </div>
                <input 
                  className="block w-full pl-10 pr-10 py-2 border border-outline-variant rounded-lg font-body text-[16px] text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow" 
                  id="password" 
                  placeholder="••••••••" 
                  required 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-end pt-1">
                <a className="font-label text-[12px] font-medium text-primary hover:text-primary-fixed-dim hover:underline transition-colors" href="#">Esqueci-me da senha</a>
              </div>
            </div>

            {errorMsg && (
              <div className="text-error text-sm font-medium mt-2 bg-error/10 p-2 rounded">
                {errorMsg}
              </div>
            )}
            
            <div className="pt-4">
              <button 
                className="w-full flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 text-on-primary font-label text-[16px] font-semibold py-3 px-4 rounded-lg shadow-sm transition-all active:scale-[0.98] disabled:opacity-70" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'A entrar...' : 'Entrar'}
                {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
              </button>
            </div>
          </form>
          
          <div className="mt-8 pt-8 border-t border-outline-variant/30 text-center">
            <p className="font-body text-[14px] text-on-surface-variant flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              Acesso restrito a utilizadores autorizados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
