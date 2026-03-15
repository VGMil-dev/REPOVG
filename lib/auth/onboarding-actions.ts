"use server";

import { createClient } from "@/lib/supabase/server";
import { MISION_1_REWARD, MISION_2_REWARD } from "./onboarding-constants";

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

export async function validateGithubRepo(repoUrl: string) {
  try {
    // 1. Parsear la URL → owner/repo
    const match = repoUrl
      .trim()
      .replace(/\.git$/, "")
      .match(/github\.com\/([^/]+)\/([^/]+)/);

    if (!match) throw new Error("URL inválida. Usa: https://github.com/usuario/repositorio");

    const [, owner, repo] = match;

    // 2. Verificar que el repo existe (API pública)
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 0 },
    });

    if (!repoRes.ok) {
      throw new Error(
        repoRes.status === 404
          ? "Repositorio no encontrado. ¿Es público?"
          : "Error al contactar GitHub. Intenta de nuevo."
      );
    }

    // 3. Verificar al menos 1 commit
    const commitsRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 0 },
      }
    );

    if (!commitsRes.ok || (await commitsRes.json()).length === 0) {
      throw new Error("El repo existe pero no tiene commits aún. Haz tu primer push.");
    }

    // 4. Guardar en perfil + avanzar step + recompensa
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("No autenticado");

    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("xp_total, coins, onboarding_step")
      .eq("id", user.id)
      .single();

    if (fetchError) throw fetchError;

    if (profile.onboarding_step >= 2) {
      return { success: true, alreadyClaimed: true };
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        github_username: owner,
        onboarding_step: 2,
        xp_total: (profile.xp_total ?? 0) + MISION_2_REWARD.xp,
        coins:    (profile.coins   ?? 0) + MISION_2_REWARD.coins,
      })
      .eq("id", user.id);

    if (updateError) throw updateError;

    return { success: true, alreadyClaimed: false };
  } catch (error: any) {
    console.error("GitHub Validation Error:", error);
    return { success: false, error: error.message };
  }
}
