import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Typography } from "@/components/ui/Typography";
import { User, Github, Key } from "lucide-react";
import { ApiKeySection } from "./ApiKeySection";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nombre, email, rol, github_username, gemini_api_key_enc, xp_total, coins")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <Typography as="h1" variant="brand-h2" glow className="mb-1">
          Mi Perfil
        </Typography>
        <Typography variant="body-sm" className="text-gray-500 uppercase tracking-wider">
          Configuración de cuenta y claves de IA
        </Typography>
      </div>

      {/* Info básica */}
      <div className="border border-brand-500/20 bg-black/40 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-brand-500" />
          <Typography variant="pixel-label" className="text-brand-500/60 uppercase tracking-widest">
            Información
          </Typography>
        </div>
        <Row label="Nombre" value={profile.nombre} />
        <Row label="Email" value={profile.email} />
        <Row label="Rol" value={profile.rol} />
        {profile.github_username && (
          <Row label="GitHub" value={`@${profile.github_username}`} icon={<Github className="w-3.5 h-3.5 text-gray-500" />} />
        )}
        <Row label="XP Total" value={`${profile.xp_total ?? 0} XP`} />
        <Row label="Monedas" value={`${profile.coins ?? 0}`} />
      </div>

      {/* API Key */}
      <div className="border border-brand-500/20 bg-black/40 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Key className="w-4 h-4 text-brand-500" />
          <Typography variant="pixel-label" className="text-brand-500/60 uppercase tracking-widest">
            Clave de IA
          </Typography>
        </div>
        <Typography variant="body-sm" className="text-gray-600 text-[12px]">
          Tu clave se almacena en tu perfil y solo se usa para la asistencia de la mascota.
        </Typography>

        <ApiKeySection geminiConnected={!!profile.gemini_api_key_enc} />
      </div>
    </div>
  );
}

function Row({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-brand-500/10 last:border-0">
      <Typography variant="terminal-sm" className="!text-gray-500 uppercase tracking-widest text-[10px]">
        {label}
      </Typography>
      <div className="flex items-center gap-1.5">
        {icon}
        <Typography variant="body-sm" className="!text-gray-300 text-[13px]">
          {value}
        </Typography>
      </div>
    </div>
  );
}
