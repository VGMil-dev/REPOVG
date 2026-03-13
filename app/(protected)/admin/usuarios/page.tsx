import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CrearUsuarioForm from "./CrearUsuarioForm";

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Usuarios 👥</h1>
          <p className="text-gray-400 text-sm mt-1">{usuarios?.length ?? 0} usuarios registrados</p>
        </div>
        <CrearUsuarioForm />
      </div>

      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-800">
              <th className="pb-3 font-medium">Nombre</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Rol</th>
              <th className="pb-3 font-medium">XP</th>
              <th className="pb-3 font-medium">Mascota</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {usuarios?.map((u) => (
              <tr key={u.id} className="text-gray-300">
                <td className="py-3 font-medium text-white">{u.nombre}</td>
                <td className="py-3 text-gray-400">{u.email}</td>
                <td className="py-3">
                  <span className={`badge ${
                    u.rol === "profesor" ? "bg-purple-500/20 text-purple-400" :
                    u.rol === "estudiante" ? "bg-brand-500/20 text-brand-400" :
                    u.rol === "exalumno" ? "bg-green-500/20 text-green-400" :
                    "bg-gray-500/20 text-gray-400"
                  }`}>
                    {u.rol}
                  </span>
                </td>
                <td className="py-3 text-yellow-400">{u.xp_total}</td>
                <td className="py-3 text-gray-400">{u.nombre_mascota ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
