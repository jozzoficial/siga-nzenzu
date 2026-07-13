'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Estudante { id: string; nome: string; bi: string; }
interface Curso { id: string; nome: string; }
interface Matricula {
  id: string;
  estudante_id: string;
  curso_id: string;
  ano_letivo: string;
  estado: string;
  data_matricula: string;
  estudantes?: { nome: string; bi: string; };
  cursos?: { nome: string; };
}

export default function MatriculasPage() {
  const supabase = createClient();
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [estudantes, setEstudantes] = useState<Estudante[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [estudanteId, setEstudanteId] = useState('');
  const [cursoId, setCursoId] = useState('');
  const [anoLetivo, setAnoLetivo] = useState('');
  const [estado, setEstado] = useState('Pendente');

  useEffect(() => {
    const load = async () => {
      const [resMatriculas, resEstudantes, resCursos] = await Promise.all([
        supabase.from('matriculas').select('*, estudantes(nome, bi), cursos(nome)').order('data_matricula', { ascending: false }),
        supabase.from('estudantes').select('id, nome, bi').order('nome', { ascending: true }),
        supabase.from('cursos').select('id, nome').order('nome', { ascending: true })
      ]);
      
      if (resMatriculas.data) setMatriculas(resMatriculas.data as Matricula[]);
      if (resEstudantes.data) setEstudantes(resEstudantes.data as Estudante[]);
      if (resCursos.data) setCursos(resCursos.data as Curso[]);
      setLoading(false);
    };
    load();
  }, [supabase]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!estudanteId || !cursoId || !anoLetivo) {
       alert('Preencha todos os campos obrigatórios!');
       return;
    }
    
    setLoading(true);
    const { error } = await supabase.from('matriculas').insert([
      { 
        estudante_id: estudanteId, 
        curso_id: cursoId, 
        ano_letivo: anoLetivo,
        estado: estado
      }
    ]);
    
    if (!error) {
      alert('Matrícula efetuada com sucesso!');
      setEstudanteId(''); setCursoId(''); setAnoLetivo(''); setEstado('Pendente');
      const { data } = await supabase.from('matriculas').select('*, estudantes(nome, bi), cursos(nome)').order('data_matricula', { ascending: false });
      if (data) setMatriculas(data as Matricula[]);
      setLoading(false);
    } else {
      console.error(error);
      alert('Erro ao efetuar matrícula: ' + error.message);
      setLoading(false);
    }
  };

  const getStatusStyle = (estadoStatus: string) => {
    switch (estadoStatus) {
      case 'Confirmado': return 'bg-primary-container/30 text-on-primary-container border-primary/20';
      case 'Pendente': return 'bg-tertiary-container/30 text-on-tertiary-container border-tertiary/20';
      case 'Anulado': return 'bg-error-container/30 text-error border-error/20';
      default: return 'bg-surface-container-high text-on-surface-variant';
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="font-headline text-[36px] font-bold text-on-surface">Matrículas</h2>
          <p className="font-body text-[16px] text-on-surface-variant mt-1">Inscreva os alunos em cursos para um determinado ano letivo.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-[22px]">search</span>
            <input className="w-full bg-white border border-outline-variant/40 rounded-2xl py-3 pl-12 pr-4 font-body text-[14px] text-on-surface focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 shadow-sm transition-all placeholder:text-on-surface-variant/50" placeholder="Pesquisar matrícula..." type="text" />
          </div>
          <button className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-container text-white hover:shadow-lg hover:shadow-primary/30 font-label text-[15px] font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0">
            <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
            Nova Matrícula
          </button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="bg-white p-8 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-outline-variant/30 flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <h3 className="font-headline text-[20px] font-semibold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">app_registration</span>
          Efetuar Matrícula
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 items-end">
          <div className="space-y-1.5">
            <label className="font-label text-[13px] font-semibold text-on-surface-variant">Estudante</label>
            <select value={estudanteId} onChange={e => setEstudanteId(e.target.value)} className="w-full border border-outline-variant/40 focus:border-primary px-4 py-2.5 rounded-xl bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none" required>
              <option value="">Selecione um estudante...</option>
              {estudantes.map(e => <option key={e.id} value={e.id}>{e.nome} - {e.bi}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="font-label text-[13px] font-semibold text-on-surface-variant">Curso</label>
            <select value={cursoId} onChange={e => setCursoId(e.target.value)} className="w-full border border-outline-variant/40 focus:border-primary px-4 py-2.5 rounded-xl bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none" required>
              <option value="">Selecione um curso...</option>
              {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="font-label text-[13px] font-semibold text-on-surface-variant">Ano Letivo</label>
            <input value={anoLetivo} onChange={e => setAnoLetivo(e.target.value)} placeholder="Ex: 2023/2024" className="w-full border border-outline-variant/40 focus:border-primary px-4 py-2.5 rounded-xl bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none" required />
          </div>
          <div className="space-y-1.5">
            <label className="font-label text-[13px] font-semibold text-on-surface-variant">Estado Inicial</label>
            <select value={estado} onChange={e => setEstado(e.target.value)} className="w-full border border-outline-variant/40 focus:border-primary px-4 py-2.5 rounded-xl bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none" required>
              <option value="Pendente">Pendente</option>
              <option value="Confirmado">Confirmado</option>
              <option value="Anulado">Anulado</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end relative z-10 mt-2">
          <button type="submit" disabled={loading} className="bg-surface-container-high text-on-surface hover:bg-primary hover:text-white px-8 py-2.5 rounded-xl font-label text-[15px] font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50 h-[46px]">
            {loading ? 'A processar...' : 'Inscrever Estudante'}
          </button>
        </div>
      </form>

      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-outline-variant/30">
                <th className="py-4 px-6 font-label text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Estudante</th>
                <th className="py-4 px-6 font-label text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Curso</th>
                <th className="py-4 px-6 font-label text-[13px] font-bold text-on-surface-variant uppercase tracking-wider text-center">Ano Letivo</th>
                <th className="py-4 px-6 font-label text-[13px] font-bold text-on-surface-variant uppercase tracking-wider text-center">Estado</th>
                <th className="py-4 px-6 font-label text-[13px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Data</th>
              </tr>
            </thead>
            <tbody className="font-body text-[15px] text-on-surface divide-y divide-outline-variant/20">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-10 font-medium text-on-surface-variant">A carregar registos...</td></tr>
              ) : matriculas.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 font-medium text-on-surface-variant">Nenhuma matrícula registada no sistema.</td></tr>
              ) : matriculas.map((mat) => (
                <tr key={mat.id} className="hover:bg-surface-container-lowest hover:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 group cursor-pointer">
                  <td className="py-4 px-6 font-medium text-on-surface flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-label text-[14px] font-bold shrink-0">
                        {mat.estudantes?.nome ? mat.estudantes.nome.substring(0, 2).toUpperCase() : 'ES'}
                     </div>
                     <div className="flex flex-col">
                       <span>{mat.estudantes?.nome || 'Desconhecido'}</span>
                       <span className="text-[12px] text-on-surface-variant/70">{mat.estudantes?.bi}</span>
                     </div>
                  </td>
                  <td className="py-4 px-6 text-on-surface-variant/80 font-medium">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label text-[12px] font-semibold">
                      {mat.cursos?.nome || 'Não definido'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center font-semibold text-on-surface-variant">
                     {mat.ano_letivo}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full border font-label text-[12px] font-bold ${getStatusStyle(mat.estado)}`}>
                      {mat.estado}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right text-sm text-on-surface-variant">
                    {new Date(mat.data_matricula).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })}
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
