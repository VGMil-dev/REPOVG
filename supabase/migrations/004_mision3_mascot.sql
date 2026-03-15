-- ─────────────────────────────────────────────────────────────────────────────
-- 004_mision3_mascot.sql
-- Agrega columnas de mascota al perfil y semilla de achievement + cosmético
-- para la Misión 3 del onboarding.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Columnas nuevas en profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS mascot_sprite   text NOT NULL DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS mascot_cosmetic text;

-- 2. Achievement: mascota_activada
INSERT INTO public.achievements
  (slug, titulo, descripcion, icono, rareza, xp_reward, coins_reward, condicion_tipo, condicion_valor)
VALUES (
  'mascota_activada',
  'COMPAÑERO ACTIVADO',
  'Completaste el protocolo de vinculación con tu mascota.',
  '🤖',
  'comun',
  0,
  0,
  'onboarding',
  '{"mision": 3}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- 3. Cosmético inicial: badge de protocolo
INSERT INTO public.cosmetics
  (slug, nombre, tipo, rareza, desbloqueo_tipo, desbloqueo_ref, exclusivo)
VALUES (
  'badge_protocolo_vinculacion',
  'PROTOCOLO DE VINCULACIÓN',
  'badge',
  'comun',
  'onboarding',
  'mision_3',
  false
)
ON CONFLICT (slug) DO NOTHING;
