"use client";

import { useEffect } from "react";
import { useMascot } from "@/lib/context/MascotContext";
import type { MascotChatContext } from "@/types";

interface MascotTopicSyncProps {
  materiaSlug: string;
  materiaId: string;
  temaSlug: string;
  temaTitulo: string;
  conceptosClave: string[];
  preguntaActivaId?: string | null;
}

export function MascotTopicSync({
  materiaSlug,
  materiaId,
  temaSlug,
  temaTitulo,
  conceptosClave,
  preguntaActivaId = null,
}: MascotTopicSyncProps) {
  const { setChatContext, say, setState } = useMascot();

  useEffect(() => {
    const ctx: MascotChatContext = {
      materiaSlug,
      materiaId,
      temaSlug,
      temaTitulo,
      conceptosClave,
      preguntaActivaId,
    };
    setChatContext(ctx);

    // Optional greeting
    if (conceptosClave.length > 0) {
      const t = setTimeout(() => {
        say(`Nuevo tema detectado. Cuéntame qué estás aprendiendo`, "question", 7000);
        setState("curious");
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [temaSlug]);

  return null;
}
