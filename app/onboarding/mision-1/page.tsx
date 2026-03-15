"use client";

import React, { useState, useEffect } from "react";
import {
  Brain,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Loader2,
  ExternalLink,
  Zap,
  Star,
  Coins,
  CheckCircle2,
  LogIn,
  Key,
  ClipboardPaste,
} from "lucide-react";
import { validateGeminiKey } from "@/lib/auth/onboarding-actions";
import { MISION_1_REWARD } from "@/lib/auth/onboarding-constants";
import { useRouter } from "next/navigation";
import { Typography } from "@/components/ui/Typography";
import { useMascot } from "@/lib/context/MascotContext";

const STEPS = [
  {
    icon: LogIn,
    label: "Paso 1",
    title: "Ir a AI Studio",
    desc: "aistudio.google.com → login con tu cuenta Google",
    href: "https://aistudio.google.com/app/apikey",
  },
  {
    icon: Key,
    label: "Paso 2",
    title: "Crear API Key",
    desc: 'Click en "Get API Key" → "Create API key"',
  },
  {
    icon: ClipboardPaste,
    label: "Paso 3",
    title: "Pegar aquí",
    desc: "Copia la key (empieza con AIza...) y pégala abajo",
  },
];

export default function Mission1Page() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { say, setState: setMascotState } = useMascot();

  useEffect(() => {
    setMascotState("curious");
    const t = setTimeout(() => {
      say(
        "Para ayudarte cuando te trabe, necesito un cerebrito. ¿Me ayudas? Es gratis 🧠",
        "question",
        8000
      );
    }, 800);
    return () => clearTimeout(t);
  }, []);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await validateGeminiKey(apiKey);

    if (result.success) {
      setMascotState("putbrain");
      say("¡Núcleo sincronizado! Eres imparable 🎉", "success", 8000);
      setSuccess(true);
    } else {
      setMascotState("worry");
      say("Esa key no funcionó. Revisemos juntos 🔍", "warning", 5000);
      setError(result.error || "Validación fallida");
      setTimeout(() => setMascotState("curious"), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Typography
            variant="pixel-badge"
            className="px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full !text-brand-500 uppercase tracking-widest mb-6"
          >
            Misión 01 — Protocolo de Inteligencia
          </Typography>
          <Typography as="h1" variant="brand-h1" glow className="mb-4 leading-tight">
            OPERACIÓN{" "}
            <span className="text-orange-500 text-glow-orange">CEREBRITO</span>
          </Typography>
          <Typography variant="body" className="text-gray-400 uppercase tracking-wider max-w-md">
            Conecta tu núcleo cognitivo con Gemini AI. Es gratuito y solo toma 2 minutos.
          </Typography>
        </div>

        {!success ? (
          <>
            {/* Guía de pasos */}
            <div className="grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 p-4 bg-black/40 border border-brand-500/10 rounded-xl text-center group"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center group-hover:border-brand-500/50 transition-colors">
                    <step.icon className="w-5 h-5 text-brand-500" />
                  </div>
                  <Typography variant="pixel-badge" className="!text-brand-500/50 uppercase text-[9px]">
                    {step.label}
                  </Typography>
                  <Typography variant="terminal-sm" className="!text-white font-bold text-xs leading-tight">
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
                      className="mt-1 flex items-center gap-1 text-orange-500 hover:text-orange-400 transition-colors text-[10px] font-mono uppercase"
                    >
                      Abrir <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Formulario */}
            <div
              className="border-2 border-brand-500/20 bg-black/60 backdrop-blur-xl p-8 rounded-2xl shadow-[0_0_50px_rgba(34,197,94,0.05)] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300"
            >
              <div className="flex items-start gap-4 p-4 bg-brand-500/5 border border-brand-500/10 rounded-xl mb-6">
                <Brain className="w-8 h-8 text-brand-500 shrink-0 mt-1" />
                <div>
                  <Typography variant="brand-h4" as="h3" className="!text-white mb-1">
                    Instrucciones del Sistema
                  </Typography>
                  <Typography variant="body-sm" className="text-brand-400/60 leading-relaxed">
                    Tu API Key se almacena de forma segura en tu perfil. Solo RepoVG la usa para
                    ayudarte a resolver dudas de código.
                  </Typography>
                </div>
              </div>

              <form onSubmit={handleValidate} className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <Typography
                      variant="pixel-label"
                      as="label"
                      className="text-brand-500/50 uppercase"
                    >
                      Google AI API KEY
                    </Typography>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Typography
                        variant="terminal-sm"
                        className="!text-orange-500 hover:text-orange-400 flex items-center gap-1 transition-colors underline decoration-orange-500/30"
                      >
                        OBTENER KEY <ExternalLink className="w-3 h-3" />
                      </Typography>
                    </a>
                  </div>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-500/30" />
                    <input
                      type="password"
                      placeholder="Pega aquí tu API Key (AIza...)"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full bg-black/40 border-2 border-brand-500/20 rounded-xl py-4 pl-12 pr-4 font-mono text-sm text-brand-300 focus:border-brand-500/60 focus:outline-none transition-all placeholder:text-brand-900 shadow-[inset_0_0_15px_rgba(34,197,94,0.05)]"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Typography
                    variant="terminal-sm"
                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg !text-red-500 uppercase text-center animate-shake"
                  >
                    ERROR_DE_NÚCLEO: {error}
                  </Typography>
                )}

                <button
                  type="submit"
                  disabled={loading || !apiKey}
                  className="btn-primary w-full py-5 flex items-center justify-center gap-3 group text-lg"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      SINCRONIZAR NÚCLEO{" "}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Footer info */}
            <div className="flex justify-center gap-8 opacity-40">
              <Typography
                variant="terminal-sm"
                className="flex items-center gap-2 !text-gray-500 uppercase tracking-widest"
              >
                <Zap className="w-3 h-3" /> Gemini AI Enabled
              </Typography>
              <Typography
                variant="terminal-sm"
                className="flex items-center gap-2 !text-gray-500 uppercase tracking-widest"
              >
                <ShieldCheck className="w-3 h-3" /> Secure Storage
              </Typography>
            </div>
          </>
        ) : (
          /* Pantalla de recompensa */
          <div className="border-2 border-brand-500 bg-brand-500/5 backdrop-blur-xl p-12 rounded-2xl shadow-[0_0_80px_rgba(34,197,94,0.15)] animate-in fade-in zoom-in duration-500 flex flex-col items-center gap-8">
            {/* Badge cerebrito */}
            <div className="relative animate-in zoom-in duration-500 delay-100">
              <div className="w-24 h-24 bg-brand-500 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.7)]">
                <Brain className="w-12 h-12 text-black" />
              </div>
              <div className="absolute inset-0 bg-brand-500 rounded-full animate-ping opacity-20" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.6)]">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="text-center space-y-2 animate-in fade-in duration-500 delay-200">
              <Typography variant="pixel-badge" className="!text-brand-500/60 uppercase tracking-widest">
                Badge desbloqueado
              </Typography>
              <Typography variant="brand-h2" as="h2" glow className="!text-brand-500">
                CEREBRITO
              </Typography>
              <Typography variant="body-sm" className="text-gray-400 uppercase tracking-wider">
                Núcleo cognitivo conectado con éxito
              </Typography>
            </div>

            {/* Recompensas */}
            <div className="flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <div className="flex flex-col items-center gap-2 px-6 py-4 bg-black/40 border border-yellow-500/30 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                <Star className="w-6 h-6 text-yellow-400" />
                <Typography variant="brand-h3" className="!text-yellow-400">
                  +{MISION_1_REWARD.xp}
                </Typography>
                <Typography variant="pixel-badge" className="!text-yellow-600 uppercase text-[9px]">
                  XP
                </Typography>
              </div>
              <div className="flex flex-col items-center gap-2 px-6 py-4 bg-black/40 border border-orange-500/30 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                <Coins className="w-6 h-6 text-orange-400" />
                <Typography variant="brand-h3" className="!text-orange-400">
                  +{MISION_1_REWARD.coins}
                </Typography>
                <Typography variant="pixel-badge" className="!text-orange-600 uppercase text-[9px]">
                  MONEDAS
                </Typography>
              </div>
            </div>

            {/* Botón para continuar */}
            <button
              onClick={() => router.push("/onboarding/mision-2")}
              className="btn-primary w-full py-5 flex items-center justify-center gap-3 group text-lg animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500"
            >
              <Sparkles className="w-5 h-5" />
              CONTINUAR A MISIÓN 02
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
