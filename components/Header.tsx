'use client';

import { useSidebar } from './SidebarProvider';

export default function Header({ userProfile }: { userProfile: { nome?: string, papel?: string } | null }) {
  const { toggle } = useSidebar();
  const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 right-0 z-40 w-full bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm flex items-center justify-between px-6 lg:px-10 py-4 transition-all duration-300">
      <div className="flex items-center gap-4">
        <button onClick={toggle} className="md:hidden text-primary p-2 hover:bg-primary/10 rounded-xl transition-colors">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 className="hidden md:block font-headline text-[22px] text-primary font-bold tracking-tight">SIGA Dashboard</h1>
      </div>
      
      <div className="flex-1 max-w-lg mx-8 hidden sm:block relative group">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-[22px] group-focus-within:text-primary transition-colors">search</span>
        <input className="w-full pl-12 pr-4 py-2.5 bg-surface-container-lowest hover:bg-surface-bright border border-outline-variant/40 focus:border-primary/50 rounded-2xl font-body text-[14px] text-on-surface focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-sm transition-all duration-300 placeholder:text-on-surface-variant/50" placeholder="Pesquisar estudantes, cursos..." type="text" />
      </div>

      <div className="flex items-center gap-3">
        <button className="text-on-surface-variant hover:text-primary hover:bg-primary/10 p-2.5 rounded-xl transition-all duration-300 relative group">
          <span className="material-symbols-outlined group-hover:scale-110 transition-transform">notifications</span>
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface animate-pulse"></span>
        </button>
        
        <div className="flex items-center gap-3 ml-2 pl-5 border-l border-outline-variant/30">
          <div className="hidden sm:flex flex-col text-right">
            <span className="font-label text-[14px] font-bold text-on-surface leading-tight">
              {userProfile?.nome || 'Utilizador'}
            </span>
            <span className="font-body text-[12px] font-medium text-on-surface-variant capitalize">
              {userProfile?.papel || 'Visitante'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-outline-variant/30 cursor-pointer hover:ring-4 ring-primary/20 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-secondary-container to-primary-container flex items-center justify-center font-bold text-on-secondary-container text-sm shadow-md">
            {userProfile?.nome ? getInitials(userProfile.nome) : <span className="material-symbols-outlined text-white">person</span>}
          </div>
        </div>
      </div>
    </header>
  );
}
