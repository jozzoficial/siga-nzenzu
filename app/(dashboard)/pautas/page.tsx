export default function PautasPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm">
        <div>
          <h2 className="font-headline text-[28px] font-bold text-on-surface">Lançamento de Pautas</h2>
          <p className="font-body text-[14px] text-on-surface-variant mt-1">Insira e gerencie as notas dos alunos para a disciplina selecionada.</p>
        </div>
        <div className="flex items-center gap-xs text-sm text-on-surface-variant bg-surface-container-low px-sm py-xs rounded-full border border-outline-variant">
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          <span className="font-label text-[12px] font-medium">Semestre I - 2023/2024</span>
        </div>
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-outline-variant overflow-hidden flex flex-col">
        <div className="p-sm border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
          <h3 className="font-headline text-[20px] font-semibold text-on-surface">Pauta de Avaliação</h3>
          <button className="text-primary hover:bg-surface-container-low p-1.5 rounded transition-colors">
            <span className="material-symbols-outlined">download</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="font-label text-[14px] font-semibold text-on-surface-variant px-md py-sm">Nº Matrícula</th>
                <th className="font-label text-[14px] font-semibold text-on-surface-variant px-md py-sm">Nome do Estudante</th>
                <th className="font-label text-[14px] font-semibold text-on-surface-variant px-md py-sm text-center">Av. Contínua</th>
                <th className="font-label text-[14px] font-semibold text-on-surface-variant px-md py-sm text-center">Média Final</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant bg-surface">
              <tr className="hover:bg-secondary-fixed/30 transition-colors">
                <td className="px-md py-3 font-body text-[14px] text-on-surface">20210045</td>
                <td className="px-md py-3 font-body text-[16px] font-medium text-on-surface">Ana Júlia Santos</td>
                <td className="px-md py-3 text-center">
                  <input type="number" defaultValue="14.5" className="w-20 text-center bg-surface border border-outline-variant rounded px-2 py-1" />
                </td>
                <td className="px-md py-3 text-center font-bold text-primary">13.0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
