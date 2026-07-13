'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Curso { id: string; nome: string; }
interface Docente { id: string; nome: string; }
interface Disciplina {
  id: string;
  nome: string;
  cursos?: { nome: string };
  docentes?: { nome: string };
}

export default function DisciplinasPage() {
  const supabase = createClient();
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [nome, setNome] = useState('');
  const [cursoId, setCursoId] = useState('');
  const [docenteId, setDocenteId] = useState('');
  
  useEffect(() => {
    const load = async () => {
      const [resDisciplinas, resCursos, resDocentes] = await Promise.all([
        supabase.from('disciplinas').select('*, cursos(nome), docentes(nome)').order('nome', { ascending: true }),
        supabase.from('cursos').select('id, nome').order('nome', { ascending: true }),
        supabase.from('docentes').select('id, nome').order('nome', { ascending: true })
      ]);
      
      if (resDisciplinas.data) setDisciplinas(resDisciplinas.data as Disciplina[]);
      if (resCursos.data) setCursos(resCursos.data as Curso[]);
      if (resDocentes.data) setDocentes(resDocentes.data as Docente[]);
      setLoading(false);
    };
    load();
  }, [supabase]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cursoId || !docenteId) {
       alert('Selecione um curso e um docente!');
       return;
    }
    
    setLoading(true);
    const { error } = await supabase.from('disciplinas').insert([
      { 
        nome, 
        curso_id: cursoId, 
        docente_id: docenteId
      }
    ]);
    
    if (!error) {
      alert('Disciplina adicionada com sucesso!');
      setNome(''); setCursoId(''); setDocenteId('');
      const [resDisciplinas, resCursos, resDocentes] = await Promise.all([
        supabase.from('disciplinas').select('*, cursos(nome), docentes(nome)').order('nome', { ascending: true }),
        supabase.from('cursos').select('id, nome').order('nome', { ascending: true }),
        supabase.from('docentes').select('id, nome').order('nome', { ascending: true })
      ]);
      if (resDisciplinas.data) setDisciplinas(resDisciplinas.data as Disciplina[]);
      if (resCursos.data) setCursos(resCursos.data as Curso[]);
      if (resDocentes.data) setDocentes(resDocentes.data as Docente[]);
      setLoading(false);
    } else {
      console.error(error);
      alert('Erro ao adicionar disciplina: ' + error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="font-headline text-[36px] font-bold text-on-surface">Gestão de Disciplinas</h2>
          <p className="font-body text-[16px] text-on-surface-variant mt-1">Crie as cadeiras e faça a alocação de turmas aos professores.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-[22px]">search</span>
            <input className="w-full bg-white border border-outline-variant/40 rounded-2xl py-3 pl-12 pr-4 font-body text-[14px] text-on-surface focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 shadow-sm transition-all placeholder:text-on-surface-variant/50" placeholder="Pesquisar disciplina..." type="text" />
          </div>
          <button className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-container text-white hover:shadow-lg hover:shadow-primary/30 font-label text-[15px] font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Nova Disciplina
          </button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="bg-white p-8 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-outline-variant/30 flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <h3 className="font-headline text-[20px] font-semibold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">auto_stories</span>
          Criar e Alocar
        </h3>
        <div className="flex gap-4 flex-wrap items-end relative z-10">
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <label className="font-label text-[13px] font-semibold text-on-surface-variant">Nome da Disciplina</label>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Álgebra Linear" className="w-full border border-outline-variant/40 focus:border-primary px-4 py-2.5 rounded-xl bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none" required />
          </div>
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <label className="font-label text-[13px] font-semibold text-on-surface-variant">Curso de Pertinência</label>
            <select value={cursoId} onChange={e => setCursoId(e.target.value)} className="w-full border border-outline-variant/40 focus:border-primary px-4 py-2.5 rounded-xl bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none" required>
              <option value="">Selecione um curso...</option>
              {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <label className="font-label text-[13px] font-semibold text-on-surface-variant">Docente Alocado</label>
            <select value={docenteId} onChange={e => setDocenteId(e.target.value)} className="w-full border border-outline-variant/40 focus:border-primary px-4 py-2.5 rounded-xl bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none" required>
              <option value="">Selecione um docente...</option>
              {docentes.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
            </select>
          </div>
          <button type="submit" className="bg-surface-container-high text-on-surface hover:bg-primary hover:text-white px-6 py-2.5 rounded-xl font-label text-[15px] font-semibold transition-all shadow-sm hover:shadow-md h-[46px]">Gravar</button>
        </div>
      </form>

      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-outline-variant/30">
                <th className="py-4 px-6 font-label text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Nome da Disciplina</th>
                <th className="py-4 px-6 font-label text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Curso Associado</th>
                <th className="py-4 px-6 font-label text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Docente Responsável</th>
                <th className="py-4 px-6 font-label text-[13px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="font-body text-[15px] text-on-surface divide-y divide-outline-variant/20">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-10 font-medium text-on-surface-variant">A carregar registos...</td></tr>
              ) : disciplinas.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 font-medium text-on-surface-variant">Nenhuma disciplina registada na base de dados.</td></tr>
              ) : disciplinas.map((disciplina) => (
                <tr key={disciplina.id} className="hover:bg-surface-container-lowest hover:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 group cursor-pointer">
                  <td className="py-4 px-6 font-medium text-on-surface flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-label text-[14px] font-bold shrink-0">
                        <span className="material-symbols-outlined text-[20px]">auto_stories</span>
                     </div>
                     {disciplina.nome}
                  </td>
                  <td className="py-4 px-6 text-on-surface-variant/80 font-medium">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label text-[12px] font-semibold">
                      {disciplina.cursos?.nome || 'Não definido'}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-on-surface flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label text-[11px] font-bold shrink-0 shadow-inner">
                        {disciplina.docentes?.nome ? disciplina.docentes.nome.substring(0, 2).toUpperCase() : 'D'}
                     </div>
                     {disciplina.docentes?.nome || 'Não alocado'}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <button className="p-2 text-on-surface-variant hover:text-primary rounded-lg hover:bg-primary/10 transition-colors tooltip" title="Editar">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button className="p-2 text-on-surface-variant hover:text-error rounded-lg hover:bg-error/10 transition-colors tooltip" title="Remover">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
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
