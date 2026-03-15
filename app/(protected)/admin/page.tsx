import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Key, BookOpen, Settings, BarChart3, Shield, ArrowRight, MessageSquare } from "lucide-react";
import { AdminTemplate } from "@/components/templates/AdminTemplate";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("rol").eq("id", user.id).single();

  if (profile?.rol !== "profesor") redirect("/dashboard");

  const menuItems = [
    {
      href: "/admin/usuarios",
      icon: Users,
      label: "Usuarios",
      desc: "GESTIONAR RECLUTAS Y SUS PERFILES ACADÉMICOS",
      color: "text-brand-500",
      borderColor: "border-brand-500/20",
      hoverBorder: "hover:border-brand-500/50",
      glow: "shadow-[0_0_20px_rgba(34,197,94,0.05)]",
      hoverGlow: "group-hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]",
      accent: "bg-brand-500/10"
    },
    {
      href: "/admin/accesos",
      icon: Key,
      label: "Accesos",
      desc: "ASIGNAR MATERIAS, PERMISOS Y ROLES",
      color: "text-orange-500",
      borderColor: "border-orange-500/20",
      hoverBorder: "hover:border-orange-500/50",
      glow: "shadow-[0_0_20px_rgba(249,115,22,0.05)]",
      hoverGlow: "group-hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]",
      accent: "bg-orange-500/10"
    },
    {
      href: "/admin/contenido",
      icon: BookOpen,
      label: "Contenido",
      desc: "SUBIR TEMAS MDX, EVALUACIONES Y RECURSOS",
      color: "text-brand-500",
      borderColor: "border-brand-500/20",
      hoverBorder: "hover:border-brand-500/50",
      glow: "shadow-[0_0_20px_rgba(34,197,94,0.05)]",
      hoverGlow: "group-hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]",
      accent: "bg-brand-500/10"
    },
    {
      href: "/admin/analytics",
      icon: BarChart3,
      label: "Métricas",
      desc: "VER PROGRESO GLOBAL Y ESTADÍSTICAS DE APRENDIZAJE",
      color: "text-orange-500",
      borderColor: "border-orange-500/20",
      hoverBorder: "hover:border-orange-500/50",
      glow: "shadow-[0_0_20px_rgba(249,115,22,0.05)]",
      hoverGlow: "group-hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]",
      accent: "bg-orange-500/10"
    },
    {
      href: "/admin/seguridad",
      icon: Shield,
      label: "Seguridad",
      desc: "REVISAR LOGS DE ACTIVIDAD Y POLÍTICAS",
      color: "text-brand-500",
      borderColor: "border-brand-500/20",
      hoverBorder: "hover:border-brand-500/50",
      glow: "shadow-[0_0_20px_rgba(34,197,94,0.05)]",
      hoverGlow: "group-hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]",
      accent: "bg-brand-500/10"
    },
    {
      href: "/admin/mascota",
      icon: MessageSquare,
      label: "Mascota",
      desc: "LABORATORIO DE PRUEBAS PARA ANIMACIONES Y MENSAJES",
      color: "text-orange-500",
      borderColor: "border-orange-500/20",
      hoverBorder: "hover:border-orange-500/50",
      glow: "shadow-[0_0_20px_rgba(249,115,22,0.05)]",
      hoverGlow: "group-hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]",
      accent: "bg-orange-500/10"
    },
    {
      href: "/admin/configuracion",
      icon: Settings,
      label: "Ajustes",
      desc: "CONFIGURACIÓN GENERAL DEL SISTEMA Y CURSOS",
      color: "text-orange-500",
      borderColor: "border-orange-500/20",
      hoverBorder: "hover:border-orange-500/50",
      glow: "shadow-[0_0_20px_rgba(249,115,22,0.05)]",
      hoverGlow: "group-hover:shadow-[0_0_30_rgba(249,115,22,0.15)]",
      accent: "bg-orange-500/10"
    },
  ];

  return (
    <AdminTemplate
      title=""
      subtitle=""
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-min max-w-4xl">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`group relative overflow-hidden bg-black border ${item.borderColor} ${item.hoverBorder} p-6 aspect-square flex flex-col justify-between transition-all duration-500 ${item.glow} ${item.hoverGlow}`}
          >
            {/* Subtle radial gradient background */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 ${item.accent}`} />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-lg bg-white/5 border border-white/10 group-hover:border-brand-500/30 transition-colors`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className={`w-1.5 h-1.5 rounded-full ${item.color === 'text-brand-500' ? 'bg-brand-500/40' : 'bg-orange-500/40'} animate-pulse`} />
              </div>

              <h2 className="text-sm lg:text-base font-pixel text-white mb-2 tracking-tight group-hover:text-brand-400 transition-colors uppercase">
                {item.label}
              </h2>
              <p className="font-terminal text-white/80 text-sm tracking-wider leading-relaxed line-clamp-3 uppercase">
                {item.desc}
              </p>
            </div>

            <div className="relative z-10 flex justify-between items-center mt-3 pt-3 border-t border-white/5 group-hover:border-brand-500/20 transition-colors">
              <div className={`font-pixel text-[9px] ${item.color} flex items-center gap-1 group-hover:translate-x-1 transition-transform`}>
                ENTRAR <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AdminTemplate>
  );
}
