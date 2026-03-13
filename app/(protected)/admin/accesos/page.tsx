import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AsignarAccesoForm from "./AsignarAccesoForm";
import { Typography } from "@/components/ui/Typography";
import { Key, User, BookOpen, Clock, Shield } from "lucide-react";

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
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-10">
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

      <div className="relative group/table card !p-0 overflow-hidden !bg-black/40 !backdrop-blur-md !border-brand-500/10">
        <div className="absolute inset-0 scanlines opacity-[0.03] pointer-events-none" />
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-brand-500/10 bg-brand-500/5">
              <th className="px-6 py-4">
                <Typography variant="terminal-sm" className="!text-brand-500/50 flex items-center gap-2">
                  <User className="w-3 h-3" /> Usuario
                </Typography>
              </th>
              <th className="px-6 py-4">
                <Typography variant="terminal-sm" className="!text-brand-500/50 flex items-center gap-2">
                  <BookOpen className="w-3 h-3" /> Materia
                </Typography>
              </th>
              <th className="px-6 py-4">
                <Typography variant="terminal-sm" className="!text-brand-500/50 flex items-center gap-2">
                  <Shield className="w-3 h-3" /> Estado del Enlace
                </Typography>
              </th>
              <th className="px-6 py-4">
                <Typography variant="terminal-sm" className="!text-brand-500/50 flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Fecha de Registro
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-500/5 relative z-10">
            {accesos?.map((a) => (
              <tr key={a.id} className="group/row hover:bg-brand-500/[0.03] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <Typography variant="body" className="!text-white font-medium group-hover/row:!text-brand-400 transition-colors">
                      {(a.profile as any)?.nombre}
                    </Typography>
                    <Typography variant="terminal-sm" className="!text-gray-500 lowercase">
                      {(a.profile as any)?.email}
                    </Typography>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Typography variant="body-sm" className="!text-gray-300">
                    {(a.materia as any)?.titulo}
                  </Typography>
                </td>
                <td className="px-6 py-4">
                  <Typography 
                    variant="pixel-badge" 
                    className={`px-3 py-1 rounded-sm border inline-block ${
                      a.tipo === "activo" ? "bg-brand-500/10 border-brand-500/30 !text-brand-400" : "bg-gray-500/10 border-gray-500/30 !text-gray-400"
                    }`}
                  >
                    {a.tipo === "activo" ? "SINCRONIZADO" : "HISTÓRICO"}
                  </Typography>
                </td>
                <td className="px-6 py-4">
                  <Typography variant="terminal-sm" className="!text-gray-500">
                    {new Date(a.created_at).toLocaleDateString("es", {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
