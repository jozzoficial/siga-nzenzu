'use client';
import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Disciplina {
  id: string;
  nome: string;
  curso_id: string;
  cursos?: { nome: string };
}

interface EstudanteNota {
  matricula_id: string;
  estudante_nome: string;
  estudante_bi: string;
  pauta_id?: string;
  p1: string;
  p2: string;
  exame: string;
  recurso: string;
}

export default function PautasPage() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Filters
  const [anoLetivo, setAnoLetivo] = useState('2023/2024');
  const [disciplinaId, setDisciplinaId] = useState('');

  // Data
  const [notas, setNotas] = useState<EstudanteNota[]>([]);

  // Fetch initial disciplinas
  useEffect(() => {
    const supabase = createClient();
    const loadDisciplinas = async () => {
      const { data } = await supabase.from('disciplinas').select('*, cursos(nome)').order('nome', { ascending: true });
      if (data) setDisciplinas(data as Disciplina[]);
      setLoading(false);
    };
    loadDisciplinas();
  }, []);

  // Fetch table data when filters change
  const loadPautas = useCallback(async () => {
    if (!disciplinaId || !anoLetivo) {
      setNotas([]);
      return;
    }
    
    const supabase = createClient();
    setLoading(true);
    const disciplina = disciplinas.find(d => d.id === disciplinaId);
    if (!disciplina) return;

    // 1. Fetch confirmadas matriculas para este curso e ano
    const { data: mats } = await supabase
      .from('matriculas')
      .select('id, estudantes(nome, bi)')
      .eq('ano_letivo', anoLetivo)
      .eq('curso_id', disciplina.curso_id)
      .eq('estado', 'Confirmado');

    // 2. Fetch existing pautas for this disciplina
    const { data: pautasDb } = await supabase
      .from('pautas')
      .select('*')
      .eq('disciplina_id', disciplinaId);

    if (mats) {
      type MatElement = { id: string; estudantes: { nome: string; bi: string }[] | { nome: string; bi: string } | null };
      const mapped: EstudanteNota[] = (mats as unknown as MatElement[]).map((mat) => {
        const p = pautasDb?.find(p => p.matricula_id === mat.id);
        const est = Array.isArray(mat.estudantes) ? mat.estudantes[0] : mat.estudantes;
        return {
          matricula_id: mat.id,
          estudante_nome: est?.nome || 'Desconhecido',
          estudante_bi: est?.bi || 'N/A',
          pauta_id: p?.id,
          p1: p?.p1?.toString() || '',
          p2: p?.p2?.toString() || '',
          exame: p?.exame?.toString() || '',
          recurso: p?.recurso?.toString() || ''
        };
      });
      // Sort alphabetically by name
      mapped.sort((a, b) => a.estudante_nome.localeCompare(b.estudante_nome));
      setNotas(mapped);
    }
    setLoading(false);
  }, [disciplinaId, anoLetivo, disciplinas]);

  useEffect(() => {
    const timer = setTimeout(() => loadPautas(), 0);
    return () => clearTimeout(timer);
  }, [loadPautas]);

  const handleInputChange = (matriculaId: string, field: keyof EstudanteNota, value: string) => {
    setNotas(prev => prev.map(n => n.matricula_id === matriculaId ? { ...n, [field]: value } : n));
  };

  const handleSaveAll = async () => {
    const supabase = createClient();
    setSaving(true);
    let errorCount = 0;

    for (const n of notas) {
      // Somente grava se houver alguma nota preenchida
      if (!n.p1 && !n.p2 && !n.exame && !n.recurso && !n.pauta_id) continue;

      const payload = {
        matricula_id: n.matricula_id,
        disciplina_id: disciplinaId,
        p1: n.p1 ? parseFloat(n.p1) : null,
        p2: n.p2 ? parseFloat(n.p2) : null,
        exame: n.exame ? parseFloat(n.exame) : null,
        recurso: n.recurso ? parseFloat(n.recurso) : null,
      };

      if (n.pauta_id) {
        const { error } = await supabase.from('pautas').update(payload).eq('id', n.pauta_id);
        if (error) errorCount++;
      } else {
        const { error } = await supabase.from('pautas').insert([payload]);
        if (error) errorCount++;
      }
    }

    if (errorCount === 0) {
      alert('Pauta guardada com sucesso!');
      loadPautas(); // Recarrega para obter os pauta_ids gerados
    } else {
      alert(`Houve ${errorCount} erro(s) ao guardar as notas.`);
    }
    setSaving(false);
  };

  const exportToPDF = () => {
    if (notas.length === 0) return;
    
    // We dynamically import to avoid SSR issues if any, but since it's a client component, standard import is fine.
    // However, requiring here is safer if it's not fully loaded yet
    import('jspdf').then(jsPDFModule => {
      import('jspdf-autotable').then(autoTableModule => {
        const jsPDF = jsPDFModule.default;
        const autoTable = autoTableModule.default;
        
        const doc = new jsPDF('landscape');
        
        const disciplinaNome = disciplinas.find(d => d.id === disciplinaId)?.nome || 'Disciplina';
        
        doc.setFontSize(18);
        doc.text(`Pauta de Avaliação - ${disciplinaNome}`, 14, 22);
        doc.setFontSize(11);
        doc.text(`Ano Letivo: ${anoLetivo}`, 14, 30);
        doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-PT')}`, 14, 36);

        const headers = [['Nº Matrícula/BI', 'Estudante', 'P1', 'P2', 'Média', 'Exame', 'Recurso', 'Final', 'Estado']];
        const data = notas.map(n => {
          const stats = calcStats(n);
          return [
            n.estudante_bi,
            n.estudante_nome,
            n.p1 || '-',
            n.p2 || '-',
            stats.m !== null ? stats.m.toFixed(1) : '-',
            n.exame || '-',
            n.recurso || '-',
            stats.final !== null ? stats.final.toFixed(1) : '-',
            stats.status
          ];
        });

        autoTable(doc, {
          startY: 45,
          head: headers,
          body: data,
          theme: 'grid',
          headStyles: { fillColor: [52, 168, 83] }, // primary color roughly
          alternateRowStyles: { fillColor: [248, 250, 248] },
          styles: { font: 'helvetica', fontSize: 10, cellPadding: 3 },
          columnStyles: {
            2: { halign: 'center' },
            3: { halign: 'center' },
            4: { halign: 'center', fontStyle: 'bold' },
            5: { halign: 'center' },
            6: { halign: 'center' },
            7: { halign: 'center', fontStyle: 'bold', textColor: [52, 168, 83] },
            8: { halign: 'center', fontStyle: 'bold' },
          }
        });

        doc.save(`Pauta_${disciplinaNome.replace(/\s+/g, '_')}_${anoLetivo.replace('/', '-')}.pdf`);
      });
    });
  };

  const calcStats = (n: EstudanteNota) => {
    let m = null;
    let final = null;
    let status = 'Pendente';

    if (n.p1 && n.p2) {
      m = (parseFloat(n.p1) + parseFloat(n.p2)) / 2;
      
      if (m >= 13.5) {
        final = m;
        status = 'Dispensado';
      } else {
        if (n.recurso) {
          final = (m * 0.4) + (parseFloat(n.recurso) * 0.6);
        } else if (n.exame) {
          final = (m * 0.4) + (parseFloat(n.exame) * 0.6);
        }
        
        if (final !== null) {
          if (final >= 9.5) status = 'Aprovado';
          else if (n.recurso) status = 'Reprovado';
          else status = 'Recurso';
        } else {
          status = 'Aguardando Exame';
        }
      }
    }
    return { m, final, status };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Dispensado': return 'bg-primary-container/40 text-on-primary-container border-primary/30';
      case 'Aprovado': return 'bg-secondary-container/40 text-on-secondary-container border-secondary/30';
      case 'Recurso': return 'bg-tertiary-container/40 text-on-tertiary-container border-tertiary/30';
      case 'Reprovado': return 'bg-error-container/20 text-error border-error/30';
      default: return 'bg-surface-container-high text-on-surface-variant';
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="font-headline text-[36px] font-bold text-on-surface">Pautas de Avaliação</h2>
          <p className="font-body text-[16px] text-on-surface-variant mt-1">Lançamento de notas, dispensas e exames do ano letivo.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-3 text-sm text-on-surface-variant bg-surface-container-lowest px-4 py-3 rounded-xl border border-outline-variant/40 shadow-sm w-full sm:w-auto">
            <span className="material-symbols-outlined text-[20px] text-primary">auto_stories</span>
            <select value={disciplinaId} onChange={e => setDisciplinaId(e.target.value)} className="bg-transparent font-label text-[14px] font-bold tracking-wide focus:outline-none cursor-pointer text-on-surface w-full">
              <option value="">Selecione a Disciplina...</option>
              {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome} ({d.cursos?.nome})</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3 text-sm text-on-surface-variant bg-surface-container-lowest px-4 py-3 rounded-xl border border-outline-variant/40 shadow-sm w-full sm:w-auto">
            <span className="material-symbols-outlined text-[20px] text-primary">calendar_today</span>
            <select value={anoLetivo} onChange={e => setAnoLetivo(e.target.value)} className="bg-transparent font-label text-[14px] font-bold tracking-wide focus:outline-none cursor-pointer text-on-surface w-full">
              <option value="2023/2024">2023/2024</option>
              <option value="2024/2025">2024/2025</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-outline-variant/30 overflow-hidden flex flex-col relative">
        <div className="px-8 py-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest relative z-10">
          <h3 className="font-headline text-[20px] font-semibold text-on-surface flex items-center gap-2">
             <span className="material-symbols-outlined text-primary">assignment</span>
             Grelha de Notas
          </h3>
          <div className="flex items-center gap-3">
            <button onClick={exportToPDF} className="text-on-surface-variant hover:bg-surface-container-high hover:text-primary px-4 py-2.5 rounded-xl transition-all shadow-sm border border-outline-variant/40 hover:border-primary/20 font-label text-[14px] font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              Exportar para PDF
            </button>
            <button onClick={handleSaveAll} disabled={saving || notas.length === 0} className="bg-primary text-white hover:bg-primary/90 px-6 py-2.5 rounded-xl transition-all shadow-sm font-label text-[14px] font-bold flex items-center gap-2 disabled:opacity-50">
              <span className="material-symbols-outlined text-[18px]">save</span>
              {saving ? 'A Guardar...' : 'Guardar Alterações'}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-outline-variant/30">
                <th className="font-label text-[13px] font-bold text-on-surface-variant px-6 py-4 uppercase tracking-wider">Estudante</th>
                <th className="font-label text-[13px] font-bold text-on-surface-variant px-4 py-4 text-center uppercase tracking-wider">P1</th>
                <th className="font-label text-[13px] font-bold text-on-surface-variant px-4 py-4 text-center uppercase tracking-wider">P2</th>
                <th className="font-label text-[13px] font-bold text-on-surface-variant px-4 py-4 text-center uppercase tracking-wider bg-surface-container-lowest/50 border-x border-outline-variant/20">Média (M)</th>
                <th className="font-label text-[13px] font-bold text-on-surface-variant px-4 py-4 text-center uppercase tracking-wider">Exame</th>
                <th className="font-label text-[13px] font-bold text-on-surface-variant px-4 py-4 text-center uppercase tracking-wider">Recurso</th>
                <th className="font-label text-[13px] font-bold text-on-surface-variant px-4 py-4 text-center uppercase tracking-wider bg-surface-container-lowest/50 border-x border-outline-variant/20">Nota Final</th>
                <th className="font-label text-[13px] font-bold text-on-surface-variant px-6 py-4 text-center uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 bg-white font-body text-[14px]">
              {loading ? (
                <tr><td colSpan={8} className="text-center py-10 font-medium text-on-surface-variant">A carregar matrículas...</td></tr>
              ) : !disciplinaId ? (
                <tr><td colSpan={8} className="text-center py-10 font-medium text-on-surface-variant">Selecione uma disciplina no filtro acima.</td></tr>
              ) : notas.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 font-medium text-on-surface-variant">Nenhum aluno com matrícula confirmada para esta disciplina.</td></tr>
              ) : notas.map((n) => {
                const stats = calcStats(n);
                const isDispensado = stats.status === 'Dispensado';
                return (
                  <tr key={n.matricula_id} className={`hover:bg-surface-container-lowest transition-all duration-300 group ${isDispensado ? 'bg-primary/5' : ''}`}>
                    <td className="px-6 py-4 font-semibold text-on-surface flex flex-col">
                      <span>{n.estudante_nome}</span>
                      <span className="font-mono text-[11px] text-on-surface-variant/70">{n.estudante_bi}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input type="number" min="0" max="20" step="0.1" value={n.p1} onChange={e => handleInputChange(n.matricula_id, 'p1', e.target.value)} className="w-16 text-center bg-surface-container-lowest border border-outline-variant/40 focus:border-primary rounded-lg px-2 py-1.5 focus:outline-none transition-all font-mono font-medium" />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input type="number" min="0" max="20" step="0.1" value={n.p2} onChange={e => handleInputChange(n.matricula_id, 'p2', e.target.value)} className="w-16 text-center bg-surface-container-lowest border border-outline-variant/40 focus:border-primary rounded-lg px-2 py-1.5 focus:outline-none transition-all font-mono font-medium" />
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-on-surface-variant bg-surface-container-lowest/30 border-x border-outline-variant/10">
                      {stats.m !== null ? stats.m.toFixed(1) : '-'}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input type="number" min="0" max="20" step="0.1" disabled={isDispensado} value={n.exame} onChange={e => handleInputChange(n.matricula_id, 'exame', e.target.value)} className="w-16 text-center bg-surface-container-lowest border border-outline-variant/40 focus:border-primary rounded-lg px-2 py-1.5 focus:outline-none transition-all font-mono font-medium disabled:opacity-30 disabled:bg-surface-container" />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input type="number" min="0" max="20" step="0.1" disabled={isDispensado || stats.status === 'Aprovado'} value={n.recurso} onChange={e => handleInputChange(n.matricula_id, 'recurso', e.target.value)} className="w-16 text-center bg-surface-container-lowest border border-outline-variant/40 focus:border-primary rounded-lg px-2 py-1.5 focus:outline-none transition-all font-mono font-medium disabled:opacity-30 disabled:bg-surface-container" />
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-[16px] text-primary bg-surface-container-lowest/30 border-x border-outline-variant/10">
                      {stats.final !== null ? stats.final.toFixed(1) : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full border font-label text-[11px] font-bold ${getStatusColor(stats.status)}`}>
                        {stats.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
