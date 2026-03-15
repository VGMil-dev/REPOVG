"use client";

import React, { useState, useEffect } from "react";
import {
  Bot,
  MessageSquare,
  Star,
  ShoppingBag,
  Zap,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Coins,
  Palette,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Typography } from "@/components/ui/Typography";
import { useMascot } from "@/lib/context/MascotContext";
import { SpriteSelector } from "@/components/onboarding/SpriteSelector";
import { completarMision3 } from "@/lib/auth/onboarding-actions";
import { MISION_3_REWARD } from "@/lib/auth/onboarding-constants";
import type { MascotSpriteVariant } from "@/lib/context/MascotContext";

type Phase = "nombre" | "sprite" | "tutorial" | "recompensa";

const TUTORIAL_STEPS = [
  {
    icon: MessageSquare,
    title: "CHATEAR CON TU COMPAÑERO",
    body: "Tu mascota vive en la esquina inferior derecha de la pantalla. Siempre está contigo mientras estudias. Puedes preguntarle dudas de código, conceptos o que te explique los temas de otra manera.\n\nUsa tu Gemini API Key para activar el chat.",
    mascotState: "curious" as const,
    mascotMsg: "¡Hola! Puedes preguntarme lo que sea sobre tus materias 💬",
  },
  {
    icon: Star,
    title: "SISTEMA DE XP",
    body: "Gana experiencia completando temas y evaluaciones. Cada acción suma puntos que suben tu nivel.",
    table: [
      { label: "Tema completado",  value: "+10 XP" },
      { label: "Evaluación",       value: "+25–100 XP" },
      { label: "Logro desbloqueado", value: "Variable" },
      { label: "Misión de onboarding", value: "+50–100 XP" },
    ],
    mascotState: "celebrate" as const,
    mascotMsg: "¡Más XP = más nivel! 🏆",
  },
  {
    icon: ShoppingBag,
    title: "MONEDAS Y TIENDA",
    body: "Las monedas se ganan junto al XP y se pueden gastar en la tienda del sistema.\n\nEncuentra: boosts de XP, beneficios especiales para clases y cosméticos para personalizar tu perfil y mascota.",
    mascotState: "idle" as const,
    mascotMsg: "¡Ahorra monedas para algo especial! 🪙",
  },
  {
    icon: Zap,
    title: "HABILIDADES DE TU COMPAÑERO",
    body: "Tu mascota no solo habla — actúa. Con la Gemini API Key configurada puede:\n\n• Revisar tu código y detectar errores\n• Explicar conceptos de tus materias\n• Analizar tu repositorio de GitHub\n• Generar ejemplos personalizados",
    mascotState: "putbrain" as const,
    mascotMsg: "Con mi núcleo cognitivo, puedo analizar tu código 🧠",
  },
  {
    icon: Sparkles,
    title: "TODO LISTO",
    body: "Tienes todo lo que necesitas para comenzar tu jornada en RepoVG.\n\nTu mascota está activa, tu repositorio conectado y tu clave Gemini configurada. El sistema está listo para ti.",
    mascotState: "celebrate" as const,
    mascotMsg: "¡Protocolo completo! Iniciemos 🚀",
  },
];

export default function Mission3Page() {
  const router = useRouter();
  const { say, setState: setMascotState, setName, setSprite } = useMascot();

  const [phase, setPhase]               = useState<Phase>("nombre");
  const [mascotName, setMascotName]     = useState("");
  const [nameError, setNameError]       = useState<string | null>(null);
  const [selectedSprite, setSelectedSprite] = useState<MascotSpriteVariant>("default");
  const [tutorialStep, setTutorialStep] = useState(0);
  const [loading, setLoading]           = useState(false);
  const [actionError, setActionError]   = useState<string | null>(null);

  // Saludo inicial
  useEffect(() => {
    setMascotState("curious");
    const t = setTimeout(() => {
      say("¡Esta es la última misión! Vamos a conocernos 🤖", "info", 8000);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  // Sincronizar animación con paso del tutorial
  useEffect(() => {
    if (phase !== "tutorial") return;
    const step = TUTORIAL_STEPS[tutorialStep];
    setMascotState(step.mascotState);
    say(step.mascotMsg, "info", 6000);
  }, [phase, tutorialStep]);

  /* ── Handlers ─────────────────────────────────────────────────────────── */

  const handleNombreContinue = () => {
    const trimmed = mascotName.trim();
    if (!trimmed) { setNameError("Escribe un nombre para continuar."); return; }
    if (trimmed.length > 20) { setNameError("Máximo 20 caracteres."); return; }
    setNameError(null);
    say(`¡${trimmed}! Me gusta ese nombre 🎯`, "success", 5000);
    setPhase("sprite");
  };

  const handleSpriteConfirm = () => {
    say("¡Buena elección! Ahora te explico cómo funcionamos 📖", "info", 5000);
    setPhase("tutorial");
  };

  const handleTutorialNext = async () => {
    if (tutorialStep < TUTORIAL_STEPS.length - 1) {
      setTutorialStep((s) => s + 1);
      return;
    }
    // Último paso → completar misión
    setLoading(true);
    setActionError(null);
    setMascotState("putbrain");

    const result = await completarMision3(mascotName.trim(), selectedSprite);

    if (result.success) {
      setPhase("recompensa");
    } else {
      setActionError(result.error ?? "Error inesperado. Intenta de nuevo.");
      setMascotState("idle");
    }
    setLoading(false);
  };

  /* ── Fase de recompensa: actualizar contexto al montar ─────────────────── */
  useEffect(() => {
    if (phase !== "recompensa") return;
    setName(mascotName.trim());
    setSprite(selectedSprite);
    setMascotState("celebrate");
    say(`¡${mascotName.trim()} en línea! Bienvenido a RepoVG 🎉`, "success", 10000);
  }, [phase]);

  /* ── Render ────────────────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10 space-y-8">

        {/* Header común */}
        <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Typography
            variant="pixel-badge"
            className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full !text-cyan-400 uppercase tracking-widest mb-6"
          >
            Misión 03 — Protocolo de Vinculación
          </Typography>
          <Typography as="h1" variant="brand-h1" glow className="mb-4 leading-tight">
            OPERACIÓN{" "}
            <span className="text-cyan-400" style={{ textShadow: "0 0 20px rgba(6,182,212,0.6)" }}>
              COMPAÑERO
            </span>
          </Typography>
          <Typography variant="body" className="text-gray-400 uppercase tracking-wider max-w-md">
            {phase === "nombre"   && "Ponle nombre a tu compañero digital."}
            {phase === "sprite"   && "Elige cómo quieres que se vea."}
            {phase === "tutorial" && "Aprende a trabajar junto a tu mascota."}
            {phase === "recompensa" && "¡Protocolo de vinculación completado!"}
          </Typography>
        </div>

        {/* ── FASE 1: NOMBRE ───────────────────────────────────────────────── */}
        {phase === "nombre" && (
          <div className="border-2 border-cyan-500/20 bg-black/60 backdrop-blur-xl p-8 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.05)] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="flex items-start gap-4 p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl mb-6">
              <Bot className="w-8 h-8 text-cyan-400 shrink-0 mt-1" />
              <div>
                <Typography variant="brand-h4" as="h3" className="!text-white mb-1">
                  ¿Cómo me vas a llamar?
                </Typography>
                <Typography variant="body-sm" className="text-cyan-400/60 leading-relaxed">
                  Este nombre aparecerá sobre mi cabeza. Puedes cambiarlo después. Máximo 20 caracteres.
                </Typography>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Bot className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/30" />
                <input
                  type="text"
                  placeholder="Ej: ARIA, BOT-3000, Nexus..."
                  value={mascotName}
                  maxLength={20}
                  onChange={(e) => { setMascotName(e.target.value); setNameError(null); }}
                  onKeyDown={(e) => e.key === "Enter" && handleNombreContinue()}
                  className="w-full bg-black/40 border-2 border-cyan-500/20 rounded-xl py-4 pl-12 pr-16 font-mono text-sm text-cyan-300 focus:border-cyan-500/60 focus:outline-none transition-all placeholder:text-cyan-900 shadow-[inset_0_0_15px_rgba(6,182,212,0.05)]"
                  autoFocus
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-mono text-white/20">
                  {mascotName.length}/20
                </span>
              </div>

              {nameError && (
                <Typography variant="terminal-sm" className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg !text-red-400 uppercase text-center">
                  {nameError}
                </Typography>
              )}

              <button
                type="button"
                onClick={handleNombreContinue}
                disabled={!mascotName.trim()}
                className="w-full py-5 flex items-center justify-center gap-3 group text-lg font-mono uppercase tracking-widest rounded-xl border-2 border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/70 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                CONTINUAR
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* ── FASE 2: SPRITE ──────────────────────────────────────────────── */}
        {phase === "sprite" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="border-2 border-cyan-500/20 bg-black/60 backdrop-blur-xl p-6 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.05)]">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-5 h-5 text-cyan-400" />
                <Typography variant="pixel-label" className="!text-cyan-400/70 uppercase tracking-widest">
                  Elige tu variante — puedes cambiarla después
                </Typography>
              </div>

              <SpriteSelector selected={selectedSprite} onSelect={setSelectedSprite} />
            </div>

            <button
              type="button"
              onClick={handleSpriteConfirm}
              className="w-full py-5 flex items-center justify-center gap-3 group text-lg font-mono uppercase tracking-widest rounded-xl border-2 border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/70 transition-all"
            >
              CONFIRMAR VARIANTE
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* ── FASE 3: TUTORIAL ────────────────────────────────────────────── */}
        {phase === "tutorial" && (() => {
          const step = TUTORIAL_STEPS[tutorialStep];
          const Icon = step.icon;
          const isLast = tutorialStep === TUTORIAL_STEPS.length - 1;

          return (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Paso actual */}
              <div className="border-2 border-cyan-500/20 bg-black/60 backdrop-blur-xl p-8 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.05)]">
                {/* Icono + título */}
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-cyan-400" />
                  </div>
                  <Typography variant="brand-h3" as="h2" className="!text-white text-center">
                    {step.title}
                  </Typography>
                </div>

                {/* Cuerpo */}
                <Typography variant="body-sm" className="text-gray-400 leading-relaxed whitespace-pre-line text-center mb-4">
                  {step.body}
                </Typography>

                {/* Tabla XP (solo paso 2) */}
                {step.table && (
                  <div className="bg-black/40 border border-cyan-500/10 rounded-xl overflow-hidden mt-4">
                    {step.table.map((row, i) => (
                      <div
                        key={i}
                        className={`flex justify-between items-center px-4 py-3 font-mono text-xs ${i < step.table!.length - 1 ? "border-b border-white/5" : ""}`}
                      >
                        <span className="text-white/50 uppercase tracking-wider">{row.label}</span>
                        <span className="text-cyan-400 font-bold">{row.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Error */}
              {actionError && (
                <Typography variant="terminal-sm" className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg !text-red-400 uppercase text-center">
                  ERROR: {actionError}
                </Typography>
              )}

              {/* Indicadores de progreso */}
              <div className="flex justify-center gap-2">
                {TUTORIAL_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${
                      i === tutorialStep
                        ? "w-6 h-2 bg-cyan-400"
                        : i < tutorialStep
                          ? "w-2 h-2 bg-cyan-400/40"
                          : "w-2 h-2 bg-white/10"
                    }`}
                  />
                ))}
              </div>

              {/* Botón */}
              <button
                type="button"
                onClick={handleTutorialNext}
                disabled={loading}
                className="w-full py-5 flex items-center justify-center gap-3 group text-lg font-mono uppercase tracking-widest rounded-xl border-2 border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/70 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : isLast ? (
                  <>
                    <Sparkles className="w-5 h-5" />
                    COMPLETAR MISIÓN
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  <>
                    SIGUIENTE
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          );
        })()}

        {/* ── FASE 4: RECOMPENSA ──────────────────────────────────────────── */}
        {phase === "recompensa" && (
          <div className="border-2 border-cyan-500 bg-cyan-500/5 backdrop-blur-xl p-12 rounded-2xl shadow-[0_0_80px_rgba(6,182,212,0.15)] animate-in fade-in zoom-in duration-500 flex flex-col items-center gap-8">
            {/* Badge animado */}
            <div className="relative animate-in zoom-in duration-500 delay-100">
              <div className="w-24 h-24 bg-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(6,182,212,0.7)]">
                <Bot className="w-12 h-12 text-white" />
              </div>
              <div className="absolute inset-0 bg-cyan-500 rounded-full animate-ping opacity-20" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.6)]">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Nombre de la mascota */}
            <div className="text-center space-y-2 animate-in fade-in duration-500 delay-200">
              <Typography variant="pixel-badge" className="!text-cyan-400/60 uppercase tracking-widest">
                Badge desbloqueado
              </Typography>
              <Typography
                variant="brand-h2"
                as="h2"
                className="!text-cyan-400"
                style={{ textShadow: "0 0 30px rgba(6,182,212,0.6)" }}
              >
                COMPAÑERO ACTIVADO
              </Typography>
              <Typography variant="body-sm" className="text-gray-400 uppercase tracking-wider">
                {mascotName.trim()} está en línea
              </Typography>
            </div>

            {/* Recompensas */}
            <div className="flex gap-4 flex-wrap justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <div className="flex flex-col items-center gap-2 px-6 py-4 bg-black/40 border border-yellow-500/30 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                <Star className="w-6 h-6 text-yellow-400" />
                <Typography variant="brand-h3" className="!text-yellow-400">
                  +{MISION_3_REWARD.xp}
                </Typography>
                <Typography variant="pixel-badge" className="!text-yellow-600 uppercase text-[9px]">
                  XP
                </Typography>
              </div>
              <div className="flex flex-col items-center gap-2 px-6 py-4 bg-black/40 border border-orange-500/30 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                <Coins className="w-6 h-6 text-orange-400" />
                <Typography variant="brand-h3" className="!text-orange-400">
                  +{MISION_3_REWARD.coins}
                </Typography>
                <Typography variant="pixel-badge" className="!text-orange-600 uppercase text-[9px]">
                  MONEDAS
                </Typography>
              </div>
              <div className="flex flex-col items-center gap-2 px-6 py-4 bg-black/40 border border-cyan-500/30 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                <Sparkles className="w-6 h-6 text-cyan-400" />
                <Typography variant="brand-h3" className="!text-cyan-400 text-sm text-center leading-tight">
                  COSMÉTICO
                </Typography>
                <Typography variant="pixel-badge" className="!text-cyan-600 uppercase text-[9px] text-center">
                  PROTOCOLO VINCULACIÓN
                </Typography>
              </div>
            </div>

            {/* Botón al dashboard */}
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-5 flex items-center justify-center gap-3 group text-lg font-mono uppercase tracking-widest rounded-xl border-2 border-cyan-500/60 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 hover:border-cyan-500 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500"
            >
              <Sparkles className="w-5 h-5" />
              IR AL DASHBOARD
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
