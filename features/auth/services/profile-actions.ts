"use server";

import { createClient } from "@/infrastructure/supabase/server";

export async function updateGeminiKey(apiKey: string) {
  try {
    const trimmed = apiKey.trim();

    if (!trimmed) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");
      await supabase.from("profiles").update({ gemini_api_key_enc: null }).eq("id", user.id);
      return { success: true };
    }

    // Validar contra Gemini antes de guardar
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${trimmed}`
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "API Key no válida");
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const { error } = await supabase
      .from("profiles")
      .update({ gemini_api_key_enc: trimmed })
      .eq("id", user.id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
