import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AsignarAccesoForm from "./AsignarAccesoForm";
import AccesoList from "./AccesoList";
import { Typography } from "@/components/ui/Typography";
import { Key } from "lucide-react";

export default async function AccesosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("rol").eq("id", user.id).single();

  if (profile?.rol !== "profesor") redirect("/dashboard");

  const [{ data: accesos }, { data: usuarios }, { data: materias }, { data: semestres }] =
    await Promise.all([
      supabase.from("accesos").select("*, profile:profiles!user_id(nombre, email), materia:materias(titulo)").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, nombre, email").neq("rol", "profesor"),
      supabase.from("materias").select("id, titulo"),
      supabase.from("semestres").select("id, nombre").eq("activo", true),
    ]);

  return (
    <div className="max-w-5xl space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.1)]">
            <Key className="w-8 h-8 text-brand-500" />
          </div>
          <div>
            <Typography as="h1" variant="brand-h1" glow className="!text-3xl">Control de Accesos</Typography>
            <Typography variant="terminal-sm" className="mt-1 !text-brand-500/60 uppercase">
              Gestión de Permisos y Autorizaciones de Materias
            </Typography>
          </div>
        </div>
        <AsignarAccesoForm
          usuarios={usuarios ?? []}
          materias={materias ?? []}
          semestres={semestres ?? []}
        />
      </div>

      <AccesoList 
        initialAccesos={(accesos as any) ?? []} 
        materias={materias ?? []} 
      />
    </div>
  );
}
