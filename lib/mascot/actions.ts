"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { GeminiMascotResponse, MascotChatContext, MascotState } from "@/types";

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

  // ── Phase 2: Gemini (3rd+ attempt or free chat) ───────────────────────────
  // Read API key from DB server-side (never exposed through client)
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
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

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
          maxOutputTokens: 400,
        },
      }),
    });
  } catch (err) {
    console.error("[MascotChat] fetch error:", err);
    return {
      texto: "Error de red al contactar Gemini. Revisa tu conexion.",
      mascotState: "worry",
      conceptosAprendidos: [],
      debeRegistrarAprendido: false,
      esBloqueoReal: false,
    };
  }

  if (res.status === 429) {
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

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    console.error(`[MascotChat] Gemini HTTP ${res.status}:`, errBody);
    return {
      texto: `Error Gemini ${res.status}. Revisa tu API key en el perfil.`,
      mascotState: "worry",
      conceptosAprendidos: [],
      debeRegistrarAprendido: false,
      esBloqueoReal: false,
    };
  }

  const json = await res.json();
  const rawText: string = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  if (!rawText) {
    console.error("[MascotChat] Gemini returned empty text:", JSON.stringify(json));
    return {
      texto: "No obtuve respuesta de Gemini. Intenta de nuevo.",
      mascotState: "worry",
      conceptosAprendidos: [],
      debeRegistrarAprendido: false,
      esBloqueoReal: false,
    };
  }

  // Extract JSON block from Gemini text (may include markdown fences)
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    // Plain text response — treat as chat libre
    return {
      texto: rawText.slice(0, 250),
      mascotState: "curious" as MascotState,
      conceptosAprendidos: [],
      debeRegistrarAprendido: false,
      esBloqueoReal: false,
    };
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as GeminiMascotResponse;

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
  } catch {
    return {
      texto: rawText.slice(0, 250),
      mascotState: "curious" as MascotState,
      conceptosAprendidos: [],
      debeRegistrarAprendido: false,
      esBloqueoReal: false,
    };
  }
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

  return `Eres ${mascotName}, una mascota de aprendizaje de un sistema educativo gamificado.
Tu personalidad: amigable, preciso, motivador, ligeramente robótico. Sin emojis. Usa un tono directo y conciso.

${temaCtx}
${conceptosList}

Tu rol es usar el "Efecto Protégé": el estudiante te ENSEÑA los conceptos a ti, y tú validas si los entendiste.

SIEMPRE responde con JSON válido con esta estructura exacta:
{
  "texto": "tu respuesta en español, máximo 2 oraciones",
  "mascotState": "idle" | "think" | "curious" | "celebrate" | "worry" | "learning" | "putbrain",
  "conceptosAprendidos": ["lista de conceptos que el estudiante explicó correctamente"],
  "debeRegistrarAprendido": true | false,
  "esBloqueoReal": true | false
}

Reglas:
- Si el estudiante explicó bien un concepto: mascotState="celebrate", debeRegistrarAprendido=true
- Si la explicación es parcial o incorrecta: mascotState="think", haz una pregunta socrática de vuelta
- Si el estudiante hace una pregunta directa: respóndela brevemente y luego reformula tu pregunta al estudiante
- esBloqueoReal=true solo si el estudiante claramente no comprende nada después de múltiples intentos
- Nunca reveles la respuesta directamente — guía con preguntas
- texto máximo 150 caracteres`;
}
