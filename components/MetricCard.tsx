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
    <div className="bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant p-md flex flex-col gap-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
      <div className="flex items-center justify-between z-10">
        <span className="font-label text-[14px] text-on-surface-variant uppercase tracking-wider">{title}</span>
        <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded">{icon}</span>
      </div>
      <div className="flex items-end gap-2 z-10 mt-xs">
        <span className="font-headline text-[36px] font-bold text-on-surface leading-tight">{value}</span>
        {trend && (
          <span className={`font-label text-[12px] mb-1 flex items-center ${trend.direction === 'up' ? 'text-primary' : 'text-error'}`}>
            <span className="material-symbols-outlined text-[14px]">
              {trend.direction === 'up' ? 'arrow_upward' : 'arrow_downward'}
            </span>{' '}
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
