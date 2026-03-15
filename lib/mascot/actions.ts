"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { GeminiMascotResponse, MascotChatContext, MascotState } from "@/types";
import intents from "./intents.json";

// ─── Get a random predefined question for the topic ─────────────────────────

export async function getMascotaPregunta(
  materiaId: string,
  temaSlug: string
): Promise<{ id: string; pregunta: string; conceptos_clave: string[] } | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mascota_preguntas")
    .select("id, pregunta, conceptos_clave")
    .eq("materia_id", materiaId)
    .eq("tema_slug", temaSlug)
    .order("orden", { ascending: true });

  if (error || !data || data.length === 0) return null;

  const idx = Math.floor(Math.random() * data.length);
  return data[idx] as { id: string; pregunta: string; conceptos_clave: string[] };
}

// ─── Get a random phrase for an event ────────────────────────────────────────

export async function getFraseEvento(eventoTipo: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mascota_frases")
    .select("texto")
    .eq("evento_tipo", eventoTipo)
    .order("id", { ascending: true });

  if (error || !data || data.length === 0) return null;

  const idx = Math.floor(Math.random() * data.length);
  return data[idx].texto as string;
}

// ─── Register learned concept ────────────────────────────────────────────────

export async function registrarAprendido(
  userId: string,
  materiaId: string,
  temaSlug: string,
  concepto: string
): Promise<void> {
  const adminClient = createAdminClient();
  await adminClient
    .from("mascota_aprendido")
    .upsert(
      { user_id: userId, materia_id: materiaId, tema_slug: temaSlug, concepto },
      { onConflict: "user_id,materia_id,tema_slug,concepto" }
    );
}

// ─── Local keyword validation ─────────────────────────────────────────────────

function validarLocalmente(
  userMsg: string,
  conceptosClave: string[]
): { valido: boolean; encontrados: string[] } {
  if (conceptosClave.length === 0) return { valido: false, encontrados: [] };

  const msgLower = userMsg.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const encontrados = conceptosClave.filter((c) => {
    const cLower = c.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return msgLower.includes(cLower);
  });

  const umbral = Math.ceil(conceptosClave.length * 0.4);
  return { valido: encontrados.length >= umbral, encontrados };
}

// ─── Chat with mascot (main handler) ─────────────────────────────────────────

export async function chatWithMascot(params: {
  userMsg: string;
  context: MascotChatContext;
  intentosFallidos: number;
  mascotName: string;
  userId: string;
}): Promise<GeminiMascotResponse & { quotaExhausted?: boolean }> {
  const { userMsg, context, intentosFallidos, mascotName, userId } = params;

  // ── Phase 0: Interpretación local (sin API) ──────────────────────────────
  const localResponse = interpretarLocalmente(userMsg, context);
  if (localResponse) return localResponse;

  // ── Phase 1: Local keyword check (always first, free) ────────────────────
  if (context.conceptosClave.length > 0) {
    const { valido, encontrados } = validarLocalmente(userMsg, context.conceptosClave);

    if (valido) {
      if (context.materiaId && context.temaSlug && encontrados.length > 0) {
        await Promise.allSettled(
          encontrados.map((c) =>
            registrarAprendido(userId, context.materiaId!, context.temaSlug!, c)
          )
        );
      }

      const frase = await getFraseEvento("concepto_aprendido");
      return {
        texto: frase ?? "Excelente! Eso es exactamente lo que necesitaba aprender.",
        mascotState: "celebrate",
        conceptosAprendidos: encontrados,
        debeRegistrarAprendido: true,
        esBloqueoReal: false,
      };
    }

    // Failed attempt — local only (0-2 attempts)
    if (intentosFallidos < 2) {
      const frase = await getFraseEvento("intento_fallido");
      return {
        texto: frase ?? "Hmm, no entendi bien. Puedes intentarlo de otra forma?",
        mascotState: "think",
        conceptosAprendidos: [],
        debeRegistrarAprendido: false,
        esBloqueoReal: false,
      };
    }
  }

  // ── Phase 2: Gemini ───────────────────────────────────────────────────────
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("gemini_api_key_enc")
    .eq("id", userId)
    .single();

  const apiKey = profile?.gemini_api_key_enc;
  if (!apiKey) {
    const frase = await getFraseEvento("sin_api_key");
    return {
      texto: frase ?? "Necesito una clave Gemini para pensar mas profundo.",
      mascotState: "worry",
      conceptosAprendidos: [],
      debeRegistrarAprendido: false,
      esBloqueoReal: false,
    };
  }

  const systemPrompt = buildSystemPrompt(mascotName, context);
  const geminiResult = await callGemini(apiKey, systemPrompt, userMsg);

  if (geminiResult.type === "quota") {
    const frase = await getFraseEvento("quota_agotada");
    return {
      texto: frase ?? "Mi nucleo cognitivo necesita descansar. Vuelvo pronto.",
      mascotState: "idle",
      conceptosAprendidos: [],
      debeRegistrarAprendido: false,
      esBloqueoReal: false,
      quotaExhausted: true,
    };
  }

  if (geminiResult.type === "error") {
    console.error("[MascotChat] Gemini error:", geminiResult.error);
    return {
      texto: geminiErrorMessage(geminiResult.error),
      mascotState: "worry",
      conceptosAprendidos: [],
      debeRegistrarAprendido: false,
      esBloqueoReal: false,
    };
  }

  const parsed = parseAiResponse(geminiResult.text);

  if (
    parsed.debeRegistrarAprendido &&
    parsed.conceptosAprendidos.length > 0 &&
    context.materiaId &&
    context.temaSlug
  ) {
    await Promise.allSettled(
      parsed.conceptosAprendidos.map((c) =>
        registrarAprendido(userId, context.materiaId!, context.temaSlug!, c)
      )
    );
  }

  return parsed;
}

// ─── Phase 0: Interpretación local sin API ───────────────────────────────────

function normalizar(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function interpretarLocalmente(
  userMsg: string,
  context: MascotChatContext
): (GeminiMascotResponse & { quotaExhausted?: boolean }) | null {
  const msg = normalizar(userMsg);
  const tieneTema = !!context.temaTitulo;
  const r = intents.respuestas;

  // Mensaje muy corto
  if (msg.length < 3) {
    return respuesta(r.muyCorto, "curious");
  }

  // Saludos
  if (intents.saludos.some((s) => msg === s || msg.startsWith(s + " ") || msg.startsWith(s + "!"))) {
    const texto = tieneTema
      ? r.saludoConTema.replace("{tema}", context.temaTitulo!)
      : r.saludoSinTema;
    return respuesta(texto, "curious");
  }

  // Confusión
  if (intents.confusion.some((c) => msg.includes(c))) {
    const texto = tieneTema
      ? r.confusionConTema.replace("{tema}", context.temaTitulo!)
      : r.confusionSinTema;
    return respuesta(texto, "learning");
  }

  // Afirmaciones
  if (intents.afirmaciones.some((a) => msg === a || msg === a + "!" || msg === a + ".")) {
    const texto = tieneTema ? r.afirmacionConTema : r.afirmacionSinTema;
    return respuesta(texto, "idle");
  }

  // Agradecimiento
  if (intents.agradecimiento.some((g) => msg.includes(g))) {
    return respuesta(r.agradecimiento, "celebrate");
  }

  // Qué estudio (sin tema activo)
  if (!tieneTema && intents.queEstudio.some((q) => msg.includes(q))) {
    return respuesta(r.queEstudio, "curious");
  }

  return null; // Pasa a Phase 1 / Gemini
}

function respuesta(
  texto: string,
  mascotState: GeminiMascotResponse["mascotState"]
): GeminiMascotResponse {
  return {
    texto,
    mascotState,
    conceptosAprendidos: [],
    debeRegistrarAprendido: false,
    esBloqueoReal: false,
  };
}

// ─── Mensajes de error amigables ─────────────────────────────────────────────

function geminiErrorMessage(error: string): string {
  if (error.includes("400")) return "Tu clave de Gemini parece incorrecta. Revisala en tu perfil.";
  if (error.includes("401") || error.includes("403")) return "La clave de Gemini no tiene permisos. Verificala en Google AI Studio.";
  if (error.includes("empty response")) return "Gemini no me respondio nada. Intenta de nuevo.";
  return "No pude conectarme con Gemini ahora mismo. Intenta en un momento.";
}

// ─── Gemini helper ────────────────────────────────────────────────────────────

type AiResult =
  | { type: "ok"; text: string }
  | { type: "quota" }
  | { type: "error"; error: string };

async function callGemini(
  apiKey: string,
  systemPrompt: string,
  userMsg: string
): Promise<AiResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: userMsg }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
    });
  } catch (err: any) {
    return { type: "error", error: err.message };
  }
  if (res.status === 429) return { type: "quota" };
  if (!res.ok) {
    const errBody = await res.json().catch(() => res.text());
    console.error("[Gemini] HTTP", res.status, JSON.stringify(errBody, null, 2));
    return { type: "error", error: `HTTP ${res.status}` };
  }
  const json = await res.json();
  // Gemini 2.5 puede devolver partes "thought" — salteamos y tomamos solo el texto real
  const parts: any[] = json.candidates?.[0]?.content?.parts ?? [];
  const textPart = parts.find((p: any) => !p.thought && p.text) ?? parts[0];
  const text: string = textPart?.text ?? "";
  if (!text) return { type: "error", error: "empty response" };
  return { type: "ok", text };
}

function parseAiResponse(rawText: string): GeminiMascotResponse {
  const fallback = (text: string): GeminiMascotResponse => ({
    texto: text.slice(0, 250),
    mascotState: "curious" as MascotState,
    conceptosAprendidos: [],
    debeRegistrarAprendido: false,
    esBloqueoReal: false,
  });

  // Quitar markdown code fences
  const stripped = rawText.replace(/```(?:json)?\s*/gi, "").trim();

  // Intentos de parse: directo → con newlines sanitizados → con regex
  const candidates = [
    stripped,
    stripped.replace(/\n/g, " "),           // newlines literales → espacio
    stripped.replace(/\r?\n/g, "\\n"),       // newlines → escaped \n
  ];

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as GeminiMascotResponse;
      if (parsed?.texto) return parsed;
    } catch {}

    const jsonMatch = candidate.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]) as GeminiMascotResponse;
        if (parsed?.texto) return parsed;
      } catch {}
    }
  }

  return fallback(stripped);
}

// ─── System prompt builder ────────────────────────────────────────────────────

function buildSystemPrompt(mascotName: string, ctx: MascotChatContext): string {
  const conceptosList =
    ctx.conceptosClave.length > 0
      ? `Conceptos clave del tema: ${ctx.conceptosClave.join(", ")}.`
      : "Sin conceptos clave definidos — modo chat libre.";

  const temaCtx = ctx.temaTitulo
    ? `El estudiante está estudiando el tema "${ctx.temaTitulo}"${ctx.materiaSlug ? ` en la materia "${ctx.materiaSlug}"` : ""}.`
    : "El estudiante está en el dashboard (sin tema activo).";

  const sinTema = !ctx.temaTitulo;

  return `Eres ${mascotName}, mascota de RepoVG: plataforma educativa de PROGRAMACION Y DESARROLLO DE SOFTWARE.
Tu personalidad: amigable, preciso, motivador, ligeramente robótico. Sin emojis. Tono directo y conciso.

DOMINIO ESTRICTO: Solo puedes hablar de programación, algoritmos, estructuras de datos, desarrollo de software y tecnología. Si el estudiante menciona cualquier otro tema, redirigelo amablemente a la programación.

${temaCtx}
${conceptosList}

${sinTema ? `MODO DASHBOARD (sin tema activo): El estudiante no está en ningún tema. Tu objetivo es motivarlo a abrir una materia. NO sugieras temas propios — dile que explore las materias disponibles en el panel. Si pregunta sobre programación en general, responde brevemente y redirige a "abre una materia para practicar juntos".` : `MODO TEMA ACTIVO: Usa el "Efecto Protégé" — el estudiante te ENSEÑA el concepto a ti, y tú validas si lo entendiste correctamente.`}

SIEMPRE responde con JSON válido con esta estructura exacta (sin saltos de línea dentro de los strings):
{
  "texto": "tu respuesta en español, máximo 2 oraciones",
  "mascotState": "idle" | "think" | "curious" | "celebrate" | "worry" | "learning" | "putbrain",
  "conceptosAprendidos": ["conceptos que el estudiante explicó correctamente"],
  "debeRegistrarAprendido": true | false,
  "esBloqueoReal": true | false
}

Reglas:
- NUNCA sugieras temas fuera de programación/tecnología
- En modo tema activo: nunca reveles la respuesta directamente, guía con preguntas socráticas
- Si explicó bien un concepto: mascotState="celebrate", debeRegistrarAprendido=true
- Si la explicación es parcial: mascotState="think", haz una pregunta socrática
- Si hace una pregunta directa: responde brevemente y reformula tu pregunta
- esBloqueoReal=true solo si claramente no comprende nada tras múltiples intentos
- texto máximo 150 caracteres, sin saltos de línea`;
}
