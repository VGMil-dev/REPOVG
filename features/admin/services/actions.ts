"use server";

import { createClient, createAdminClient } from "@/infrastructure/supabase/server";
import { revalidatePath } from "next/cache";
import type { Rol } from "@/features/auth/models/auth";
import type { AccesoTipo } from "@/features/admin/models/admin";

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
  const adminClient = createAdminClient();
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

// Revoca acceso a materia
export async function revocarAcceso(accesoId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("accesos").delete().eq("id", accesoId);
  if (error) return { error: error.message };
  revalidatePath("/admin/accesos");
  return { success: true };
}

// Cambia el tipo de acceso (activo/historico)
export async function cambiarTipoAcceso(accesoId: string, tipo: AccesoTipo) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("accesos")
    .update({ tipo })
    .eq("id", accesoId);
  if (error) return { error: error.message };
  revalidatePath("/admin/accesos");
  return { success: true };
}

// Elimina usuario (solo profesor)
export async function eliminarUsuario(userId: string) {
  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.deleteUser(userId);
  if (error) return { error: error.message };
  revalidatePath("/admin/usuarios");
  return { success: true };
}
