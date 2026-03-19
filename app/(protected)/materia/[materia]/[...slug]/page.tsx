import { createClient } from "@/infrastructure/supabase/server";
import { getTopic, getTopicsByMateria } from "@/infrastructure/content/mdx";
import { redirect, notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { markTopicVisto } from "@/features/progress/services/actions";
import Link from "next/link";

interface Props {
  params: Promise<{ materia: string; slug: string[] }>;
}

export default async function TopicPage({ params }: Props) {
  const { materia: materiaSlug, slug } = await params;
  const slugPath = slug.join("/");

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

  const topic = getTopic(materiaSlug, slugPath);
  if (!topic) notFound();

  // Marcar como visto (server action)
  await markTopicVisto(user!.id, materia.id, slugPath);

  // Navegación prev/next
  const allTopics = getTopicsByMateria(materiaSlug);
  const idx = allTopics.findIndex((t) => t.slugPath === slugPath);
  const prev = idx > 0 ? allTopics[idx - 1] : null;
  const next = idx < allTopics.length - 1 ? allTopics[idx + 1] : null;

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
        <span>/</span>
        <Link href={`/materia/${materiaSlug}`} className="hover:text-gray-300">{materia.titulo}</Link>
        <span>/</span>
        <span className="text-gray-300">{topic.frontmatter.titulo}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
          {topic.frontmatter.seccion}
        </p>
        <h1 className="text-3xl font-bold text-white">{topic.frontmatter.titulo}</h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-gray-500">
            Dificultad: {"⭐".repeat(topic.frontmatter.dificultad)}
          </span>
        </div>
      </div>

      {/* Contenido MDX */}
      <article className="prose prose-invert prose-lg max-w-none
        prose-headings:text-white
        prose-p:text-gray-300
        prose-strong:text-white
        prose-code:text-brand-400
        prose-pre:bg-gray-900
        prose-pre:border prose-pre:border-gray-800">
        <MDXRemote source={topic.content} />
      </article>

      {/* Navegación prev/next */}
      <div className="flex justify-between mt-12 pt-6 border-t border-gray-800">
        {prev ? (
          <Link
            href={`/materia/${materiaSlug}/${prev.slugPath}`}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <span>←</span>
            <span className="text-sm">{prev.frontmatter.titulo}</span>
          </Link>
        ) : <div />}

        {next ? (
          <Link
            href={`/materia/${materiaSlug}/${next.slugPath}`}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-sm">{next.frontmatter.titulo}</span>
            <span>→</span>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
