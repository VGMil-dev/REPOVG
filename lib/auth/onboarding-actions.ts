"use server";

import { createClient } from "@/lib/supabase/server";
import { MISION_1_REWARD } from "./onboarding-constants";

export async function validateGeminiKey(apiKey: string) {
  try {
    // 1. Validar contra el endpoint de Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "API Key no válida");
    }

    // 2. Guardar key + avanzar step + sumar XP y monedas
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("No autenticado");

    // Leer valores actuales para incrementar
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("xp_total, coins, onboarding_step")
      .eq("id", user.id)
      .single();

    if (fetchError) throw fetchError;

    // Evitar doble recompensa si ya completó la misión
    if (profile.onboarding_step >= 1) {
      return { success: true, alreadyClaimed: true };
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        gemini_api_key_enc: apiKey,
        onboarding_step: 1,
        xp_total: (profile.xp_total ?? 0) + MISION_1_REWARD.xp,
        coins: (profile.coins ?? 0) + MISION_1_REWARD.coins,
      })
      .eq("id", user.id);

    if (updateError) throw updateError;

    return { success: true, alreadyClaimed: false };
  } catch (error: any) {
    console.error("Gemini Validation Error:", error);
    return { success: false, error: error.message };
  }
}
