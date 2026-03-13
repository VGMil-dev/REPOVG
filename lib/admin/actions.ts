"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Rol, AccesoTipo } from "@/types";

// Crea un usuario nuevo (solo profesor)
export async function crearUsuario(formData: FormData) {
  const supabase = await createClient();

  // Verificar que es profesor
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const { data: prof } = await supabase
    .from("profiles")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (prof?.rol !== "profesor") return { error: "Sin permisos" };

  const email = formData.get("email") as string;
  const nombre = formData.get("nombre") as string;
  const rol = formData.get("rol") as Rol;
  const password = formData.get("password") as string;

  // Crear en Supabase Auth usando service role
  const adminClient = await createAdminClient();
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nombre, rol },
  });

  if (authError) return { error: authError.message };

  revalidatePath("/admin/usuarios");
  return { success: true };
}

// Asigna acceso a materia
export async function asignarAcceso(formData: FormData) {
  const supabase = await createClient();

  const user_id = formData.get("user_id") as string;
  const materia_id = formData.get("materia_id") as string;
  const tipo = formData.get("tipo") as AccesoTipo;
  const semestre_id = formData.get("semestre_id") as string | null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const { error } = await supabase.from("accesos").upsert(
    {
      user_id,
      materia_id,
      tipo,
      semestre_id: semestre_id || null,
      asignado_por: user.id,
    },
    { onConflict: "user_id,materia_id" }
  );

  if (error) return { error: error.message };

  revalidatePath("/admin/accesos");
  return { success: true };
}

// Helper: cliente con service role para admin operations
async function createAdminClient() {
  const { createClient: createSupabase } = await import("@supabase/supabase-js");
  return createSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
