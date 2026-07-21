create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  necesidad text not null,
  necesidad_otro text,
  motivo text not null,
  num_personas text not null,
  tiempo_disponible text not null,
  objetivo text not null,
  email text not null,
  ruta_recomendada text not null,
  cursos_recomendados jsonb not null default '[]'::jsonb
);

alter table public.leads enable row level security;

-- Sin políticas públicas a propósito: todo el acceso de lectura/escritura
-- pasa por el backend con la service role key, o por el dashboard de
-- Supabase (que usa el rol de administrador de la organización).
