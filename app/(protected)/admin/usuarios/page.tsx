import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CrearUsuarioForm from "./CrearUsuarioForm";
import { Typography } from "@/components/ui/Typography";
import { Users, Mail, Shield, Zap, Dog } from "lucide-react";

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
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.1)]">
            <Users className="w-8 h-8 text-brand-500" />
          </div>
          <div>
            <Typography as="h1" variant="brand-h1" glow className="!text-3xl">Usuarios</Typography>
            <Typography variant="terminal-sm" className="mt-1 !text-brand-500/60">
              {usuarios?.length ?? 0} RECLUTAS REGISTRADOS EN EL NÚCLEO
            </Typography>
          </div>
        </div>
        <CrearUsuarioForm />
      </div>

      <div className="relative group/table card !p-0 overflow-hidden !bg-black/40 !backdrop-blur-md !border-brand-500/10">
        <div className="absolute inset-0 scanlines opacity-[0.03] pointer-events-none" />
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-brand-500/10 bg-brand-500/5">
              <th className="px-6 py-4">
                <Typography variant="terminal-sm" className="!text-brand-500/50 flex items-center gap-2">
                  <span className="w-1 h-1 bg-brand-500 rounded-full animate-blink" /> Identidad
                </Typography>
              </th>
              <th className="px-6 py-4">
                <Typography variant="terminal-sm" className="!text-brand-500/50 flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Enlace
                </Typography>
              </th>
              <th className="px-6 py-4">
                <Typography variant="terminal-sm" className="!text-brand-500/50 flex items-center gap-2">
                  <Shield className="w-3 h-3" /> Protocolo
                </Typography>
              </th>
              <th className="px-6 py-4 text-center">
                <Typography variant="terminal-sm" className="!text-brand-500/50 flex items-center gap-2 justify-center">
                  <Zap className="w-3 h-3" /> Nivel_XP
                </Typography>
              </th>
              <th className="px-6 py-4">
                <Typography variant="terminal-sm" className="!text-brand-500/50 flex items-center gap-2">
                  <Dog className="w-3 h-3" /> Avatar
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-500/5 relative z-10">
            {usuarios?.map((u) => (
              <tr key={u.id} className="group/row hover:bg-brand-500/[0.03] transition-colors">
                <td className="px-6 py-4">
                  <Typography variant="body" className="!text-white font-medium group-hover/row:!text-brand-400 transition-colors">
                    {u.nombre}
                  </Typography>
                </td>
                <td className="px-6 py-4">
                  <Typography variant="terminal-sm" className="!text-gray-500 lowercase">
                    {u.email}
                  </Typography>
                </td>
                <td className="px-6 py-4">
                  <Typography 
                    variant="pixel-badge" 
                    className={`px-3 py-1 rounded-sm border inline-block ${
                      u.rol === "profesor" ? "bg-purple-500/10 border-purple-500/30 !text-purple-400" :
                      u.rol === "estudiante" ? "bg-brand-500/10 border-brand-500/30 !text-brand-400" :
                      u.rol === "exalumno" ? "bg-blue-500/10 border-blue-500/30 !text-blue-400" :
                      "bg-gray-500/10 border-gray-500/30 !text-gray-400"
                    }`}
                  >
                    {u.rol}
                  </Typography>
                </td>
                <td className="px-6 py-4 text-center">
                  <Typography variant="body" className="!text-yellow-400 !font-pixel !text-xs">
                    {u.xp_total.toLocaleString()}
                  </Typography>
                </td>
                <td className="px-6 py-4">
                  <Typography variant="terminal-sm" className="!text-gray-500 italic">
                    {u.nombre_mascota ?? "No sincronizado"}
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
