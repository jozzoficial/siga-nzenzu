'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function Sidebar({ userProfile }: { userProfile?: { nome?: string, papel?: string } | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const links = [
    { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { href: '/estudantes', icon: 'school', label: 'Estudantes' },
    { href: '/matriculas', icon: 'how_to_reg', label: 'Matrículas' },
    { href: '/docentes', icon: 'person', label: 'Docentes' },
    { href: '/cursos', icon: 'menu_book', label: 'Cursos' },
    { href: '/disciplinas', icon: 'auto_stories', label: 'Disciplinas' },
    { href: '/pautas', icon: 'grade', label: 'Pautas' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-primary/95 backdrop-blur-xl border-r border-white/10 shadow-[4px_0_24px_rgba(0,0,0,0.05)] flex flex-col p-6 z-50 hidden md:flex transition-all duration-300">
      <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-white/10">
        <div className="rounded-xl bg-white/10 backdrop-blur-sm p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
          <img alt="ISPNE Logo" className="h-12 w-auto object-cover rounded-lg" src="/img/logo.png" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-headline text-[20px] font-extrabold text-white truncate tracking-tight">ISPNE - Uíge</span>
          <span className="font-body text-[13px] text-white/70 truncate font-medium">Academic System</span>
        </div>
      </div>
      
      <nav className="flex-1 flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`font-label text-[14px] px-4 py-3 flex items-center gap-4 transition-all duration-300 rounded-xl group relative overflow-hidden ${
                isActive
                  ? 'bg-white/15 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'
                  : 'text-white/70 hover:bg-white/10 hover:text-white hover:translate-x-1'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 bg-secondary-fixed rounded-r-full shadow-[0_0_10px_rgba(202,234,214,0.8)]"></div>
              )}
              <span className={`material-symbols-outlined transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {link.icon}
              </span>
              <span className="font-semibold tracking-wide">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 mt-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full font-label text-[14px] px-4 py-3 flex items-center gap-4 text-white/70 hover:bg-error/20 hover:text-error-container rounded-xl transition-all duration-300 group hover:translate-x-1"
        >
          <span className="material-symbols-outlined group-hover:text-error-container transition-transform group-hover:rotate-12">logout</span>
          <span className="font-semibold tracking-wide">Terminar Sessão</span>
        </button>
      </div>
    </aside>
  );
}
