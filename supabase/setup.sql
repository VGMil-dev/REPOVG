-- ============================================================
-- Fragments — Supabase Setup Completo
-- Ejecuta en SQL Editor > New Query
-- ============================================================

-- ── 1. Tabla profiles ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email       TEXT NOT NULL,
  nombre      TEXT,
  rol         TEXT NOT NULL DEFAULT 'estudiante'
                CHECK (rol IN ('profesor', 'estudiante', 'exalumno')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 2. Tabla materias ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.materias (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,
  titulo      TEXT NOT NULL,
  descripcion TEXT,
  icono       TEXT DEFAULT 'book',
  color       TEXT DEFAULT '#38bdf8',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 3. Tabla accesos ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.accesos (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  materia_id   UUID NOT NULL REFERENCES public.materias(id) ON DELETE CASCADE,
  tipo         TEXT NOT NULL DEFAULT 'activo'
                 CHECK (tipo IN ('activo', 'historico')),
  asignado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, materia_id)
);

-- ── 4. Trigger: auto-crear perfil al registrar usuario ────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 5. Row Level Security ─────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materias  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accesos   ENABLE ROW LEVEL SECURITY;

-- profiles: cada usuario ve y edita solo el suyo
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- profesores ven todos los profiles
CREATE POLICY "profiles_select_profesor" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'profesor')
  );

-- materias: todos los autenticados pueden leer
CREATE POLICY "materias_select_auth" ON public.materias
  FOR SELECT USING (auth.role() = 'authenticated');

-- solo profesores gestionan materias
CREATE POLICY "materias_insert_profesor" ON public.materias
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'profesor')
  );

CREATE POLICY "materias_update_profesor" ON public.materias
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'profesor')
  );

-- accesos: usuario ve sus propios
CREATE POLICY "accesos_select_own" ON public.accesos
  FOR SELECT USING (auth.uid() = user_id);

-- profesores ven y gestionan todos los accesos
CREATE POLICY "accesos_all_profesor" ON public.accesos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND rol = 'profesor')
  );

-- ── 6. Datos iniciales: materias ─────────────────────────────
INSERT INTO public.materias (slug, titulo, descripcion, color) VALUES
  ('movil', 'Desarrollo Móvil', 'React Native, Expo y ecosistema móvil', '#f97316'),
  ('java',  'Programación Java', 'Java Swing, POO y patrones de diseño', '#a78bfa')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Crear tu primer usuario PROFESOR:
--
-- 1. Supabase Dashboard → Authentication → Users → Add User
--    email: tu@email.com
--    password: tu-contraseña
--    email_confirm: true
--
-- 2. Luego actualiza su rol:
UPDATE public.profiles SET rol = 'profesor', nombre = 'Tu Nombre'
WHERE email = 'tu@email.com';  -- ← cambia esto
--
-- 3. Desde el panel /admin/usuarios puedes crear el resto.
-- ============================================================
