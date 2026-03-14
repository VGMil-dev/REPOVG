"use client";

import React, { useEffect, useState } from "react";
import { useMascot } from "@/lib/context/MascotContext";
import { usePathname } from "next/navigation";

import { MascotSprite, AnimationType } from "./MascotSprite";
import { MascotBubble } from "./MascotBubble";

export function MascotWidget() {
  const { name, state, messages } = useMascot();
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // No mostrar en login, register, landing ni admin
    const isExcludedPage = pathname === "/login" || pathname === "/register" || pathname === "/" || pathname.startsWith("/admin");
    if (isExcludedPage) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isVisible) return null;

  // Mapear el estado del contexto a la animación del componente
  const currentAnimation: AnimationType = state === "idle" ? "idle" : "welcome";

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4 pointer-events-none">
      {/* Burbujas de mensajes */}
      <div className="flex flex-col gap-1 items-end -mb-20">
        {messages.map((msg) => (
          <MascotBubble
            key={msg.id}
            text={msg.text}
            type={msg.type}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-auto"
          />
        ))}
      </div>

      {/* El Personaje */}
      <div className="relative group pointer-events-auto cursor-pointer">
        {/* Label flotante con el nombre */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-brand-500 text-black text-[10px] font-bold rounded uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-[0_0_10px_rgba(34,197,94,0.5)]">
          {name}
        </div>

        {/* Nuevo Componente Dinámico */}
        <MascotSprite
          animation={currentAnimation}
          className={`scale-50 md:scale-75 origin-bottom-right drop-shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:scale-100 transition-all duration-300 ${state !== "idle" ? "animate-float" : ""
            }`}
        />
      </div>
    </div>
  );
}
