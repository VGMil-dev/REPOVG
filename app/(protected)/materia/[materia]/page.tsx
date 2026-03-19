import { createClient } from "@/infrastructure/supabase/server";
import { getMateriaBySlug } from "@/infrastructure/content/db-reader";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Typography } from "@/components/ui/Typography";

interface Props {
  params: Promise<{ materia: string }>;
}

const ESTADO_CONFIG = {
  bloqueado: { icon: "🔒", color: "text-gray-600", bg: "bg-gray-800" },
  disponible: { icon: "🔵", color: "text-blue-400", bg: "bg-blue-500/10" },
  visto: { icon: "👁", color: "text-yellow-400", bg: "bg-yellow-500/10" },
  completado: { icon: "✅", color: "text-green-400", bg: "bg-green-500/10" },
};

export default async function MateriaPage({ params }: Props) {
  const { materia: materiaSlug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verificar acceso
  const { data: materia } = await supabase
    .from("materias").select("*").eq("slug", materiaSlug).single();

  if (!materia) redirect("/dashboard");

  const { data: acceso } = await supabase
    .from("accesos")
    .select("tipo")
    .eq("user_id", user.id)
    .eq("materia_id", materia.id)
    .single();

  const { data: profile } = await supabase
    .from("profiles").select("rol").eq("id", user.id).single();

  if (!acceso && profile?.rol !== "profesor") redirect("/dashboard");

  // Obtener contenido desde DB y progreso
  const [dbMateria, progresoRes] = await Promise.all([
    getMateriaBySlug(materiaSlug),
    supabase.from("topic_progress").select("*").eq("user_id", user.id).eq("materia_id", materia.id),
  ]);

  const progresoMap = new Map(progresoRes.data?.map((p) => [p.tema_slug, p.estado]) ?? []);
  const secciones = dbMateria?.secciones ?? [];
  const totalTemas = secciones.reduce((acc, s) => acc + s.temas.length, 0);

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link href="/dashboard" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
          <Typography variant="terminal-sm" as="span">← Dashboard</Typography>
        </Link>
        <Typography as="h1" variant="brand-h2" className="mt-2 !text-white">{materia.titulo}</Typography>
        <Typography variant="body-sm">{materia.descripcion}</Typography>
      </div>

      {totalTemas === 0 ? (
        <div className="card text-center py-12">
          <Typography variant="brand-h1" className="mb-3">🚧</Typography>
          <Typography variant="body">El contenido de esta materia está siendo preparado.</Typography>
        </div>
      ) : (
        <div className="space-y-8">
          {secciones.map((seccion) => (
            <div key={seccion.id}>
              {seccion.slug !== "__root__" && (
                <Typography variant="terminal-sm" as="h2" className="font-semibold !text-gray-500 uppercase tracking-wider mb-3">
                  {seccion.titulo}
                </Typography>
              )}
              <div className="space-y-2">
                {seccion.temas.map((tema) => {
                  const slugPath = seccion.slug === "__root__"
                    ? tema.slug
                    : `${seccion.slug}/${tema.slug}`;
                  const estado = progresoMap.get(slugPath) ?? "disponible";
                  const cfg = ESTADO_CONFIG[estado as keyof typeof ESTADO_CONFIG] ?? ESTADO_CONFIG.disponible;
                  const bloqueado = estado === "bloqueado";

                  return (
                    <Link
                      key={tema.id}
                      href={bloqueado ? "#" : `/materia/${materiaSlug}/${slugPath}`}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                        bloqueado
                          ? "border-gray-800 cursor-not-allowed opacity-50"
                          : `border-gray-800 hover:border-brand-500 ${cfg.bg} cursor-pointer`
                      }`}
                    >
                      <Typography as="span" variant="body-lg">{cfg.icon}</Typography>
                      <div className="flex-1">
                        <Typography as="span" variant="body" className={`font-medium ${bloqueado ? "!text-gray-600" : "!text-white"}`}>
                          {tema.titulo}
                        </Typography>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
