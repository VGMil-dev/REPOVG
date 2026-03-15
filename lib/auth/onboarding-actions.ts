"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { MISION_1_REWARD, MISION_2_REWARD, MISION_3_REWARD, MASCOT_SPRITES } from "./onboarding-constants";
import type { MascotSpriteSlug } from "./onboarding-constants";

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

export async function completarMision3(mascotName: string, mascotSprite: string) {
  try {
    // 1. Validar inputs
    const trimmedName = mascotName.trim();
    if (!trimmedName || trimmedName.length > 20) {
      throw new Error("El nombre debe tener entre 1 y 20 caracteres.");
    }
    if (!(MASCOT_SPRITES as readonly string[]).includes(mascotSprite)) {
      throw new Error("Variante de sprite no válida.");
    }
    const sprite = mascotSprite as MascotSpriteSlug;

    // 2. Usuario actual
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    // 3. Leer perfil
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("xp_total, coins, onboarding_step")
      .eq("id", user.id)
      .single();

    if (fetchError) throw fetchError;

    // 4. Guard doble recompensa
    if (profile.onboarding_step >= 3) {
      return { success: true, alreadyClaimed: true };
    }

    // 5. Usar adminClient para operaciones que requieren service_role
    const admin = createAdminClient();

    // Obtener IDs de achievement y cosmético
    const [{ data: achievement }, { data: cosmetic }] = await Promise.all([
      admin.from("achievements").select("id").eq("slug", "mascota_activada").single(),
      admin.from("cosmetics").select("id").eq("slug", "badge_protocolo_vinculacion").single(),
    ]);

    // 6. Actualizar perfil
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        nombre_mascota:  trimmedName,
        mascot_sprite:   sprite,
        mascot_cosmetic: "badge_protocolo_vinculacion",
        onboarding_step: 3,
        xp_total: (profile.xp_total ?? 0) + MISION_3_REWARD.xp,
        coins:    (profile.coins   ?? 0) + MISION_3_REWARD.coins,
      })
      .eq("id", user.id);

    if (updateError) throw updateError;

    // 7. Registrar achievement y cosmético (vía adminClient para bypassear RLS)
    if (achievement?.id) {
      await admin
        .from("user_achievements")
        .insert({ user_id: user.id, achievement_id: achievement.id })
        .throwOnError();
    }

    if (cosmetic?.id) {
      await admin
        .from("user_cosmetics")
        .insert({ user_id: user.id, cosmetic_id: cosmetic.id, equipado: true })
        .throwOnError();
    }

    // 8. Registrar en xp_log
    await admin
      .from("xp_log")
      .insert({
        user_id:      user.id,
        cantidad_xp:    MISION_3_REWARD.xp,
        cantidad_coins: MISION_3_REWARD.coins,
        motivo:       "mision_3_completada",
      });

    return { success: true, alreadyClaimed: false };
  } catch (error: any) {
    console.error("Mision3 Error:", error);
    return { success: false, error: error.message };
  }
}
