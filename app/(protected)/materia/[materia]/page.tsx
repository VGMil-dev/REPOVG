import { createClient } from "@/lib/supabase/server";
import { getTopicsByMateria } from "@/lib/content/mdx";
import { redirect } from "next/navigation";
import Link from "next/link";

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

  // Verificar acceso
  const { data: materia } = await supabase
    .from("materias").select("*").eq("slug", materiaSlug).single();

  if (!materia) redirect("/dashboard");

  const { data: acceso } = await supabase
    .from("accesos")
    .select("tipo")
    .eq("user_id", user!.id)
    .eq("materia_id", materia.id)
    .single();

  const { data: profile } = await supabase
    .from("profiles").select("rol").eq("id", user!.id).single();

  if (!acceso && profile?.rol !== "profesor") redirect("/dashboard");

  // Obtener topics y progreso
  const topics = getTopicsByMateria(materiaSlug);

  const { data: progreso } = await supabase
    .from("topic_progress")
    .select("*")
    .eq("user_id", user!.id)
    .eq("materia_id", materia.id);

  const progresoMap = new Map(progreso?.map((p) => [p.tema_slug, p.estado]) ?? []);

  // Agrupar por sección
  const sections = new Map<string, typeof topics>();
  for (const topic of topics) {
    const sec = topic.frontmatter.seccion;
    if (!sections.has(sec)) sections.set(sec, []);
    sections.get(sec)!.push(topic);
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link href="/dashboard" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
          ← Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2">{materia.titulo}</h1>
        <p className="text-gray-400 text-sm">{materia.descripcion}</p>
      </div>

      {topics.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-4xl mb-3">🚧</p>
          <p className="text-gray-400">El contenido de esta materia está siendo preparado.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Array.from(sections.entries()).map(([seccion, temas]) => (
            <div key={seccion}>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {seccion}
              </h2>
              <div className="space-y-2">
                {temas.map((topic) => {
                  const estado = progresoMap.get(topic.slugPath) ?? "disponible";
                  const cfg = ESTADO_CONFIG[estado as keyof typeof ESTADO_CONFIG] ?? ESTADO_CONFIG.disponible;
                  const bloqueado = estado === "bloqueado";

                  return (
                    <Link
                      key={topic.slugPath}
                      href={bloqueado ? "#" : `/materia/${materiaSlug}/${topic.slugPath}`}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                        bloqueado
                          ? "border-gray-800 cursor-not-allowed opacity-50"
                          : `border-gray-800 hover:border-brand-500 ${cfg.bg} cursor-pointer`
                      }`}
                    >
                      <span className="text-lg">{cfg.icon}</span>
                      <div className="flex-1">
                        <span className={`font-medium ${bloqueado ? "text-gray-600" : "text-white"}`}>
                          {topic.frontmatter.titulo}
                        </span>
                      </div>
                      <span className="text-xs text-gray-600">
                        {"⭐".repeat(topic.frontmatter.dificultad)}
                      </span>
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
