"use client";

import React, { useEffect, useState } from "react";
import { useMascot } from "@/features/mascot/services/MascotContext";
import { usePathname } from "next/navigation";
import { MascotSprite, AnimationType, SPRITE_SIZE } from "./MascotSprite";
import { MascotBubble } from "./MascotBubble";
import { MascotChat } from "./MascotChat";

/** Escala de display del widget */
const WIDGET_SCALE = 0.6;
const WIDGET_PX = SPRITE_SIZE * WIDGET_SCALE;

const SPRITE_FILTERS: Record<string, string> = {
  default: "none",
  fire:    "hue-rotate(30deg) saturate(1.6)",
  ice:     "hue-rotate(180deg) saturate(0.8) brightness(1.2)",
  dark:    "hue-rotate(270deg) saturate(0.5) brightness(0.7)",
};

interface MascotWidgetProps {
  forceVisible?: boolean;
}

export function MascotWidget({ forceVisible: forceVisibleProp = false }: MascotWidgetProps) {
  const { name, state, setState, bubble, clearBubble, sprite, chatOpen, setChatOpen, userId } = useMascot();
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
    state === "idle" || state === "think" || state === "learning" || state === "worry" ? "idle" :
      state === "putbrain" ? "putbrain" :
        state === "celebrate" ? "celebrate" :
          "welcome";

  const handleSpriteClick = () => {
    if (!userId) return; // No chat without userId
    if (chatOpen) {
      setChatOpen(false);
    } else {
      clearBubble();
      setChatOpen(true);
    }
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex flex-col items-end"
      style={{ gap: 8 }}
    >
      {/* Chat popup — appears above sprite when open */}
      {chatOpen && userId && (
        <div className="mb-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <MascotChat userId={userId} />
        </div>
      )}

      {/* Single bubble — only when chat is closed */}
      {!chatOpen && bubble && (
        <div className="pointer-events-auto">
          <MascotBubble
            text={bubble.text}
            type={bubble.type}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300"
          />
        </div>
      )}

      {/* Sprite */}
      <div
        className="relative pointer-events-auto"
        style={{ width: WIDGET_PX, height: WIDGET_PX }}
      >
        {/* Tooltip name */}
        <div className="group absolute inset-0">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-brand-500 text-black text-[10px] font-bold rounded uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-[0_0_10px_rgba(34,197,94,0.5)] pointer-events-none">
            {name}
          </div>
        </div>

        {/* Clickable area for chat toggle */}
        <button
          onClick={handleSpriteClick}
          className="absolute inset-0 z-10 cursor-pointer"
          aria-label={chatOpen ? "Cerrar chat" : "Abrir chat con mascota"}
          style={{ background: "transparent", border: "none" }}
        />

        {/* Active ring when chat is open */}
        {chatOpen && (
          <div
            className="absolute inset-0 rounded-full border-2 border-brand-500/40 animate-pulse pointer-events-none"
            style={{ zIndex: 9 }}
          />
        )}

        <div
          style={{
            width: SPRITE_SIZE,
            height: SPRITE_SIZE,
            transform: `scale(${WIDGET_SCALE})`,
            transformOrigin: "bottom right",
            position: "absolute",
            bottom: 0,
            right: 0,
            filter: SPRITE_FILTERS[sprite] ?? "none",
          }}
        >
          <MascotSprite
            animation={currentAnimation}
            onReturnToIdle={() => setState("idle")}
            className="drop-shadow-[0_0_12px_rgba(34,197,94,0.4)]"
          />
        </div>
      </div>
    </div>
  );
}
