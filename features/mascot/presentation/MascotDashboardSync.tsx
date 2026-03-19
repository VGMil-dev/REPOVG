"use client";

import { useEffect, useRef } from "react";
import { useMascot } from "@/features/mascot/services/MascotContext";
import type { MascotChatContext } from "@/features/mascot/models/mascot";

const IDLE_CONTEXT: MascotChatContext = {
  materiaSlug: null,
  materiaId: null,
  temaSlug: null,
  temaTitulo: null,
  conceptosClave: [],
  preguntaActivaId: null,
};

export function MascotDashboardSync({ mascotName }: { mascotName: string }) {
  const { say, setChatContext, setState } = useMascot();
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    // Clear topic context — we're on the dashboard
    setChatContext(IDLE_CONTEXT);

    // Greeting after a short delay so the widget has time to appear
    const t = setTimeout(() => {
      say(`${mascotName} en linea. Has vuelto.`, "info", 6000);
      setState("curious"); // maps to welcome animation in MascotWidget
    }, 2000);

    return () => clearTimeout(t);
  }, []);

  return null;
}
