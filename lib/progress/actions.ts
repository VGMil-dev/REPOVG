"use server";

import { createClient } from "@/lib/supabase/server";

export async function markTopicVisto(
  userId: string,
  materiaId: string,
  temaSlug: string
) {
  const supabase = await createClient();

  // Solo marcar si no tiene estado superior
  const { data: existing } = await supabase
    .from("topic_progress")
    .select("estado")
    .eq("user_id", userId)
    .eq("materia_id", materiaId)
    .eq("tema_slug", temaSlug)
    .single();

  // Si ya está completado, no bajamos el estado
  if (existing?.estado === "completado") return;

  await supabase.from("topic_progress").upsert(
    {
      user_id: userId,
      materia_id: materiaId,
      tema_slug: temaSlug,
      estado: "visto",
      intentos: existing?.estado ? undefined : 0,
    },
    { onConflict: "user_id,materia_id,tema_slug" }
  );
}

export async function markTopicCompletado(
  userId: string,
  materiaId: string,
  temaSlug: string,
  score: number
) {
  const supabase = await createClient();

  await supabase.from("topic_progress").upsert(
    {
      user_id: userId,
      materia_id: materiaId,
      tema_slug: temaSlug,
      estado: "completado",
      score,
      completado_at: new Date().toISOString(),
    },
    { onConflict: "user_id,materia_id,tema_slug" }
  );
}
