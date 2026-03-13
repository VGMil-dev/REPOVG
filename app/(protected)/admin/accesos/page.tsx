import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AsignarAccesoForm from "./AsignarAccesoForm";

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Accesos 🔑</h1>
          <p className="text-gray-400 text-sm mt-1">Asigna materias a estudiantes</p>
        </div>
        <AsignarAccesoForm
          usuarios={usuarios ?? []}
          materias={materias ?? []}
          semestres={semestres ?? []}
        />
      </div>

      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-800">
              <th className="pb-3 font-medium">Usuario</th>
              <th className="pb-3 font-medium">Materia</th>
              <th className="pb-3 font-medium">Tipo</th>
              <th className="pb-3 font-medium">Asignado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {accesos?.map((a) => (
              <tr key={a.id} className="text-gray-300">
                <td className="py-3">
                  <div className="font-medium text-white">{(a.profile as { nombre: string; email: string })?.nombre}</div>
                  <div className="text-xs text-gray-500">{(a.profile as { nombre: string; email: string })?.email}</div>
                </td>
                <td className="py-3">{(a.materia as { titulo: string })?.titulo}</td>
                <td className="py-3">
                  <span className={`badge ${a.tipo === "activo" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                    {a.tipo}
                  </span>
                </td>
                <td className="py-3 text-gray-500 text-xs">
                  {new Date(a.created_at).toLocaleDateString("es")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
