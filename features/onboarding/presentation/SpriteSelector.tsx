"use client";

import React from "react";
import { MascotSprite, SPRITE_SIZE } from "@/features/mascot/presentation/MascotSprite";
import type { MascotSpriteVariant } from "@/features/mascot/services/MascotContext";

// El sprite nativo es SPRITE_SIZE×SPRITE_SIZE, lo escalamos a PREVIEW×PREVIEW
const PREVIEW = 112;
const SCALE   = PREVIEW / SPRITE_SIZE;

const VARIANTS: {
  slug: MascotSpriteVariant;
  name: string;
  desc: string;
  filter: string;
  accent: string;
  border: string;
  bg: string;
}[] = [
  {
    slug: "default",
    name: "VERDE",
    desc: "El original. Siempre listo.",
    filter: "none",
    accent: "text-brand-400",
    border: "border-brand-500/60",
    bg:     "bg-brand-500/10",
  },
  {
    slug: "fire",
    name: "FUEGO",
    desc: "Intenso y determinado.",
    filter: "hue-rotate(30deg) saturate(1.6)",
    accent: "text-orange-400",
    border: "border-orange-500/60",
    bg:     "bg-orange-500/10",
  },
  {
    slug: "ice",
    name: "HIELO",
    desc: "Frío, preciso, eficiente.",
    filter: "hue-rotate(180deg) saturate(0.8) brightness(1.2)",
    accent: "text-sky-400",
    border: "border-sky-500/60",
    bg:     "bg-sky-500/10",
  },
  {
    slug: "dark",
    name: "SOMBRA",
    desc: "Raro. Para pocos.",
    filter: "hue-rotate(270deg) saturate(0.5) brightness(0.7)",
    accent: "text-violet-400",
    border: "border-violet-500/60",
    bg:     "bg-violet-500/10",
  },
];

interface SpriteSelectorProps {
  selected: MascotSpriteVariant;
  onSelect: (slug: MascotSpriteVariant) => void;
}

export function SpriteSelector({ selected, onSelect }: SpriteSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {VARIANTS.map((v) => {
        const isSelected = selected === v.slug;
        return (
          <button
            key={v.slug}
            type="button"
            onClick={() => onSelect(v.slug)}
            className={`
              flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200
              ${isSelected
                ? `${v.border} ${v.bg} scale-105 shadow-lg`
                : "border-white/5 bg-black/30 hover:border-white/20 hover:bg-white/5"
              }
            `}
          >
            {/* Preview: MascotSprite escalado con overflow:hidden + filter en wrapper */}
            <div
              style={{
                width:    PREVIEW,
                height:   PREVIEW,
                overflow: "hidden",
                position: "relative",
                flexShrink: 0,
                filter:   v.filter,
              }}
            >
              <div
                style={{
                  width:           SPRITE_SIZE,
                  height:          SPRITE_SIZE,
                  transform:       `scale(${SCALE})`,
                  transformOrigin: "top left",
                  pointerEvents:   "none",
                }}
              >
                <MascotSprite animation="idle" />
              </div>
            </div>

            <div className="text-center space-y-0.5">
              <p className={`font-mono text-xs font-bold uppercase tracking-widest ${isSelected ? v.accent : "text-white/60"}`}>
                {v.name}
              </p>
              <p className="text-[10px] text-white/30 leading-tight">
                {v.desc}
              </p>
            </div>

            {/* Indicador de selección */}
            {isSelected && (
              <div className={`w-2 h-2 rounded-full ${v.accent.replace("text-", "bg-")} shadow-lg`} />
            )}
          </button>
        );
      })}
    </div>
  );
}
