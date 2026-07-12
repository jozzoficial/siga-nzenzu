import MetricCard from '@/components/MetricCard';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function DashboardPage() {
  const [{ count: estudantesCount }, { count: docentesCount }, { count: cursosCount }, { count: matriculasCount }] = await Promise.all([
    supabase.from('estudantes').select('*', { count: 'exact', head: true }),
    supabase.from('docentes').select('*', { count: 'exact', head: true }),
    supabase.from('cursos').select('*', { count: 'exact', head: true }),
    supabase.from('matriculas').select('*', { count: 'exact', head: true })
  ]);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-gutter">
      <div>
        <h2 className="font-headline text-[36px] font-bold text-on-surface">Visão Geral</h2>
        <p className="font-body text-[16px] text-on-surface-variant mt-1">Bem-vindo ao painel de administração do SIGA.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <MetricCard title="Total de Estudantes" icon="groups" value={estudantesCount || 0} trend={{ direction: 'up', value: '12%' }} />
        <MetricCard title="Docentes Ativos" icon="school" value={docentesCount || 0} trend={{ direction: 'up', value: '2%' }} />
        <MetricCard title="Cursos Disponíveis" icon="menu_book" value={cursosCount || 0} />
        <MetricCard title="Matrículas Hoje" icon="app_registration" value={matriculasCount || 0} trend={{ direction: 'up', value: '45%' }} />
      </div>

      <div className="bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant overflow-hidden flex flex-col mt-sm">
        <div className="px-md py-sm border-b border-outline-variant flex items-center justify-between bg-surface-bright">
          <h3 className="font-headline text-[20px] font-semibold text-on-surface">Últimas Matrículas</h3>
          <button className="font-label text-[14px] font-semibold text-primary hover:text-primary-fixed-dim transition-colors">Ver todas</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-outline-variant">
                <th className="px-md py-sm font-label text-[14px] text-on-surface-variant font-semibold">Nome do Estudante</th>
                <th className="px-md py-sm font-label text-[14px] text-on-surface-variant font-semibold">Curso</th>
                <th className="px-md py-sm font-label text-[14px] text-on-surface-variant font-semibold">Data</th>
                <th className="px-md py-sm font-label text-[14px] text-on-surface-variant font-semibold">Status</th>
                <th className="px-md py-sm font-label text-[14px] text-on-surface-variant font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="px-md py-sm font-body text-[16px] text-on-surface font-medium flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label text-[12px]">AC</div>
                  Ana Costa Silva
                </td>
                <td className="px-md py-sm font-body text-[16px] text-on-surface-variant">Engenharia Informática</td>
                <td className="px-md py-sm font-body text-[16px] text-on-surface-variant">12 Out 2023</td>
                <td className="px-md py-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label text-[12px] bg-secondary-fixed text-on-secondary-fixed">Confirmado</span>
                </td>
                <td className="px-md py-sm text-right">
                  <button className="text-on-surface-variant hover:text-primary p-1 rounded transition-colors opacity-0 group-hover:opacity-100">
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
