import { LogOut } from "lucide-react";
import { logout } from "@/lib/auth/actions";
import type { Profile } from "@/types";
import { Typography } from "../ui/Typography";

interface Props {
  profile: Profile;
}

export default function Topbar({ profile }: Props) {
  return (
    <header className="h-14 bg-[#050505] border-b border-brand-500/20 flex items-center justify-between px-6">
      {/* XP + Coins (solo para no-profesor) */}
      {profile.rol !== "profesor" && (
        <div className="flex items-center gap-4">
          <Typography variant="body" as="span" className="!text-yellow-400 font-medium">⚡ {profile.xp_total} XP</Typography>
          <Typography variant="body" as="span" className="!text-amber-400 font-medium">🪙 {profile.coins}</Typography>
        </div>
      )}
        <Typography variant="terminal-sm" as="span" className="!text-gray-500">Panel del profesor</Typography>

      {/* Perfil + logout */}
      <div className="flex items-center gap-3">
        <Typography variant="body-sm" as="span" className="!text-gray-300">{profile.nombre}</Typography>
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
