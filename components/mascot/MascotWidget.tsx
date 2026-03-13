"use client";

import React, { useEffect, useState } from "react";
import { useMascot } from "@/lib/context/MascotContext";
import { usePathname } from "next/navigation";

export function MascotWidget() {
  const { name, state, messages } = useMascot();
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // No mostrar en login, register ni landing
    const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/";
    if (isAuthPage) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4 pointer-events-none">
      {/* Burbujas de mensajes */}
      <div className="flex flex-col gap-2 items-end mb-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`px-4 py-2 rounded-lg border-2 font-mono text-sm max-w-xs transition-all duration-300 pointer-events-auto shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-sm ${
              msg.type === "info" ? "bg-black/90 border-brand-500/50 text-brand-300 shadow-brand-500/10" :
              msg.type === "success" ? "bg-black/90 border-green-500/50 text-green-400 shadow-green-500/10" :
              msg.type === "warning" ? "bg-black/90 border-orange-500/50 text-orange-400 shadow-orange-500/10" :
              "bg-black/90 border-blue-500/50 text-blue-300 shadow-blue-500/10"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* El Personaje */}
      <div className="relative group pointer-events-auto cursor-pointer">
        {/* Label flotante con el nombre */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-brand-500 text-black text-[10px] font-bold rounded uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-[0_0_10px_rgba(34,197,94,0.5)]">
          {name}
        </div>
        
        {/* Sprite animado (clases definidas en globals.css) */}
        <div className={`mascot-sprite scale-50 md:scale-75 origin-bottom-right drop-shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:scale-100 transition-transform duration-300 ${
          state !== "idle" ? "animate-float" : ""
        }`} />
      </div>
    </div>
  );
}
