import MetricCard from '@/components/MetricCard';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();
  const [{ count: estudantesCount }, { count: docentesCount }, { count: cursosCount }, { count: matriculasCount }, { data: ultimasMatriculas }] = await Promise.all([
    supabase.from('estudantes').select('*', { count: 'exact', head: true }),
    supabase.from('docentes').select('*', { count: 'exact', head: true }),
    supabase.from('cursos').select('*', { count: 'exact', head: true }),
    supabase.from('matriculas').select('*', { count: 'exact', head: true }),
    supabase.from('matriculas').select('*, estudantes(nome, bi), cursos(nome)').order('data_matricula', { ascending: false }).limit(5)
  ]);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8">
      <div>
        <h2 className="font-headline text-[36px] font-bold text-on-surface">Visão Geral</h2>
        <p className="font-body text-[16px] text-on-surface-variant mt-1">Bem-vindo ao painel de administração do SIGA.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total de Estudantes" icon="groups" value={estudantesCount || 0} trend={{ direction: 'up', value: '12%' }} />
        <MetricCard title="Docentes Ativos" icon="school" value={docentesCount || 0} trend={{ direction: 'up', value: '2%' }} />
        <MetricCard title="Cursos Disponíveis" icon="menu_book" value={cursosCount || 0} />
        <MetricCard title="Matrículas Hoje" icon="app_registration" value={matriculasCount || 0} trend={{ direction: 'up', value: '45%' }} />
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/40 overflow-hidden flex flex-col mt-4">
        <div className="px-6 py-5 border-b border-outline-variant/40 flex items-center justify-between bg-surface-container-lowest">
          <h3 className="font-headline text-[20px] font-semibold text-on-surface">Últimas Matrículas</h3>
          <button className="font-label text-[14px] font-semibold text-primary hover:text-primary-fixed-dim bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors">Ver todas</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-outline-variant/40">
                <th className="px-6 py-4 font-label text-[13px] text-on-surface-variant font-semibold uppercase tracking-wider">Nome do Estudante</th>
                <th className="px-6 py-4 font-label text-[13px] text-on-surface-variant font-semibold uppercase tracking-wider">Curso</th>
                <th className="px-6 py-4 font-label text-[13px] text-on-surface-variant font-semibold uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 font-label text-[13px] text-on-surface-variant font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-label text-[13px] text-on-surface-variant font-semibold uppercase tracking-wider text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {!ultimasMatriculas || ultimasMatriculas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center font-medium text-on-surface-variant">Nenhuma matrícula registada recentemente.</td>
                </tr>
              ) : ultimasMatriculas.map((mat) => (
                <tr key={mat.id} className="hover:bg-surface-container-lowest hover:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 group cursor-pointer">
                  <td className="px-6 py-4 font-body text-[15px] text-on-surface font-medium flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label text-[14px] shadow-inner shrink-0">
                      {mat.estudantes?.nome ? mat.estudantes.nome.substring(0, 2).toUpperCase() : 'U'}
                    </div>
                    {mat.estudantes?.nome || 'Estudante não encontrado'}
                  </td>
                  <td className="px-6 py-4 font-body text-[15px] text-on-surface-variant">{mat.cursos?.nome || 'Curso Indefinido'}</td>
                  <td className="px-6 py-4 font-body text-[15px] text-on-surface-variant">{new Date(mat.data_matricula).toLocaleDateString('pt-PT')}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full font-label text-[12px] font-semibold shadow-sm ${mat.estado === 'Confirmado' ? 'bg-secondary-fixed text-on-secondary-fixed' : mat.estado === 'Anulado' ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-on-primary-container'}`}>
                      {mat.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-on-surface-variant hover:text-primary hover:bg-primary/10 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
