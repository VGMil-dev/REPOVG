"use client";

import React from "react";

type BubbleMessageType = "info" | "question" | "success" | "warning";

interface MascotBubbleProps {
  text: string;
  type?: BubbleMessageType;
  className?: string;
}

const typeColor: Record<BubbleMessageType, string> = {
  info:     "text-gray-900",
  question: "text-blue-900",
  success:  "text-green-900",
  warning:  "text-orange-900",
};

export function MascotBubble({ text, type = "info", className = "" }: MascotBubbleProps) {
  return (
    <div className={`relative w-56 select-none ${className}`}>
      {/* Pixel art speech bubble como imagen de fondo */}
      <img
        src="/assets/mascot/speech-bubble.webp"
        alt=""
        aria-hidden
        className="w-full h-full"
        style={{ imageRendering: "pixelated" }}
        draggable={false}
      />

      {/* Texto overlay — posicionado en el área del globo (encima del tail) */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          // El tail ocupa aprox el 22% inferior izquierdo de la imagen
          paddingBottom: "22%",
          paddingLeft: "8%",
          paddingRight: "8%",
          paddingTop: "8%",
        }}
      >
        <p
          className={`font-mono text-[11px] leading-snug text-center font-bold ${typeColor[type]}`}
          style={{ imageRendering: "pixelated" }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}
