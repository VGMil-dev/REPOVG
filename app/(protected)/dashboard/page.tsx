import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Typography } from "@/components/ui/Typography";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <Typography className="text-white">Cargando...</Typography>;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, accesos!user_id(*, materia:materias(*))")
    .eq("id", user.id)
    .single();

  if (profile?.rol === "profesor") {
    redirect("/admin");
  }

  const accesos = profile?.accesos ?? [];
  const materiasActivas = accesos.filter((a: { tipo: string }) => a.tipo === "activo");

  return (
    <div className="max-w-4xl">
      <Typography as="h1" variant="brand-h2" className="mb-2 !text-white">
        ¡Hola, {profile?.nombre_mascota ?? profile?.nombre}! 👋
      </Typography>
      <Typography variant="body" className="mb-8">Aquí están tus materias activas.</Typography>

      {materiasActivas.length === 0 ? (
        <div className="card text-center py-12">
          <Typography variant="brand-h1" className="mb-3">📭</Typography>
          <Typography variant="body">
            Aún no tienes materias asignadas. Pide a tu profesor que te agregue.
          </Typography>
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
                  <Typography variant="body" as="h2" className="font-semibold !text-white group-hover:!text-brand-400 transition-colors">
                    {acceso.materia?.titulo}
                  </Typography>
                  <Typography variant="body-sm" className="mt-1">
                    {acceso.materia?.descripcion}
                  </Typography>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
