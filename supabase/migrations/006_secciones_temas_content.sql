-- ====================================================
-- Fragments — Migración 006: Secciones y Temas para contenido educativo
-- ====================================================

-- Extender materias con campo premium
alter table public.materias add column if not exists premium boolean not null default false;

-- ====================================================
-- SECCIONES (agrupaciones dentro de una materia)
-- ====================================================
create table public.secciones (
  id          uuid primary key default uuid_generate_v4(),
  materia_id  uuid not null references public.materias(id) on delete cascade,
  slug        text not null,
  titulo      text not null,
  orden       integer not null default 0,
  created_at  timestamptz not null default now(),
  unique(materia_id, slug)
);

-- ====================================================
-- TEMAS (contenido individual, con MDX opcional)
-- ====================================================
create table public.temas (
  id             uuid primary key default uuid_generate_v4(),
  materia_id     uuid not null references public.materias(id) on delete cascade,
  seccion_id     uuid references public.secciones(id) on delete set null,
  slug           text not null,
  titulo         text not null,
  descripcion    text,
  orden          integer not null default 0,
  premium        boolean not null default false,
  contenido_mdx  text,
  created_at     timestamptz not null default now(),
  unique(materia_id, slug)
);

-- ====================================================
-- RLS
-- ====================================================
alter table public.secciones enable row level security;
alter table public.temas enable row level security;

-- Secciones: lectura pública (la restricción se aplica a nivel de tema)
create policy "Lectura pública de secciones"
  on public.secciones for select
  using (true);

-- Temas: libre si no es premium; premium solo si tiene acceso a la materia
create policy "Lectura de temas según acceso"
  on public.temas for select
  using (
    not premium
    or exists (
      select 1 from public.accesos a
      where a.user_id = auth.uid()
        and a.materia_id = temas.materia_id
    )
  );
