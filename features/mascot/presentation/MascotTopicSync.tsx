"use client";

import { useEffect } from "react";
import { useMascot } from "@/features/mascot/services/MascotContext";
import type { MascotChatContext } from "@/features/mascot/models/mascot";

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

    // Get a predefined question for the topic
    if (temaSlug && materiaId) {
      import("@/features/mascot/services/actions").then(({ getMascotaPregunta }) => {
        getMascotaPregunta(materiaId, temaSlug).then((data) => {
          if (data) {
            say(data.pregunta, "question", 8000);
            setState("curious");
          } else if (conceptosClave.length > 0) {
            // Fallback
            say(`Nuevo tema detectado: ${temaTitulo}. Cuéntame qué estás aprendiendo`, "question", 7000);
            setState("curious");
          }
        });
      });
    }
  }, [temaSlug, materiaId, materiaSlug, temaTitulo, conceptosClave]);

  return null;
}
