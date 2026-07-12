-- Ativar extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Perfis (Estende a tabela auth.users do Supabase)
CREATE TABLE perfis (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  nome TEXT NOT NULL,
  papel TEXT CHECK (papel IN ('admin', 'docente', 'estudante')) NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Tabela de Cursos
CREATE TABLE cursos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nome TEXT NOT NULL,
  duracao_anos INTEGER NOT NULL,
  departamento TEXT NOT NULL
);

-- Tabela de Docentes
CREATE TABLE docentes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users, -- Opcional: para login do docente
  nome TEXT NOT NULL,
  bi TEXT UNIQUE NOT NULL,
  especialidade TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
);

-- Tabela de Estudantes
CREATE TABLE estudantes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users, -- Opcional: para login do estudante
  nome TEXT NOT NULL,
  bi TEXT UNIQUE NOT NULL,
  data_nascimento DATE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefone TEXT,
  curso_id UUID REFERENCES cursos(id),
  ano_ingresso INTEGER NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Tabela de Disciplinas
CREATE TABLE disciplinas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nome TEXT NOT NULL,
  curso_id UUID REFERENCES cursos(id),
  docente_id UUID REFERENCES docentes(id)
);

-- Tabela de Matrículas
CREATE TABLE matriculas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  estudante_id UUID REFERENCES estudantes(id),
  curso_id UUID REFERENCES cursos(id),
  ano_letivo TEXT NOT NULL,
  estado TEXT CHECK (estado IN ('Pendente', 'Confirmado', 'Anulado')) DEFAULT 'Pendente',
  data_matricula TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Tabela de Pautas (Notas)
CREATE TABLE pautas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  estudante_id UUID REFERENCES estudantes(id),
  disciplina_id UUID REFERENCES disciplinas(id),
  ano_letivo TEXT NOT NULL,
  avaliacao_continua DECIMAL(4,2),
  prova_frequencia DECIMAL(4,2),
  exame DECIMAL(4,2),
  -- A média final pode ser calculada na aplicação ou via trigger/generated column. 
  -- Aqui deixamos como coluna editável para flexibilidade da instituição.
  media_final DECIMAL(4,2)
);