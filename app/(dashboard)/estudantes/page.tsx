'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Curso {
  id: string;
  nome: string;
}

interface Estudante {
  id: string;
  nome: string;
  bi: string;
  email: string;
  telefone?: string;
  ano_ingresso: number;
  cursos?: { nome: string };
}

export default function EstudantesPage() {
  const supabase = createClient();
  const [estudantes, setEstudantes] = useState<Estudante[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State matching schema
  const [nome, setNome] = useState('');
  const [bi, setBi] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cursoId, setCursoId] = useState('');
  const [ano, setAno] = useState('');
  
  useEffect(() => {
    const load = async () => {
      const [resEstudantes, resCursos] = await Promise.all([
        supabase.from('estudantes').select('*, cursos(nome)'),
        supabase.from('cursos').select('*')
      ]);
      if (resEstudantes.data) setEstudantes(resEstudantes.data as Estudante[]);
      if (resCursos.data) setCursos(resCursos.data as Curso[]);
      setLoading(false);
    };
    load();
  }, [supabase]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cursoId) {
       alert('Selecione um curso!');
       return;
    }
    setLoading(true);
    const { error } = await supabase.from('estudantes').insert([
      { 
        nome, 
        bi, 
        data_nascimento: dataNascimento,
        email,
        telefone,
        curso_id: cursoId, 
        ano_ingresso: parseInt(ano) 
      }
    ]);
    if (!error) {
      alert('Estudante adicionado com sucesso!');
      setNome(''); setBi(''); setDataNascimento(''); setEmail(''); setTelefone(''); setCursoId(''); setAno('');
      const [resEstudantes, resCursos] = await Promise.all([
        supabase.from('estudantes').select('*, cursos(nome)'),
        supabase.from('cursos').select('*')
      ]);
      if (resEstudantes.data) setEstudantes(resEstudantes.data as Estudante[]);
      if (resCursos.data) setCursos(resCursos.data as Curso[]);
      setLoading(false);
    } else {
      console.error(error);
      alert('Erro ao adicionar estudante: ' + error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="font-headline text-[36px] font-bold text-on-surface">Gestão de Estudantes</h2>
          <p className="font-body text-[16px] text-on-surface-variant mt-1">Gerencie os registros, matrículas e informações acadêmicas.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-[22px]">search</span>
            <input className="w-full bg-white border border-outline-variant/40 rounded-2xl py-3 pl-12 pr-4 font-body text-[14px] text-on-surface focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 shadow-sm transition-all placeholder:text-on-surface-variant/50" placeholder="Pesquisar por nome ou BI..." type="text" />
          </div>
          <button className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-container text-white hover:shadow-lg hover:shadow-primary/30 font-label text-[15px] font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Novo Registo
          </button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="bg-white p-8 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-outline-variant/30 flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <h3 className="font-headline text-[20px] font-semibold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">person_add</span>
          Adição Rápida
        </h3>
        <div className="flex gap-4 flex-wrap items-end relative z-10">
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <label className="font-label text-[13px] font-semibold text-on-surface-variant">Nome Completo</label>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Maria João" className="w-full border border-outline-variant/40 focus:border-primary px-4 py-2.5 rounded-xl bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none" required />
          </div>
          <div className="flex-1 min-w-[150px] space-y-1.5">
            <label className="font-label text-[13px] font-semibold text-on-surface-variant">BI</label>
            <input value={bi} onChange={e => setBi(e.target.value)} placeholder="000000000XX000" className="w-full border border-outline-variant/40 focus:border-primary px-4 py-2.5 rounded-xl bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none" required />
          </div>
          <div className="flex-1 min-w-[150px] space-y-1.5">
            <label className="font-label text-[13px] font-semibold text-on-surface-variant">Data Nascimento</label>
            <input type="date" value={dataNascimento} onChange={e => setDataNascimento(e.target.value)} className="w-full border border-outline-variant/40 focus:border-primary px-4 py-2.5 rounded-xl bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none" required />
          </div>
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <label className="font-label text-[13px] font-semibold text-on-surface-variant">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@ispne.ao" className="w-full border border-outline-variant/40 focus:border-primary px-4 py-2.5 rounded-xl bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none" required />
          </div>
          <div className="flex-1 min-w-[150px] space-y-1.5">
            <label className="font-label text-[13px] font-semibold text-on-surface-variant">Telefone</label>
            <input value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="900000000" className="w-full border border-outline-variant/40 focus:border-primary px-4 py-2.5 rounded-xl bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none" />
          </div>
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <label className="font-label text-[13px] font-semibold text-on-surface-variant">Curso</label>
            <select value={cursoId} onChange={e => setCursoId(e.target.value)} className="w-full border border-outline-variant/40 focus:border-primary px-4 py-2.5 rounded-xl bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none" required>
              <option value="">Selecione...</option>
              {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div className="w-[100px] space-y-1.5">
            <label className="font-label text-[13px] font-semibold text-on-surface-variant">Ano</label>
            <input value={ano} onChange={e => setAno(e.target.value)} placeholder="2023" className="w-full border border-outline-variant/40 focus:border-primary px-4 py-2.5 rounded-xl bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none" type="number" required />
          </div>
          <button type="submit" className="bg-surface-container-high text-on-surface hover:bg-primary hover:text-white px-6 py-2.5 rounded-xl font-label text-[15px] font-semibold transition-all shadow-sm hover:shadow-md h-[46px]">Gravar</button>
        </div>
      </form>

      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-outline-variant/30">
                <th className="py-4 px-6 font-label text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">ID</th>
                <th className="py-4 px-6 font-label text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Nome Completo</th>
                <th className="py-4 px-6 font-label text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">BI</th>
                <th className="py-4 px-6 font-label text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Curso</th>
                <th className="py-4 px-6 font-label text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Ano Ingresso</th>
                <th className="py-4 px-6 font-label text-[13px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="font-body text-[15px] text-on-surface divide-y divide-outline-variant/20">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 font-medium text-on-surface-variant">A carregar registos...</td></tr>
              ) : estudantes.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 font-medium text-on-surface-variant">Nenhum estudante registado na base de dados.</td></tr>
              ) : estudantes.map((est) => (
                <tr key={est.id} className="hover:bg-surface-container-lowest hover:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 group cursor-pointer">
                  <td className="py-4 px-6 font-label text-[13px] font-semibold text-primary/70">#{String(est.id).padStart(4, '0')}</td>
                  <td className="py-4 px-6 font-medium text-on-surface flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-label text-[12px] font-bold shrink-0">
                        {est.nome ? est.nome.substring(0, 2).toUpperCase() : 'U'}
                     </div>
                     <div className="flex flex-col">
                        <span>{est.nome}</span>
                        <span className="font-body text-[12px] text-on-surface-variant/70">{est.email}</span>
                     </div>
                  </td>
                  <td className="py-4 px-6 text-on-surface-variant/80 font-mono text-[14px]">{est.bi}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container/30 text-on-secondary-container font-label text-[13px] font-semibold border border-secondary-container/20">
                      {est.cursos?.nome || 'Não definido'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-on-surface-variant font-medium">{est.ano_ingresso}</td>
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
