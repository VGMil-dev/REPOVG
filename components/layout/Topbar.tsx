import { logout } from "@/lib/auth/actions";
import type { Profile } from "@/types";

interface Props {
  profile: Profile;
}

export default function Topbar({ profile }: Props) {
  return (
    <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
      {/* XP + Coins (solo para no-profesor) */}
      {profile.rol !== "profesor" && (
        <div className="flex items-center gap-4 text-sm">
          <span className="text-yellow-400 font-medium">⚡ {profile.xp_total} XP</span>
          <span className="text-amber-400 font-medium">🪙 {profile.coins}</span>
        </div>
      )}
      {profile.rol === "profesor" && (
        <span className="text-gray-500 text-sm">Panel del profesor</span>
      )}

      {/* Perfil + logout */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-300">{profile.nombre}</span>
        <form action={logout}>
          <button
            type="submit"
            className="text-xs text-gray-500 hover:text-red-400 transition-colors"
          >
            Salir
          </button>
        </form>
      </div>
    </header>
  );
}
