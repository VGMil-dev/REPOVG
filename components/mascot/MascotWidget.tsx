"use client";

import React, { useEffect, useState } from "react";
import { useMascot } from "@/lib/context/MascotContext";
import { usePathname } from "next/navigation";
import { MascotSprite, AnimationType, SPRITE_SIZE } from "./MascotSprite";
import { MascotBubble } from "./MascotBubble";

/** Escala de display del widget (el sprite siempre es SPRITE_SIZE internamente) */
const WIDGET_SCALE = 0.6;
const WIDGET_PX = SPRITE_SIZE * WIDGET_SCALE; // px que ocupa en pantalla

export function MascotWidget({ forceVisible: forceVisibleProp = false }: { forceVisible?: boolean }) {
  const { name, state, setState, messages } = useMascot();
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (forceVisibleProp) {
      setIsVisible(true);
      return;
    }

    const excluded =
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/" ||
      pathname.startsWith("/admin");

    if (excluded) { setIsVisible(false); return; }
    const t = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(t);
  }, [pathname, forceVisibleProp]);

  if (!isVisible) return null;

  const currentAnimation: AnimationType =
    state === "idle" ? "idle" :
      state === "putbrain" ? "putbrain" :
        state === "celebrate" ? "celebrate" :
          "welcome";

  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex flex-col items-end pointer-events-none"
      style={{ gap: 8 }}
    >
      {/* Burbujas — apiladas encima del sprite, alineadas a la derecha */}
      <div className="flex flex-col gap-2 items-end pointer-events-auto">
        {messages.map((msg) => (
          <MascotBubble
            key={msg.id}
            text={msg.text}
            type={msg.type}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300"
          />
        ))}
      </div>

      {/* Sprite — tamaño fijo en pantalla via wrapper escalado */}
      <div
        className="relative pointer-events-auto cursor-pointer"
        style={{ width: WIDGET_PX, height: WIDGET_PX }}
      >
        {/* Tooltip nombre */}
        <div className="group absolute inset-0">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-brand-500 text-black text-[10px] font-bold rounded uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-[0_0_10px_rgba(34,197,94,0.5)] pointer-events-none">
            {name}
          </div>
        </div>

        {/*
          El sprite siempre es SPRITE_SIZE×SPRITE_SIZE internamente.
          Usamos transform:scale para reducirlo al WIDGET_PX visual
          con origin bottom-right, sin afectar el flujo del DOM.
        */}
        <div
          style={{
            width: SPRITE_SIZE,
            height: SPRITE_SIZE,
            transform: `scale(${WIDGET_SCALE})`,
            transformOrigin: "bottom right",
            position: "absolute",
            bottom: 0,
            right: 0,
          }}
        >
          <MascotSprite
            animation={currentAnimation}
            onReturnToIdle={() => setState("idle")}
            className={`drop-shadow-[0_0_12px_rgba(34,197,94,0.4)]`}
          />
        </div>
      </div>
    </div>
  );
}
