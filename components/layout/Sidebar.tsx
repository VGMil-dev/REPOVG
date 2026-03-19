"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  Home,
  Users,
  Key,
  BookOpen,
  BarChart3,
  Shield,
  Settings,
  Terminal
} from "lucide-react";
import { MascotSprite } from "@/components/mascot/MascotSprite";
import { logout } from "@/lib/auth/actions";
import { Typography } from "../ui/Typography";
import type { Profile } from "@/types";

interface Props {
  profile: Profile;
}

const navEstudiante = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/profile", label: "Mi perfil", icon: Users },
];

const navProfesor = [
  { href: "/admin", label: "Panel General", icon: Home },
  { href: "/admin/usuarios", label: "Gestión de Cuentas", icon: Users },
  { href: "/admin/accesos", label: "Control de Accesos", icon: Key },
  { href: "/admin/contenido", label: "Gestor de Contenido", icon: BookOpen },
  { href: "/admin/analytics", label: "Métricas y Progreso", icon: BarChart3 },
  { href: "/admin/seguridad", label: "Logs de Seguridad", icon: Terminal },
  { href: "/admin/configuracion", label: "Ajustes Generales", icon: Settings },
];

export default function Sidebar({ profile }: Props) {
  const pathname = usePathname();
  const nav = profile.rol === "profesor" ? navProfesor : navEstudiante;

  return (
    <aside className="w-64 bg-[#0a0c10] border-r border-white/5 flex flex-col h-full overflow-hidden">
      {/* Header Section from Reference */}
      <div className="px-6 pt-6 pb-2 flex flex-col items-center border-b border-white/5 relative bg-gradient-to-b from-white/5 to-transparent">
        {/* Mascot placeholder - Replicating the image feel */}
        <div className="relative -mb-32 z-0">
          {/* Hard hat mascot representation - Animated */}
          <MascotSprite
            animation="idle"
            className="scale-[0.45] origin-top brightness-125 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          />
        </div>

        <div className="text-center relative z-10">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Typography variant="brand-h2" as="span" className="!text-xl !text-orange-500">FRAG</Typography>
            <Typography variant="brand-h2" as="span" className="!text-xl !text-brand-500">MENTS</Typography>
          </div>
          <Typography variant="terminal-sm" className="!text-[9px] mb-1 !text-gray-500">
            Admin v1.0
          </Typography>
        </div>
      </div>

      {/* Nav Section from Reference */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto scrollbar-hide">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-3 py-2.5 rounded transition-all duration-300 group relative ${active
                ? "border border-brand-500/50 bg-brand-500/5 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                : "hover:bg-white/5"
                }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${active ? "text-brand-500" : "text-gray-500 group-hover:text-gray-300"}`} />

              <div className="flex items-center gap-2">
                <Typography variant="terminal-sm" as="span" className={`!text-gray-600 group-hover:!text-brand-500 transition-colors ${active ? "!text-brand-500" : ""}`}>
                  {'>'}
                </Typography>
                <Typography variant="terminal-sm" as="span" className={`!text-[11px] transition-colors ${active ? "!text-brand-400" : "!text-gray-400 group-hover:!text-white"
                  }`}>
                  {item.label}
                </Typography>
              </div>

              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-1/2 bg-brand-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer from Reference */}
      <div className="p-6 border-t border-white/5 flex justify-center">
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-2 border border-red-500/30 rounded-lg font-terminal text-[11px] text-red-500/70 hover:text-red-400 hover:border-red-500/60 hover:bg-red-500/5 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all duration-300 uppercase tracking-widest group"
          >
            <Typography variant="terminal-sm" as="span" className="flex items-center gap-1">
              <span>[</span>
              <span>Cerrar Sesión</span>
              <span>]</span>
            </Typography>
          </button>
        </form>
      </div>
    </aside>
  );
}
