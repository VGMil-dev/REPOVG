import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CrearUsuarioForm from "./CrearUsuarioForm";
import UserList from "./UserList";
import { Typography } from "@/components/ui/Typography";
import { Users } from "lucide-react";

export default async function UsuariosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("rol").eq("id", user.id).single();

  if (profile?.rol !== "profesor") redirect("/dashboard");

  const { data: usuarios } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-5xl space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.1)]">
            <Users className="w-8 h-8 text-brand-500" />
          </div>
          <div>
            <Typography as="h1" variant="brand-h1" glow className="!text-3xl">Usuarios</Typography>
            <Typography variant="terminal-sm" className="mt-1 !text-brand-500/60 uppercase">
              {usuarios?.length ?? 0} RECLUTAS REGISTRADOS EN EL NÚCLEO
            </Typography>
          </div>
        </div>
        <CrearUsuarioForm />
      </div>

      <UserList initialUsers={(usuarios as any) ?? []} />
    </div>
  );
}
