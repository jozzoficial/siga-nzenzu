'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function EstudantesPage() {
  const [estudantes, setEstudantes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [nome, setNome] = useState('');
  const [bi, setBi] = useState('');
  const [curso, setCurso] = useState('');
  const [ano, setAno] = useState('');
  
  const fetchEstudantes = async () => {
    setLoading(true);
    const { data } = await supabase.from('estudantes').select('*');
    if (data) setEstudantes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEstudantes();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('estudantes').insert([
      { nome_completo: nome, bi, curso, ano_ingresso: parseInt(ano) }
    ]);
    if (!error) {
      alert('Estudante adicionado com sucesso!');
      setNome(''); setBi(''); setCurso(''); setAno('');
      fetchEstudantes();
    } else {
      console.error(error);
      alert('Erro ao adicionar estudante');
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-lg">
        <div>
          <h2 className="font-headline text-[28px] font-bold text-on-surface">Gestão de Estudantes</h2>
          <p className="font-body text-[14px] text-on-surface-variant mt-1">Gerencie os registros, matrículas e informações acadêmicas.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-sm items-center">
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
            <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-2 pl-10 pr-4 font-body text-[14px] text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-on-surface-variant/60" placeholder="Buscar estudante..." type="text" />
          </div>
          <button className="w-full sm:w-auto bg-primary-container text-on-primary hover:bg-primary font-label text-[14px] font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Adicionar
          </button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="bg-surface-container-lowest p-md rounded-lg shadow-sm mb-lg border border-outline-variant flex gap-4 flex-wrap">
        <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome" className="border px-2 py-1 rounded bg-surface" required />
        <input value={bi} onChange={e => setBi(e.target.value)} placeholder="BI" className="border px-2 py-1 rounded bg-surface" required />
        <input value={curso} onChange={e => setCurso(e.target.value)} placeholder="Curso" className="border px-2 py-1 rounded bg-surface" required />
        <input value={ano} onChange={e => setAno(e.target.value)} placeholder="Ano Ingresso" className="border px-2 py-1 rounded bg-surface" type="number" required />
        <button type="submit" className="bg-primary text-on-primary px-4 py-1 rounded font-label text-[14px]">Salvar</button>
      </form>

      <div className="bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-outline-variant">
                <th className="py-3 px-4 font-label text-[14px] font-semibold text-on-surface-variant">ID</th>
                <th className="py-3 px-4 font-label text-[14px] font-semibold text-on-surface-variant">Nome Completo</th>
                <th className="py-3 px-4 font-label text-[14px] font-semibold text-on-surface-variant">BI</th>
                <th className="py-3 px-4 font-label text-[14px] font-semibold text-on-surface-variant">Curso</th>
                <th className="py-3 px-4 font-label text-[14px] font-semibold text-on-surface-variant">Ano Ingresso</th>
                <th className="py-3 px-4 font-label text-[14px] font-semibold text-on-surface-variant text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="font-body text-[14px] text-on-surface">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-4">Carregando...</td></tr>
              ) : estudantes.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4 text-on-surface-variant">Nenhum estudante encontrado.</td></tr>
              ) : estudantes.map((est) => (
                <tr key={est.id} className="border-b border-surface-variant hover:bg-surface-container-low transition-colors group">
                  <td className="py-3 px-4 font-label text-[14px] text-primary">#{est.id}</td>
                  <td className="py-3 px-4 font-medium">{est.nome_completo || est.nome}</td>
                  <td className="py-3 px-4 text-on-surface-variant">{est.bi}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-container font-label text-[12px] border border-secondary-container">
                      {est.curso}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant">{est.ano_ingresso}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-on-surface-variant hover:text-primary rounded hover:bg-surface-container transition-colors">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button className="p-1.5 text-on-surface-variant hover:text-error rounded hover:bg-error-container transition-colors">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
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
