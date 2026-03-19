import { LogOut, Star, Coins } from "lucide-react";
import Link from "next/link";
import { logout } from "@/features/auth/services/actions";
import type { Profile } from "@/features/auth/models/auth";
import { Typography } from "../ui/Typography";

interface Props {
  profile: Profile;
}

export default function Topbar({ profile }: Props) {
  return (
    <header className="h-14 bg-[#050505] border-b border-brand-500/20 flex items-center justify-between px-6">
      {/* XP + Coins (solo para no-profesor) */}
      {profile.rol !== "profesor" ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-yellow-500/70" />
            <Typography variant="terminal-sm" as="span" className="!text-yellow-400">{profile.xp_total} XP</Typography>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-orange-500/70" />
            <Typography variant="terminal-sm" as="span" className="!text-orange-400">{profile.coins}</Typography>
          </div>
        </div>
      ) : (
        <Typography variant="terminal-sm" as="span" className="!text-gray-500">Panel del profesor</Typography>
      )}

      {/* Perfil + logout */}
      <div className="flex items-center gap-3">
        <Link href="/profile">
          <Typography variant="body-sm" as="span" className="!text-gray-300 hover:text-white transition-colors cursor-pointer">{profile.nombre}</Typography>
        </Link>
        <form action={logout}>
          <button
            type="submit"
            title="Cerrar sesión"
            className="p-2 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </form>
      </div>
    </header>
  );
}
