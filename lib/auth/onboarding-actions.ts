"use server";

import { createClient } from "@/lib/supabase/server";

export async function validateGeminiKey(apiKey: string) {
  try {
    // 1. Validar contra el endpoint de Gemini (Listar modelos es un health-check genérico)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "API Key no válida");
    }

    // 2. Si es válida, guardarla en el perfil del usuario (Supabase)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("No autenticado");

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ 
        gemini_api_key_enc: apiKey, // TODO: Encriptar en el futuro si es necesario
        onboarding_step: 1 // Avanzamos al siguiente paso (Misión 2)
      })
      .eq("id", user.id);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error: any) {
    console.error("Gemini Validation Error:", error);
    return { success: false, error: error.message };
  }
}
