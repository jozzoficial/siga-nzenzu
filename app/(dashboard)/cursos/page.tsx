'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Curso {
  id: string;
  nome: string;
  departamento: string;
  duracao_anos: number;
}

export default function CursosPage() {
  const supabase = createClient();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  // Campos do formulário de acordo com schema.sql
  const [nome, setNome] = useState('');
  const [duracaoAnos, setDuracaoAnos] = useState('');
  const [departamento, setDepartamento] = useState('');
  
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('cursos').select('*').order('nome', { ascending: true });
      if (data) setCursos(data as Curso[]);
      setLoading(false);
    };
    load();
  }, [supabase]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('cursos').insert([
      { 
        nome, 
        duracao_anos: parseInt(duracaoAnos), 
        departamento 
      }
    ]);
    
    if (!error) {
      alert('Curso adicionado com sucesso!');
      setNome(''); setDuracaoAnos(''); setDepartamento('');
      const { data } = await supabase.from('cursos').select('*').order('nome', { ascending: true });
      if (data) setCursos(data as Curso[]);
      setLoading(false);
    } else {
      console.error(error);
      alert('Erro ao adicionar curso: ' + error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="font-headline text-[36px] font-bold text-on-surface">Gestão de Cursos</h2>
          <p className="font-body text-[16px] text-on-surface-variant mt-1">Crie e administre os cursos lecionados na instituição.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-[22px]">search</span>
            <input className="w-full bg-white border border-outline-variant/40 rounded-2xl py-3 pl-12 pr-4 font-body text-[14px] text-on-surface focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 shadow-sm transition-all placeholder:text-on-surface-variant/50" placeholder="Pesquisar curso..." type="text" />
          </div>
          <button className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-container text-white hover:shadow-lg hover:shadow-primary/30 font-label text-[15px] font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Novo Curso
          </button>
        </div>
      </div>

      {/* Formulário Flutuante */}
      <form onSubmit={onSubmit} className="bg-white p-8 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-outline-variant/30 flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <h3 className="font-headline text-[20px] font-semibold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">menu_book</span>
          Adicionar Curso
        </h3>
        <div className="flex gap-4 flex-wrap items-end relative z-10">
          <div className="flex-1 min-w-[250px] space-y-1.5">
            <label className="font-label text-[13px] font-semibold text-on-surface-variant">Nome do Curso</label>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Engenharia Informática" className="w-full border border-outline-variant/40 focus:border-primary px-4 py-2.5 rounded-xl bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none" required />
          </div>
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <label className="font-label text-[13px] font-semibold text-on-surface-variant">Departamento</label>
            <input value={departamento} onChange={e => setDepartamento(e.target.value)} placeholder="Ex: Ciências Exatas" className="w-full border border-outline-variant/40 focus:border-primary px-4 py-2.5 rounded-xl bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none" required />
          </div>
          <div className="w-[150px] space-y-1.5">
            <label className="font-label text-[13px] font-semibold text-on-surface-variant">Duração (Anos)</label>
            <input value={duracaoAnos} onChange={e => setDuracaoAnos(e.target.value)} placeholder="4" min="1" max="6" className="w-full border border-outline-variant/40 focus:border-primary px-4 py-2.5 rounded-xl bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 transition-all focus:outline-none" type="number" required />
          </div>
          <button type="submit" className="bg-surface-container-high text-on-surface hover:bg-primary hover:text-white px-6 py-2.5 rounded-xl font-label text-[15px] font-semibold transition-all shadow-sm hover:shadow-md h-[46px]">Gravar</button>
        </div>
      </form>

      {/* Lista de Cursos */}
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-outline-variant/30">
                <th className="py-4 px-6 font-label text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Nome do Curso</th>
                <th className="py-4 px-6 font-label text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Departamento</th>
                <th className="py-4 px-6 font-label text-[13px] font-bold text-on-surface-variant uppercase tracking-wider">Duração</th>
                <th className="py-4 px-6 font-label text-[13px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="font-body text-[15px] text-on-surface divide-y divide-outline-variant/20">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-10 font-medium text-on-surface-variant">A carregar registos...</td></tr>
              ) : cursos.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 font-medium text-on-surface-variant">Nenhum curso registado na base de dados.</td></tr>
              ) : cursos.map((curso) => (
                <tr key={curso.id} className="hover:bg-surface-container-lowest hover:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 group cursor-pointer">
                  <td className="py-4 px-6 font-medium text-on-surface flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-label text-[14px] font-bold shrink-0">
                        {curso.nome ? curso.nome.substring(0, 2).toUpperCase() : 'C'}
                     </div>
                     {curso.nome}
                  </td>
                  <td className="py-4 px-6 text-on-surface-variant/80 font-medium">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label text-[12px] font-semibold">
                      {curso.departamento}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-on-surface-variant font-medium">
                     {curso.duracao_anos} {curso.duracao_anos === 1 ? 'Ano' : 'Anos'}
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
