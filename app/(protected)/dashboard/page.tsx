import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, ChevronRight, Star, Coins, TrendingUp, Lock } from "lucide-react";
import { Typography } from "@/components/ui/Typography";
import { MascotDashboardSync } from "@/components/mascot/MascotDashboardSync";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, accesos!user_id(id, tipo, materia:materias(id, slug, titulo, descripcion, color))")
    .eq("id", user.id)
    .single();

  if (profile?.rol === "profesor") redirect("/admin");

  const { data: progresoRaw } = await supabase
    .from("topic_progress")
    .select("materia_id, estado")
    .eq("user_id", user.id);

  // Agrupar progreso por materia
  const progresoMap: Record<string, { completados: number; vistos: number }> = {};
  for (const p of progresoRaw ?? []) {
    if (!progresoMap[p.materia_id]) progresoMap[p.materia_id] = { completados: 0, vistos: 0 };
    if (p.estado === "completado") progresoMap[p.materia_id].completados++;
    if (p.estado === "visto" || p.estado === "completado") progresoMap[p.materia_id].vistos++;
  }

  const accesos = profile?.accesos ?? [];
  const materiasActivas = accesos.filter((a: { tipo: string }) => a.tipo === "activo");

  // XP / nivel — curva triangular: nivel n requiere 250*n*(n+1)/2 XP acumulados
  // Nivel 2 = 500 XP, Nivel 3 = 1500 XP, Nivel 4 = 3000 XP...
  const xp    = profile?.xp_total ?? 0;
  const coins = profile?.coins ?? 0;

  function calcNivel(totalXp: number) {
    let n = 0;
    while (250 * (n + 1) * (n + 2) / 2 <= totalXp) n++;
    const xpInicio = 250 * n * (n + 1) / 2;
    const xpFin    = 250 * (n + 1) * (n + 2) / 2;
    return {
      nivel:     n + 1,
      xpEnNivel: totalXp - xpInicio,
      xpParaSig: xpFin - xpInicio,
    };
  }

  const { nivel, xpEnNivel, xpParaSig } = calcNivel(xp);
  const nombre  = profile?.nombre_mascota ?? profile?.nombre ?? "Estudiante";

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <MascotDashboardSync mascotName={profile?.nombre_mascota ?? nombre} />

      {/* ── Encabezado ──────────────────────────────────────────────────────── */}
      <div className="space-y-1 pt-2">
        <Typography variant="pixel-badge" className="!text-brand-500/50 uppercase">
          Bienvenido de vuelta
        </Typography>
        <Typography as="h1" variant="brand-h2" className="!text-white">
          {nombre.toUpperCase()}
        </Typography>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {/* Nivel */}
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Nivel</span>
            <TrendingUp className="w-4 h-4 text-brand-500/60" />
          </div>
          <Typography variant="brand-h3" className="!text-brand-400">
            {nivel}
          </Typography>
          {/* Barra de progreso XP */}
          <div className="space-y-1">
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all"
                style={{ width: `${Math.round((xpEnNivel / xpParaSig) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-gray-600">{xpEnNivel} / {xpParaSig} XP</span>
          </div>
        </div>

        {/* XP Total */}
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">XP Total</span>
            <Star className="w-4 h-4 text-yellow-500/60" />
          </div>
          <Typography variant="brand-h3" className="!text-yellow-400">
            {xp.toLocaleString()}
          </Typography>
          <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">puntos acumulados</span>
        </div>

        {/* Monedas */}
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Monedas</span>
            <Coins className="w-4 h-4 text-orange-500/60" />
          </div>
          <Typography variant="brand-h3" className="!text-orange-400">
            {coins.toLocaleString()}
          </Typography>
          <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">disponibles</span>
        </div>
      </div>

      {/* ── Materias ─────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-4 h-4 text-gray-500" />
          <Typography variant="pixel-badge" className="!text-gray-500 uppercase tracking-widest">
            Materias activas
          </Typography>
          <div className="flex-1 h-px bg-white/5" />
          <span className="font-mono text-[10px] text-gray-600">{materiasActivas.length} asignadas</span>
        </div>

        {materiasActivas.length === 0 ? (
          <div className="border border-white/5 bg-black/20 rounded-xl p-10 flex flex-col items-center gap-3">
            <Lock className="w-8 h-8 text-gray-700" />
            <Typography variant="terminal-sm" className="!text-gray-600 uppercase text-center">
              Sin materias asignadas
            </Typography>
            <Typography variant="body-sm" className="text-gray-700 text-center max-w-xs">
              Tu profesor aún no te ha asignado ninguna materia. Contacta con él para comenzar.
            </Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {materiasActivas.map((acceso: {
              id: string;
              materia: { id: string; slug: string; titulo: string; descripcion: string; color: string } | null;
            }) => {
              const materia = acceso.materia;
              if (!materia) return null;
              const prog = progresoMap[materia.id] ?? { completados: 0, vistos: 0 };

              return (
                <Link
                  key={acceso.id}
                  href={`/materia/${materia.slug}`}
                  className="group relative bg-black/40 border border-white/5 hover:border-white/15 rounded-xl p-5 transition-all duration-200 overflow-hidden"
                >
                  {/* Acento de color izquierdo */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl"
                    style={{ backgroundColor: materia.color }}
                  />

                  {/* Brillo sutil al hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                    style={{ background: `radial-gradient(ellipse at top left, ${materia.color}08 0%, transparent 60%)` }}
                  />

                  <div className="relative flex flex-col gap-3">
                    {/* Header de la card */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <Typography
                          variant="brand-h4"
                          as="h2"
                          className="!text-white group-hover:!text-brand-400 transition-colors"
                        >
                          {materia.titulo}
                        </Typography>
                        <Typography variant="body-sm" className="!text-gray-600 leading-snug">
                          {materia.descripcion}
                        </Typography>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                    </div>

                    {/* Progreso si hay datos */}
                    {prog.vistos > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, (prog.completados / Math.max(prog.vistos, 1)) * 100)}%`,
                              backgroundColor: materia.color,
                            }}
                          />
                        </div>
                        <span className="font-mono text-[10px] text-gray-600 whitespace-nowrap">
                          {prog.completados} completados
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
