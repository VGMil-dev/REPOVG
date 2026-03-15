-- ─────────────────────────────────────────────────────────────────────────────
-- 005_mascot_chat.sql
-- RLS en tablas de mascota, unique constraint en mascota_aprendido,
-- y frases semilla del banco de eventos.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Unique constraint para evitar conceptos duplicados por sesión
ALTER TABLE public.mascota_aprendido
  ADD CONSTRAINT mascota_aprendido_uq
  UNIQUE (user_id, materia_id, tema_slug, concepto);

-- 2. RLS en mascota_aprendido
ALTER TABLE public.mascota_aprendido ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuario ve su propio aprendido"
  ON public.mascota_aprendido FOR SELECT
  USING (auth.uid() = user_id);
-- INSERT via adminClient (service_role) desde server actions

-- 3. RLS en mascota_preguntas — lectura para autenticados
ALTER TABLE public.mascota_preguntas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autenticados leen preguntas"
  ON public.mascota_preguntas FOR SELECT
  TO authenticated USING (true);

-- 4. RLS en mascota_frases — lectura para autenticados
ALTER TABLE public.mascota_frases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autenticados leen frases"
  ON public.mascota_frases FOR SELECT
  TO authenticated USING (true);

-- 5. Frases semilla
INSERT INTO public.mascota_frases (evento_tipo, texto, nivel_minimo) VALUES
  ('concepto_aprendido', 'Lo tengo claro gracias a ti. Eres un gran maestro', 1),
  ('concepto_aprendido', 'Eso es exactamente lo que necesitaba aprender', 1),
  ('concepto_aprendido', 'Registrado en mi nucleo cognitivo', 1),
  ('intento_fallido', 'Casi... intenta explicarlo con tus propias palabras', 1),
  ('intento_fallido', 'Hmm, no entendi bien. Puedes intentar de otra forma?', 1),
  ('intento_fallido', 'Estoy procesando tu explicacion... algo me falta', 1),
  ('bienvenida_tema', 'Nuevo tema detectado. Cuéntame qué estás aprendiendo', 1),
  ('quota_agotada', 'Mi nucleo cognitivo necesita descansar. Vuelvo pronto', 1),
  ('sin_api_key', 'Necesito una clave Gemini para pensar mas profundo', 1)
ON CONFLICT DO NOTHING;
