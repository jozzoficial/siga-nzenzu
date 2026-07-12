export default function Header() {
  return (
    <header className="sticky top-0 right-0 z-40 w-full bg-surface border-b border-outline-variant shadow-sm flex items-center justify-between px-lg py-xs transition-all duration-300">
      <div className="flex items-center gap-sm">
        <button className="md:hidden text-primary p-2 hover:bg-surface-container-high rounded-full transition-colors">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 className="hidden md:block font-headline text-[20px] text-primary font-bold">ISPNE - Uíge</h1>
      </div>
      <div className="flex-1 max-w-md mx-sm hidden sm:block relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
        <input className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-full font-body text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow" placeholder="Search..." type="text" />
      </div>
      <div className="flex items-center gap-sm">
        <button className="text-on-surface-variant hover:bg-surface-container-high p-2 rounded-full transition-colors relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface"></span>
        </button>
        <button className="text-on-surface-variant hover:bg-surface-container-high p-2 rounded-full transition-colors">
          <span className="material-symbols-outlined">settings</span>
        </button>
        <div className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant ml-xs cursor-pointer hover:ring-2 ring-primary/30 transition-all bg-secondary-container">
            <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-on-secondary-container">person</span>
        </div>
      </div>
    </header>
  );
}
