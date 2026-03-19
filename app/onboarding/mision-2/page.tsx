"use client";

import React, { useState, useEffect } from "react";
import {
  Github,
  GitBranch,
  GitCommit,
  Terminal,
  UserPlus,
  ArrowRight,
  Loader2,
  ExternalLink,
  Sparkles,
  Star,
  Coins,
  CheckCircle2,
  Link as LinkIcon,
} from "lucide-react";
import { validateGithubRepo } from "@/features/onboarding/services/actions";
import { MISION_2_REWARD } from "@/features/onboarding/services/onboarding-constants";
import { useRouter } from "next/navigation";
import { Typography } from "@/components/ui/Typography";
import { useMascot } from "@/features/mascot/services/MascotContext";

const STEPS = [
  {
    icon: UserPlus,
    label: "Paso 1",
    title: "Crear cuenta",
    desc: "Regístrate en github.com si aún no tienes cuenta",
    href: "https://github.com/signup",
  },
  {
    icon: Terminal,
    label: "Paso 2",
    title: "Instalar Git",
    desc: 'Descarga Git, luego: git config --global user.name "Tu Nombre"',
    href: "https://git-scm.com/downloads",
  },
  {
    icon: GitBranch,
    label: "Paso 3",
    title: "Crear repo",
    desc: 'En GitHub: New repository → ponle un nombre → "Create repository"',
  },
  {
    icon: GitCommit,
    label: "Paso 4",
    title: "Primer commit",
    desc: "Clona el repo, crea un README.md con el nombre de tu mascota, luego: git add . → git commit → git push",
  },
];

export default function Mission2Page() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { say, setState: setMascotState } = useMascot();

  useEffect(() => {
    setMascotState("learning");
    const t = setTimeout(() => {
      say(
        "Los desarrolladores no guardan su trabajo en carpetas.\n" +
        "Te muestro cómo 📂",
        "info",
        8000
      );
    }, 800);
    return () => clearTimeout(t);
  }, []);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await validateGithubRepo(repoUrl);

    if (result.success) {
      setMascotState("celebrate");
      say("¡Primer commit registrado! Eres un dev ahora 🚀", "success", 8000);
      setSuccess(true);
    } else {
      setMascotState("worry");
      say("Algo falló. Revisemos juntos 🔍", "warning", 5000);
      setError(result.error || "Validación fallida");
      setTimeout(() => setMascotState("learning"), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Typography
            variant="pixel-badge"
            className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full !text-purple-400 uppercase tracking-widest mb-6"
          >
            Misión 02 — Control de Versiones
          </Typography>
          <Typography as="h1" variant="brand-h1" glow className="mb-4 leading-tight">
            OPERACIÓN{" "}
            <span className="text-purple-400" style={{ textShadow: "0 0 20px rgba(168,85,247,0.6)" }}>
              PRIMER COMMIT
            </span>
          </Typography>
          <Typography variant="body" className="text-gray-400 uppercase tracking-wider max-w-md">
            Tu código merece vivir en la nube. Conecta tu portfolio con GitHub.
          </Typography>
        </div>

        {!success ? (
          <>
            {/* Guía de pasos */}
            <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  className="flex flex-col items-start gap-2 p-4 bg-black/40 border border-purple-500/10 rounded-xl group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 group-hover:border-purple-500/50 transition-colors">
                      <step.icon className="w-4 h-4 text-purple-400" />
                    </div>
                    <Typography variant="pixel-badge" className="!text-purple-400/50 uppercase text-[9px]">
                      {step.label}
                    </Typography>
                  </div>
                  <Typography variant="terminal-sm" className="!text-white font-bold text-xs">
                    {step.title}
                  </Typography>
                  <Typography variant="body-sm" className="text-gray-500 text-[11px] leading-snug">
                    {step.desc}
                  </Typography>
                  {step.href && (
                    <a
                      href={step.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors text-[10px] font-mono uppercase mt-1"
                    >
                      Abrir <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Comando de referencia */}
            <div className="bg-black/60 border border-purple-500/10 rounded-xl p-4 font-mono text-xs space-y-1 animate-in fade-in duration-700 delay-200">
              <Typography variant="pixel-badge" className="!text-purple-400/40 uppercase text-[9px] mb-3 block">
                Comandos de referencia
              </Typography>
              {[
                { prompt: "~", cmd: 'git config --global user.name "Tu Nombre"' },
                { prompt: "~", cmd: 'git config --global user.email "tu@email.com"' },
                { prompt: "repo", cmd: "echo '# Mi Repo' > README.md" },
                { prompt: "repo", cmd: "git add ." },
                { prompt: "repo", cmd: 'git commit -m "primer commit"' },
                { prompt: "repo", cmd: "git push origin main" },
              ].map(({ prompt, cmd }, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-purple-500/50 select-none">{prompt} $</span>
                  <span className="text-gray-300">{cmd}</span>
                </div>
              ))}
            </div>

            {/* Formulario */}
            <div className="border-2 border-purple-500/20 bg-black/60 backdrop-blur-xl p-8 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.05)] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="flex items-start gap-4 p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl mb-6">
                <Github className="w-8 h-8 text-purple-400 shrink-0 mt-1" />
                <div>
                  <Typography variant="brand-h4" as="h3" className="!text-white mb-1">
                    Pega la URL de tu repositorio
                  </Typography>
                  <Typography variant="body-sm" className="text-purple-400/60 leading-relaxed">
                    Debe ser público y tener al menos un commit. La verificamos en tiempo real con la API de GitHub.
                  </Typography>
                </div>
              </div>

              <form onSubmit={handleValidate} className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <Typography variant="pixel-label" as="label" className="text-purple-400/50 uppercase">
                      URL del repositorio
                    </Typography>
                    <a href="https://github.com/new" target="_blank" rel="noopener noreferrer">
                      <Typography
                        variant="terminal-sm"
                        className="!text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors underline decoration-purple-500/30"
                      >
                        CREAR REPO <ExternalLink className="w-3 h-3" />
                      </Typography>
                    </a>
                  </div>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400/30" />
                    <input
                      type="url"
                      placeholder="https://github.com/usuario/mi-repositorio"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      className="w-full bg-black/40 border-2 border-purple-500/20 rounded-xl py-4 pl-12 pr-4 font-mono text-sm text-purple-300 focus:border-purple-500/60 focus:outline-none transition-all placeholder:text-purple-900 shadow-[inset_0_0_15px_rgba(168,85,247,0.05)]"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Typography
                    variant="terminal-sm"
                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg !text-red-500 uppercase text-center animate-shake"
                  >
                    ERROR: {error}
                  </Typography>
                )}

                <button
                  type="submit"
                  disabled={loading || !repoUrl}
                  className="w-full py-5 flex items-center justify-center gap-3 group text-lg font-mono uppercase tracking-widest rounded-xl border-2 border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/70 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      VERIFICAR REPOSITORIO
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          /* Pantalla de recompensa */
          <div className="border-2 border-purple-500 bg-purple-500/5 backdrop-blur-xl p-12 rounded-2xl shadow-[0_0_80px_rgba(168,85,247,0.15)] animate-in fade-in zoom-in duration-500 flex flex-col items-center gap-8">
            {/* Badge */}
            <div className="relative animate-in zoom-in duration-500 delay-100">
              <div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(168,85,247,0.7)]">
                <GitCommit className="w-12 h-12 text-white" />
              </div>
              <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-20" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.6)]">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="text-center space-y-2 animate-in fade-in duration-500 delay-200">
              <Typography variant="pixel-badge" className="!text-purple-400/60 uppercase tracking-widest">
                Badge desbloqueado
              </Typography>
              <Typography
                variant="brand-h2"
                as="h2"
                className="!text-purple-400"
                style={{ textShadow: "0 0 30px rgba(168,85,247,0.6)" }}
              >
                PRIMER COMMIT
              </Typography>
              <Typography variant="body-sm" className="text-gray-400 uppercase tracking-wider">
                Repositorio verificado en GitHub
              </Typography>
            </div>

            {/* Recompensas */}
            <div className="flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <div className="flex flex-col items-center gap-2 px-6 py-4 bg-black/40 border border-yellow-500/30 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                <Star className="w-6 h-6 text-yellow-400" />
                <Typography variant="brand-h3" className="!text-yellow-400">
                  +{MISION_2_REWARD.xp}
                </Typography>
                <Typography variant="pixel-badge" className="!text-yellow-600 uppercase text-[9px]">
                  XP
                </Typography>
              </div>
              <div className="flex flex-col items-center gap-2 px-6 py-4 bg-black/40 border border-orange-500/30 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                <Coins className="w-6 h-6 text-orange-400" />
                <Typography variant="brand-h3" className="!text-orange-400">
                  +{MISION_2_REWARD.coins}
                </Typography>
                <Typography variant="pixel-badge" className="!text-orange-600 uppercase text-[9px]">
                  MONEDAS
                </Typography>
              </div>
            </div>

            {/* Botón continuar */}
            <button
              onClick={() => router.push("/onboarding/mision-3")}
              className="w-full py-5 flex items-center justify-center gap-3 group text-lg font-mono uppercase tracking-widest rounded-xl border-2 border-purple-500/60 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 hover:border-purple-500 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500"
            >
              <Sparkles className="w-5 h-5" />
              CONTINUAR A MISIÓN 03
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
