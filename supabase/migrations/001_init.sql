-- ====================================================
-- RepoVG — Migración 001: Schema inicial
-- ====================================================

-- Extensiones
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ====================================================
-- PERFILES
-- ====================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  nombre text not null,
  rol text not null check (rol in ('profesor', 'estudiante', 'exalumno', 'externo')),
  avatar_url text,
  xp_total integer not null default 0,
  coins integer not null default 0,
  nombre_mascota text,
  gemini_api_key_enc text,
  github_username text,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;
create policy "Usuarios ven su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);
create policy "Profesor ve todos los perfiles"
  on public.profiles for select
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.rol = 'profesor'
  ));
create policy "Usuarios actualizan su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-crear perfil al registrarse
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, nombre, rol)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'rol', 'estudiante')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ====================================================
-- MATERIAS Y ESTRUCTURA
-- ====================================================
create table public.materias (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  titulo text not null,
  descripcion text not null default '',
  color text not null default '#4f6ef7',
  created_at timestamptz not null default now()
);

create table public.semestres (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null unique,
  fecha_inicio date not null,
  fecha_fin date not null,
  activo boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.accesos (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  materia_id uuid not null references public.materias(id) on delete cascade,
  tipo text not null check (tipo in ('activo', 'historico')) default 'activo',
  semestre_id uuid references public.semestres(id),
  asignado_por uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (user_id, materia_id)
);

-- RLS en accesos
alter table public.accesos enable row level security;
create policy "Usuarios ven sus accesos"
  on public.accesos for select
  using (auth.uid() = user_id);
create policy "Profesor ve y gestiona todos los accesos"
  on public.accesos for all
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.rol = 'profesor'
  ));

-- ====================================================
-- PROGRESO
-- ====================================================
create table public.topic_deps (
  materia_id uuid not null references public.materias(id) on delete cascade,
  tema_slug text not null,
  depende_de_slug text not null,
  primary key (materia_id, tema_slug, depende_de_slug)
);

create table public.topic_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  materia_id uuid not null references public.materias(id) on delete cascade,
  tema_slug text not null,
  estado text not null check (estado in ('bloqueado', 'disponible', 'visto', 'completado')) default 'disponible',
  score integer,
  intentos integer not null default 0,
  completado_at timestamptz,
  unique (user_id, materia_id, tema_slug)
);

alter table public.topic_progress enable row level security;
create policy "Usuarios ven su propio progreso"
  on public.topic_progress for select
  using (auth.uid() = user_id);
create policy "Usuarios modifican su propio progreso"
  on public.topic_progress for all
  using (auth.uid() = user_id);
create policy "Profesor ve todo el progreso"
  on public.topic_progress for select
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.rol = 'profesor'
  ));

-- ====================================================
-- EVALUACIONES
-- ====================================================
create table public.evaluaciones (
  id uuid primary key default uuid_generate_v4(),
  materia_id uuid not null references public.materias(id) on delete cascade,
  tema_slug text not null,
  estado text not null check (estado in ('borrador', 'aprobada')) default 'borrador',
  complejidad integer not null default 1 check (complejidad between 1 and 5),
  puntaje_minimo integer not null default 70,
  generada_por_ia boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.preguntas (
  id uuid primary key default uuid_generate_v4(),
  evaluacion_id uuid not null references public.evaluaciones(id) on delete cascade,
  texto text not null,
  tipo text not null check (tipo in (
    'multiple_opcion', 'completar_codigo', 'ordenar_lineas',
    'matching', 'encontrar_bug', 'predecir_output', 'escribir_desde_cero'
  )),
  datos_json jsonb not null default '{}',
  orden integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.opciones (
  id uuid primary key default uuid_generate_v4(),
  pregunta_id uuid not null references public.preguntas(id) on delete cascade,
  texto text not null,
  es_correcta boolean not null default false
);

create table public.eval_intentos (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  evaluacion_id uuid not null references public.evaluaciones(id) on delete cascade,
  score integer not null,
  respuestas_json jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ====================================================
-- GAMIFICACIÓN
-- ====================================================
create table public.xp_log (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  cantidad_xp integer not null default 0,
  cantidad_coins integer not null default 0,
  motivo text not null,
  ref_id text,
  created_at timestamptz not null default now()
  -- INMUTABLE: solo INSERT, nunca UPDATE ni DELETE
);

alter table public.xp_log enable row level security;
create policy "Usuarios ven su xp_log"
  on public.xp_log for select
  using (auth.uid() = user_id);
-- Solo el servidor (service role) puede insertar en xp_log

create table public.achievements (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  titulo text not null,
  descripcion text not null,
  icono text not null default '🏆',
  rareza text not null check (rareza in ('comun', 'raro', 'epico', 'legendario')) default 'comun',
  xp_reward integer not null default 0,
  coins_reward integer not null default 0,
  condicion_tipo text not null,
  condicion_valor jsonb not null default '{}'
);

create table public.user_achievements (
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

create table public.cosmetics (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  nombre text not null,
  tipo text not null,
  rareza text not null check (rareza in ('comun', 'raro', 'epico', 'legendario')),
  desbloqueo_tipo text not null,
  desbloqueo_ref text,
  exclusivo boolean not null default false
);

create table public.user_cosmetics (
  user_id uuid not null references public.profiles(id) on delete cascade,
  cosmetic_id uuid not null references public.cosmetics(id) on delete cascade,
  desbloqueado_at timestamptz not null default now(),
  equipado boolean not null default false,
  primary key (user_id, cosmetic_id)
);

-- ====================================================
-- MASCOTA
-- ====================================================
create table public.mascota_preguntas (
  id uuid primary key default uuid_generate_v4(),
  materia_id uuid not null references public.materias(id) on delete cascade,
  tema_slug text not null,
  pregunta text not null,
  conceptos_clave_json jsonb not null default '[]',
  nivel_dificultad integer not null default 1 check (nivel_dificultad between 1 and 3)
);

create table public.mascota_frases (
  id uuid primary key default uuid_generate_v4(),
  evento_tipo text not null,
  texto text not null,
  nivel_minimo integer not null default 1
);

create table public.mascota_aprendido (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  materia_id uuid not null references public.materias(id) on delete cascade,
  tema_slug text not null,
  concepto text not null,
  aprendido_at timestamptz not null default now()
);

-- ====================================================
-- TIENDA
-- ====================================================
create table public.tienda_items (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  nombre text not null,
  categoria text not null check (categoria in ('cosmetico', 'boost_xp', 'beneficio_clase')),
  tipo text not null,
  rareza text not null check (rareza in ('comun', 'raro', 'epico', 'legendario')) default 'comun',
  costo_monedas integer not null,
  efecto_tipo text,
  efecto_valor numeric,
  efecto_duracion_horas integer,
  limite_por_semestre integer,
  disponible boolean not null default true,
  exclusivo boolean not null default false
);

create table public.user_tienda_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_id uuid not null references public.tienda_items(id),
  semestre_id uuid references public.semestres(id),
  estado text not null check (estado in ('disponible', 'activo', 'usado', 'expirado')) default 'disponible',
  activado_at timestamptz,
  expira_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.beneficios_canjeados (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_id uuid not null references public.tienda_items(id),
  semestre_id uuid references public.semestres(id),
  estado text not null check (estado in ('pendiente', 'aprobado', 'rechazado')) default 'pendiente',
  motivo_rechazo text,
  aprobado_por uuid references public.profiles(id),
  resuelto_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.mentor_consejos (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  materia_id uuid not null references public.materias(id) on delete cascade,
  tema_slug text not null,
  texto text not null check (char_length(texto) <= 280),
  estado text not null check (estado in ('pendiente', 'aprobado', 'rechazado', 'desactivado')) default 'pendiente',
  motivo_rechazo text,
  revisado_por uuid references public.profiles(id),
  revisado_at timestamptz,
  created_at timestamptz not null default now()
);

-- ====================================================
-- MONETIZACIÓN
-- ====================================================
create table public.descuentos_graduacion (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  descuento_pct integer not null default 50,
  valid_hasta timestamptz not null,
  usado boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.planes (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  nombre text not null,
  descripcion text not null default '',
  precio_mensual numeric not null,
  materias_incluidas text not null check (materias_incluidas in ('una', 'todas')),
  activo boolean not null default true
);

create table public.suscripciones (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  estado text not null check (estado in ('activa', 'cancelada', 'vencida')) default 'activa',
  proveedor text not null check (proveedor in ('stripe', 'mercadopago')),
  precio_pagado numeric not null,
  descuento_aplicado integer not null default 0,
  periodo_inicio date not null,
  periodo_fin date not null,
  created_at timestamptz not null default now()
);

create table public.registros_externos (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.planes(id),
  stripe_customer_id text,
  estado text not null check (estado in ('pendiente', 'activo', 'cancelado')) default 'pendiente',
  created_at timestamptz not null default now()
);

-- ====================================================
-- DATOS INICIALES
-- ====================================================
insert into public.materias (slug, titulo, descripcion, color) values
  ('java', 'Programación Java', 'Swing, POO, MVC y patrones de diseño', '#f59e0b'),
  ('movil', 'Desarrollo Móvil', 'Expo, React Native y ecosistema móvil', '#3b82f6')
on conflict (slug) do nothing;
