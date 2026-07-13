# Documentação do Sistema: SIGA - NZUNZU (ISPNE - Uíge)

## 1. Visão Geral do Projeto
O **SIGA - NZUNZU** é um Sistema Integrado de Gestão Académica desenvolvido para modernizar e digitalizar os processos administrativos e pedagógicos da instituição de ensino (ISPNE - Uíge). O principal objetivo é abandonar o uso de folhas de cálculo e papéis isolados, centralizando a informação de estudantes, docentes, cursos e pautas numa plataforma web segura, rápida e com um design de excelência.

## 2. Tecnologias Utilizadas
O projeto adota uma arquitetura moderna baseada em tecnologias "State of the Art" no ecossistema de desenvolvimento Web:

### Frontend (Interface de Utilizador)
- **Next.js (App Router)**: Framework React escolhida pela sua performance, renderização otimizada e gestão de rotas baseada no sistema de pastas (`/app`).
- **React 19**: Biblioteca núcleo para construir componentes dinâmicos e reativos.
- **TailwindCSS**: Utilizado para criar toda a interface visual (estilos). Permite a construção de um design premium e responsivo sem arquivos CSS pesados.
- **Material Symbols (Google Icons)**: Coleção de ícones vetoriais modernos para navegação clara e intuitiva.
- **jsPDF & jsPDF-Autotable**: Bibliotecas JavaScript utilizadas para a renderização e exportação nativa de documentos PDF diretamente no navegador.

### Backend e Base de Dados (BaaS)
- **Supabase**: Plataforma Backend-as-a-Service, operando como o motor do sistema.
- **PostgreSQL**: Base de dados relacional que garante a integridade dos dados, com relações estritas entre as tabelas (Foreign Keys e Cascades).
- **Supabase Auth**: Sistema de autenticação responsável pela gestão de acessos e sessões encriptadas.
- **Row-Level Security (RLS)**: Políticas de segurança implementadas diretamente no motor da base de dados para garantir que os dados apenas podem ser lidos ou alterados através de operações autorizadas.

## 3. Arquitetura e Decisões de Design (UI/UX)
A interface foi desenhada focando-se no utilizador final (funcionários e docentes), seguindo princípios como:
- **Glassmorphism e Sombras Suaves**: O uso de transparências e fundos subtis confere à plataforma um visual *premium* e polido.
- **Tipografia Limpa**: Uso consistente das fontes para criar hierarquia visual clara (Títulos em evidência vs. tabelas densas).
- **Feedback em Tempo Real**: Uso de *states* locais no React (`useState`, `useEffect`) para garantir que botões de "Guardar", alertas e cálculos de média respondem instantaneamente à interação.
- **Single Page Application (SPA) Feel**: As mudanças de ecrã (entre Estudantes, Cursos, Pautas) ocorrem sem recarregar o navegador, melhorando a experiência de velocidade.

## 4. Módulos e Funcionalidades Desenvolvidas

O protótipo (MVP) inclui as seguintes funcionalidades completamente operacionais:

1. **Autenticação Segura (Login)**: Proteção de rotas, onde apenas utilizadores com credenciais ativas podem visualizar o Dashboard.
2. **Dashboard Global**: Painel analítico que consulta a base de dados em tempo real para exibir métricas (total de estudantes, cursos ativos, novas matrículas).
3. **Gestão de Cursos e Disciplinas**: Criação, edição e eliminação do catálogo formativo da instituição.
4. **Gestão de Pessoas (Docentes e Estudantes)**:
   - Registo detalhado com informações pessoais (BI, Nif, Telefone).
   - Validações que evitam duplicação de dados sensíveis.
5. **Sistema de Matrículas**: Associação rigorosa de estudantes aos cursos para um ano letivo, suportando mudança de estados ("Confirmado", "Pendente", "Anulado").
6. **Motor Lógico de Avaliação (Pautas)**:
   - **Geração Cruzada**: O sistema busca apenas alunos validamente matriculados numa disciplina.
   - **Cálculo em Tempo Real**: Inserção da P1 e P2 para cálculo de Média.
   - **Regras de Negócio Inseridas**: Dispensa automática (Média >= 13.5). Cálculo ponderado do Exame Final e verificação automática de Aprovado / Reprovado / Recurso.
   - **Exportação Otimizada**: Geração de um documento PDF formatado e limpo contendo toda a grelha de notas para fácil impressão ou arquivo.

## 5. Estrutura da Base de Dados
O modelo relacional foi desenhado de forma normalizada:
- `cursos`: Entidade central que define os programas.
- `disciplinas`: Relaciona-se com `cursos`.
- `docentes` e `estudantes`: Armazenamento de utilizadores e os seus dados cívicos.
- `matriculas`: Tabela-ponte (Pivot) que associa um estudante a um curso, ano letivo e gere o seu estado ativo.
- `pautas`: Armazena os registos da evolução escolar, estando associada, obrigatoriamente, à matrícula e à disciplina do aluno.

## 6. Próximos Passos e Expansões Futuras
Para elevar o sistema de MVP para um produto comercial de larga escala, preveem-se as seguintes etapas:
- **Boletins e Declarações**: Geração e download de PDFs com o aproveitamento académico individual de cada aluno.
- **Gestão de Permissões (RBAC)**: Diferenciação entre "Administrador da Secretaria" (tem todos os acessos) e "Docente" (só pode lançar notas das suas disciplinas).
- **Adaptação Total Mobile**: Melhorias no menu interativo para operação diária através de smartphones.
- **Deploy (Lançamento Oficial)**: Alojamento do código-fonte num ambiente *cloud* (como a Vercel) para garantir disponibilidade global.
