"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  MessageSquare, 
  Star, 
  ShoppingBag, 
  Zap, 
  Sparkles 
} from "lucide-react";
import { useMascot } from "@/features/mascot/services/MascotContext";
import { completarMision3 } from "../services/actions";
import type { MascotSpriteVariant } from "@/features/mascot/services/MascotContext";

export type Phase = "nombre" | "sprite" | "tutorial" | "recompensa";

export const TUTORIAL_STEPS = [
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

export const useOnboardingFlow = () => {
  const router = useRouter();
  const { say, setState: setMascotState, setName, setSprite } = useMascot();

  const [phase, setPhase]               = useState<Phase>("nombre");
  const [mascotName, setMascotName]     = useState("");
  const [nameError, setNameError]       = useState<string | null>(null);
  const [selectedSprite, setSelectedSprite] = useState<MascotSpriteVariant>("default");
  const [tutorialStep, setTutorialStep] = useState(0);
  const [loading, setLoading]           = useState(false);
  const [actionError, setActionError]   = useState<string | null>(null);

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

  const finishOnboarding = () => {
    setName(mascotName.trim());
    setSprite(selectedSprite);
    router.push("/dashboard");
  };

  return {
    phase,
    mascotName,
    setMascotName,
    nameError,
    setNameError,
    selectedSprite,
    setSelectedSprite,
    tutorialStep,
    loading,
    actionError,
    handleNombreContinue,
    handleSpriteConfirm,
    handleTutorialNext,
    finishOnboarding,
    setMascotState,
    say,
    setName,
    setSprite
  };
};
