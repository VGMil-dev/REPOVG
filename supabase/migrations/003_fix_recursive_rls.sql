-- ====================================================
-- Fragments — Migración 003: Fix RLS Recursivo
-- ====================================================

-- 1. Crear función security definer para checkear rol sin recursión
-- Las funciones security definer se ejecutan con los privilegios del creador (postgres),
-- ignorando el RLS de las tablas que consultan internamente.
create or replace function public.is_profesor()
returns boolean language plpgsql security definer as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and rol = 'profesor'
  );
end;
$$;

-- 2. Eliminar políticas antiguas que causan recursión (aquellas que consultan public.profiles)
drop policy if exists "Profesor ve todos los perfiles" on public.profiles;
drop policy if exists "Profesor ve y gestiona todos los accesos" on public.accesos;
drop policy if exists "Profesor ve todo el progreso" on public.topic_progress;

-- 3. Recrear políticas usando la función no-recursiva

-- Perfiles
create policy "Profesor ve todos los perfiles"
  on public.profiles for select
  using (public.is_profesor());

-- Accesos
create policy "Profesor ve y gestiona todos los accesos"
  on public.accesos for all
  using (public.is_profesor());

-- Progreso
create policy "Profesor ve todo el progreso"
  on public.topic_progress for select
  using (public.is_profesor());
