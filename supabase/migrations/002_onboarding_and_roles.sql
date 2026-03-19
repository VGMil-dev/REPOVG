-- ====================================================
-- Fragments — Migración 002: Onboarding y Roles
-- ====================================================

-- Agregar columna de progreso de onboarding
alter table public.profiles 
add column if not exists onboarding_step integer not null default 0;

-- Actualizar la función de creación de perfil para manejar el salto de onboarding del profesor
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  initial_rol text;
  initial_onboarding_step integer := 0;
begin
  -- Determinar el rol inicial
  initial_rol := coalesce(new.raw_user_meta_data->>'rol', 'estudiante');
  
  -- El profesor se salta el onboarding (paso 3 = completado)
  if initial_rol = 'profesor' then
    initial_onboarding_step := 3;
  end if;

  insert into public.profiles (id, email, nombre, rol, onboarding_step)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)),
    initial_rol,
    initial_onboarding_step
  );
  return new;
end;
$$;

-- Nota: El trigger ya existe de la migración 001, no es necesario recrearlo
-- a menos que se quiera asegurar su orden, pero el replace function ya afecta al trigger.
