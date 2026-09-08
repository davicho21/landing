-- El formulario pasó de la "Rueda de Crecimiento Organizacional" (empresa/email/
-- sector + 8 áreas x 2 preguntas) al "Índice de Madurez de Formación Corporativa"
-- (formulario de lead ampliado + 5 áreas x 3 preguntas). Solo había leads de
-- prueba en la tabla, así que se reestructura en vez de migrar datos históricos.

alter table public.leads
  drop column if exists empresa,
  drop column if exists sector,
  drop column if exists respuestas,
  drop column if exists puntajes_aspectos,
  drop column if exists areas_criticas;

alter table public.leads
  add column if not exists nombres text not null default '',
  add column if not exists apellidos text not null default '',
  add column if not exists cargo text not null default '',
  add column if not exists area_desempeno text not null default '',
  add column if not exists empresa text not null default '',
  add column if not exists sitio_web text not null default '',
  add column if not exists pais text not null default '',
  add column if not exists ciudad text not null default '',
  add column if not exists industria text not null default '',
  add column if not exists num_colaboradores text not null default '',
  add column if not exists desafio_principal text not null default '',
  add column if not exists respuestas jsonb not null default '{}'::jsonb,
  add column if not exists puntajes_areas jsonb not null default '[]'::jsonb,
  add column if not exists areas_criticas jsonb not null default '[]'::jsonb;

alter table public.leads alter column nombres drop default;
alter table public.leads alter column apellidos drop default;
alter table public.leads alter column cargo drop default;
alter table public.leads alter column area_desempeno drop default;
alter table public.leads alter column empresa drop default;
alter table public.leads alter column sitio_web drop default;
alter table public.leads alter column pais drop default;
alter table public.leads alter column ciudad drop default;
alter table public.leads alter column industria drop default;
alter table public.leads alter column num_colaboradores drop default;
alter table public.leads alter column desafio_principal drop default;
alter table public.leads alter column respuestas drop default;
alter table public.leads alter column puntajes_areas drop default;
alter table public.leads alter column areas_criticas drop default;
