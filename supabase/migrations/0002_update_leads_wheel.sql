-- El formulario pasó de 5 preguntas libres a la "Rueda de Crecimiento
-- Organizacional" (datos de empresa + 8 áreas x 2 preguntas puntuadas 1-10).
-- Solo había leads de prueba en la tabla, así que se reestructura en vez de
-- migrar datos históricos.

alter table public.leads
  drop column if exists necesidad,
  drop column if exists necesidad_otro,
  drop column if exists motivo,
  drop column if exists num_personas,
  drop column if exists tiempo_disponible,
  drop column if exists objetivo,
  drop column if exists ruta_recomendada,
  drop column if exists cursos_recomendados;

alter table public.leads
  add column if not exists empresa text not null default '',
  add column if not exists sector text not null default '',
  add column if not exists respuestas jsonb not null default '{}'::jsonb,
  add column if not exists puntajes_aspectos jsonb not null default '[]'::jsonb,
  add column if not exists areas_criticas jsonb not null default '[]'::jsonb;

alter table public.leads alter column empresa drop default;
alter table public.leads alter column sector drop default;
alter table public.leads alter column respuestas drop default;
alter table public.leads alter column puntajes_aspectos drop default;
alter table public.leads alter column areas_criticas drop default;
