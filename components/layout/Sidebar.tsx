"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/auth/actions";
import type { Profile } from "@/types";

interface Props {
  profile: Profile;
}

const navEstudiante = [
  { href: "/dashboard", label: "Inicio", icon: "🏠" },
  { href: "/perfil", label: "Mi perfil", icon: "🐾" },
];

const navProfesor = [
  { href: "/dashboard", label: "Inicio", icon: "🏠" },
  { href: "/admin", label: "Panel Admin", icon: "⚙️" },
  { href: "/admin/usuarios", label: "Usuarios", icon: "👥" },
  { href: "/admin/accesos", label: "Accesos", icon: "🔑" },
];

export default function Sidebar({ profile }: Props) {
  const pathname = usePathname();
  const nav = profile.rol === "profesor" ? navProfesor : navEstudiante;

  return (
    <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-800">
        <span className="text-xl font-bold text-white">📚 RepoVG</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Rol badge + Logout */}
      <div className="px-4 py-3 border-t border-gray-800 space-y-3">
        <span className={`badge text-xs ${
          profile.rol === "profesor"
            ? "bg-purple-500/20 text-purple-400"
            : profile.rol === "estudiante"
            ? "bg-brand-500/20 text-brand-400"
            : "bg-gray-500/20 text-gray-400"
        }`}>
          {profile.rol}
        </span>

        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-red-500/10 transition-colors group"
          >
            <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-400" />
            <span>Cerrar sesión</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
