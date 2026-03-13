import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, accesos(*, materia:materias(*))")
    .eq("id", user!.id)
    .single();

  const accesos = profile?.accesos ?? [];
  const materiasActivas = accesos.filter((a: { tipo: string }) => a.tipo === "activo");

  if (profile?.rol === "profesor") {
    return <ProfesorDashboard />;
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-2">
        ¡Hola, {profile?.nombre_mascota ?? profile?.nombre}! 👋
      </h1>
      <p className="text-gray-400 mb-8">Aquí están tus materias activas.</p>

      {materiasActivas.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-gray-400">
            Aún no tienes materias asignadas. Pide a tu profesor que te agregue.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materiasActivas.map((acceso: {
            id: string;
            materia: { slug: string; titulo: string; descripcion: string; color: string } | null;
          }) => (
            <Link
              key={acceso.id}
              href={`/materia/${acceso.materia?.slug}`}
              className="card hover:border-brand-500 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: acceso.materia?.color + "22" }}
                >
                  {acceso.materia?.slug === "java" ? "☕" : "📱"}
                </div>
                <div>
                  <h2 className="font-semibold text-white group-hover:text-brand-400 transition-colors">
                    {acceso.materia?.titulo}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {acceso.materia?.descripcion}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfesorDashboard() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-2">Panel del profesor 🎓</h1>
      <p className="text-gray-400 mb-8">Gestiona usuarios, accesos y contenido.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: "/admin/usuarios", icon: "👥", label: "Usuarios", desc: "Ver y crear cuentas" },
          { href: "/admin/accesos", icon: "🔑", label: "Accesos", desc: "Asignar materias" },
          { href: "/admin/contenido", icon: "📝", label: "Contenido", desc: "Subir temas MDX" },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="card hover:border-brand-500 transition-colors group">
            <div className="text-3xl mb-3">{item.icon}</div>
            <h2 className="font-semibold text-white group-hover:text-brand-400 transition-colors">
              {item.label}
            </h2>
            <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
