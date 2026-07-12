'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { href: '/estudantes', icon: 'school', label: 'Students' },
    { href: '/docentes', icon: 'person', label: 'Teachers' },
    { href: '/cursos', icon: 'menu_book', label: 'Courses' },
    { href: '/pautas', icon: 'grade', label: 'Grades' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-primary border-r border-outline-variant shadow-sm flex flex-col gap-sm p-sm z-50 hidden md:flex transition-all duration-300">
      <div className="flex items-center gap-xs px-xs py-sm mb-sm border-b border-outline-variant/30">
        <div className="rounded bg-surface-container-lowest flex items-center justify-center overflow-hidden shrink-0">
          <img alt="ISPNE Logo" className="h-16 w-auto object-cover" src="/img/logo.png" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-headline text-[20px] font-bold text-on-primary truncate">ISPNE - Uíge</span>
          <span className="font-body text-[14px] text-on-primary/80 truncate">Academic System</span>
        </div>
      </div>
      <nav className="flex-1 flex flex-col gap-base">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`font-label text-[14px] px-xs py-xs flex items-center gap-xs transition-colors duration-200 group active:scale-[0.98] ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container border-l-4 border-white rounded-r'
                  : 'text-on-primary/80 hover:bg-primary-container hover:text-on-primary-container border-l-4 border-transparent'
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? '' : 'group-hover:text-on-primary-container'}`} style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {link.icon}
              </span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
