import { createClient } from "@/infrastructure/supabase/server";
import { getMateriaBySlug, getTemaFromDB } from "@/infrastructure/content/db-reader";
import { redirect, notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { markTopicVisto } from "@/features/progress/services/actions";
import Link from "next/link";
import type { DBSeccion, DBTema } from "@/infrastructure/content/models";

interface Props {
  params: Promise<{ materia: string; slug: string[] }>;
}

type SeccionConTemas = DBSeccion & { temas: DBTema[] };

function buildSlugPath(seccion: SeccionConTemas, tema: DBTema): string {
  return seccion.slug === "__root__" ? tema.slug : `${seccion.slug}/${tema.slug}`;
}

function flattenTemas(secciones: SeccionConTemas[]): { slugPath: string; tema: DBTema; seccion: SeccionConTemas }[] {
  return secciones.flatMap((sec) =>
    sec.temas.map((tema) => ({ slugPath: buildSlugPath(sec, tema), tema, seccion: sec }))
  );
}

export default async function TopicPage({ params }: Props) {
  const { materia: materiaSlug, slug } = await params;
  const slugPath = slug.join("/");
  const temaSlug = slug[slug.length - 1];

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: materia } = await supabase
    .from("materias").select("*").eq("slug", materiaSlug).single();

  if (!materia) redirect("/dashboard");

  // Verificar acceso
  const { data: profile } = await supabase
    .from("profiles").select("rol").eq("id", user!.id).single();

  if (profile?.rol !== "profesor") {
    const { data: acceso } = await supabase
      .from("accesos")
      .select("tipo")
      .eq("user_id", user!.id)
      .eq("materia_id", materia.id)
      .single();
    if (!acceso) redirect("/dashboard");
  }

  // Obtener tema y estructura completa en paralelo
  const [tema, dbMateria] = await Promise.all([
    getTemaFromDB(materiaSlug, temaSlug),
    getMateriaBySlug(materiaSlug),
  ]);

  if (!tema || !tema.contenido_mdx) notFound();

  // Marcar como visto
  await markTopicVisto(user!.id, materia.id, slugPath);

  // Prev / next
  const allTemas = flattenTemas(dbMateria?.secciones ?? []);
  const idx = allTemas.findIndex((t) => t.slugPath === slugPath);
  const prev = idx > 0 ? allTemas[idx - 1] : null;
  const next = idx < allTemas.length - 1 ? allTemas[idx + 1] : null;

  // Nombre de sección para el header
  const seccionTitulo = allTemas[idx]?.seccion.slug !== "__root__"
    ? allTemas[idx]?.seccion.titulo
    : null;

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
        <span>/</span>
        <Link href={`/materia/${materiaSlug}`} className="hover:text-gray-300">{materia.titulo}</Link>
        <span>/</span>
        <span className="text-gray-300">{tema.titulo}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        {seccionTitulo && (
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            {seccionTitulo}
          </p>
        )}
        <h1 className="text-3xl font-bold text-white">{tema.titulo}</h1>
      </div>

      {/* Contenido MDX */}
      <article className="prose prose-invert prose-lg max-w-none
        prose-headings:text-white
        prose-p:text-gray-300
        prose-strong:text-white
        prose-code:text-brand-400
        prose-pre:bg-gray-900
        prose-pre:border prose-pre:border-gray-800">
        <MDXRemote source={tema.contenido_mdx} />
      </article>

      {/* Navegación prev/next */}
      <div className="flex justify-between mt-12 pt-6 border-t border-gray-800">
        {prev ? (
          <Link
            href={`/materia/${materiaSlug}/${prev.slugPath}`}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <span>←</span>
            <span className="text-sm">{prev.tema.titulo}</span>
          </Link>
        ) : <div />}

        {next ? (
          <Link
            href={`/materia/${materiaSlug}/${next.slugPath}`}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-sm">{next.tema.titulo}</span>
            <span>→</span>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
