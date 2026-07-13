'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Pauta {
  id: string;
  avaliacao_continua?: number;
  media_final?: number;
  estudantes?: { nome: string; bi: string; };
}

export default function PautasPage() {
  const supabase = createClient();
  const [pautas, setPautas] = useState<Pauta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('pautas').select('*, estudantes(nome, bi)');
      if (data) setPautas(data as Pauta[]);
      setLoading(false);
    };
    load();
  }, [supabase]);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="font-headline text-[36px] font-bold text-on-surface">Lançamento de Pautas</h2>
          <p className="font-body text-[16px] text-on-surface-variant mt-1">Insira e gerencie as notas dos alunos para a disciplina selecionada.</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-on-surface-variant bg-surface-container-lowest px-4 py-2 rounded-xl border border-outline-variant/40 shadow-sm">
          <span className="material-symbols-outlined text-[20px] text-primary">calendar_today</span>
          <select className="bg-transparent font-label text-[14px] font-bold tracking-wide focus:outline-none cursor-pointer text-on-surface">
            <option value="">Selecione o Ano Letivo</option>
            <option value="2023/2024">2023/2024</option>
            <option value="2024/2025">2024/2025</option>
            <option value="2025/2026">2025/2026</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-outline-variant/30 overflow-hidden flex flex-col relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="px-8 py-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest relative z-10">
          <h3 className="font-headline text-[22px] font-bold text-on-surface flex items-center gap-2">
             <span className="material-symbols-outlined text-primary">assignment</span>
             Pauta de Avaliação
          </h3>
          <button className="text-primary hover:bg-primary hover:text-white p-2.5 rounded-xl transition-all shadow-sm border border-primary/20 hover:border-transparent">
            <span className="material-symbols-outlined">download</span>
          </button>
        </div>
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-outline-variant/30">
                <th className="font-label text-[13px] font-bold text-on-surface-variant px-8 py-5 uppercase tracking-wider">Nº Matrícula</th>
                <th className="font-label text-[13px] font-bold text-on-surface-variant px-8 py-5 uppercase tracking-wider">Nome do Estudante</th>
                <th className="font-label text-[13px] font-bold text-on-surface-variant px-8 py-5 text-center uppercase tracking-wider">Av. Contínua</th>
                <th className="font-label text-[13px] font-bold text-on-surface-variant px-8 py-5 text-center uppercase tracking-wider">Média Final</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 bg-white">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-10 font-medium text-on-surface-variant">A carregar pautas...</td></tr>
              ) : pautas.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 font-medium text-on-surface-variant">Nenhum registo de notas encontrado para esta disciplina.</td></tr>
              ) : pautas.map((pauta) => (
                <tr key={pauta.id} className="hover:bg-surface-container-lowest hover:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 group">
                  <td className="px-8 py-5 font-mono text-[14px] text-on-surface-variant/80 font-medium">{pauta.estudantes?.bi || 'N/A'}</td>
                  <td className="px-8 py-5 font-body text-[16px] font-semibold text-on-surface flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label text-[14px] shadow-inner">
                      {pauta.estudantes?.nome ? pauta.estudantes.nome.substring(0, 2).toUpperCase() : 'U'}
                    </div>
                    {pauta.estudantes?.nome || 'Estudante desconhecido'}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <input type="number" defaultValue={pauta.avaliacao_continua || ''} placeholder="-" className="w-24 text-center bg-surface-container-lowest border border-outline-variant/40 focus:border-primary rounded-xl px-3 py-2 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-mono font-medium" />
                  </td>
                  <td className="px-8 py-5 text-center font-bold text-primary text-[18px]">
                    {pauta.media_final ? pauta.media_final.toFixed(1) : '-'}
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
