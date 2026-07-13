interface MetricCardProps {
  title: string;
  icon: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
}

export default function MetricCard({ title, icon, value, trend }: MetricCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-xl border border-outline-variant/50 p-6 flex flex-col gap-4 transition-all duration-300 relative overflow-hidden group hover:-translate-y-1">
      {/* Premium subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Decorative circle animation */}
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
      
      <div className="flex items-center justify-between z-10">
        <span className="font-label text-[13px] font-semibold text-on-surface-variant uppercase tracking-wider">{title}</span>
        <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-primary shadow-inner group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300">
          <span className="material-symbols-outlined text-[24px]">{icon}</span>
        </div>
      </div>
      
      <div className="flex items-end justify-between z-10 mt-2">
        <span className="font-headline text-[40px] font-bold text-on-surface leading-none tracking-tight">{value}</span>
        {trend && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-label text-[13px] font-medium backdrop-blur-sm ${trend.direction === 'up' ? 'bg-primary-container/50 text-on-primary-container' : 'bg-error-container/50 text-on-error-container'}`}>
            <span className="material-symbols-outlined text-[16px]">
              {trend.direction === 'up' ? 'trending_up' : 'trending_down'}
            </span>
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );
}
