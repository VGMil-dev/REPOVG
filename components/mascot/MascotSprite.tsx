"use client";

import React, { useState, useEffect, useRef } from "react";

export type AnimationType = "idle" | "welcome" | "putbrain" | "celebrate" | "learning";

const ONE_SHOT: ReadonlySet<AnimationType> = new Set(["welcome", "putbrain", "celebrate"]);

// Sheet unificado: 63 cols × 4 rows, cada celda 256×256 px
// La normalización del personaje está horneada en el PNG — no se necesita scale externo
const SHEET_URL  = "/global/spritesheet_mascot.png";
const CELL       = 256;
const MAX_FRAMES = 63;
const NUM_ROWS   = 5;
const SHEET_W    = CELL * MAX_FRAMES;   // 16128
const SHEET_H    = CELL * NUM_ROWS;     // 1024

export const SPRITE_SIZE = CELL;

const ANIMATIONS: Record<AnimationType, {
  row:        number;
  frames:     number;
  durationMs: number;
  yShift:     number;   // px a subir el personaje dentro de la celda (compensa padding del sheet)
  loops:      number;   // veces que se repite antes de volver a idle (solo ONE_SHOT)
}> = {
  idle:      { row: 0, frames: 18, durationMs: 1500, yShift:  0, loops: 1 },
  welcome:   { row: 1, frames: 20, durationMs: 1200, yShift:  0, loops: 1 },
  putbrain:  { row: 2, frames: 63, durationMs: 2500, yShift: 44, loops: 1 },
  celebrate: { row: 3, frames: 18, durationMs: 1200, yShift:  0, loops: 2 },
  learning:  { row: 4, frames: 37, durationMs: 2500, yShift:  0, loops: 1 },
};

interface MascotSpriteProps {
  animation?:      AnimationType;
  className?:      string;
  onReturnToIdle?: () => void;
}

export function MascotSprite({
  animation = "idle",
  className = "",
  onReturnToIdle,
}: MascotSpriteProps) {
  const [current, setCurrent] = useState<AnimationType>(animation);
  const divRef   = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);

  // Prop externo → actualizar animación interna
  useEffect(() => { setCurrent(animation); }, [animation]);

  // Stepper — arranca cuando cambia `current`
  useEffect(() => {
    const spec = ANIMATIONS[current];
    const el   = divRef.current;
    if (!el) return;

    // Configurar background (solo necesita ajustarse al cambiar animación)
    el.style.backgroundImage     = `url('${SHEET_URL}')`;
    el.style.backgroundSize      = `${SHEET_W}px ${SHEET_H}px`;
    el.style.backgroundPositionX = "0px";
    el.style.backgroundPositionY = `${-spec.row * CELL}px`;
    // yShift: sube el personaje desplazando el div interno hacia arriba;
    // el wrapper overflow:hidden recorta la parte superior que queda fuera.
    el.style.top    = `${-spec.yShift}px`;
    el.style.height = `${CELL}px`;

    frameRef.current = 0;
    const frameMs = spec.durationMs / spec.frames;
    const totalFrames = ONE_SHOT.has(current) ? spec.frames * spec.loops : Infinity;

    const interval = setInterval(() => {
      frameRef.current++;

      if (ONE_SHOT.has(current) && frameRef.current >= totalFrames) {
        clearInterval(interval);
        // Congelar en último frame hasta que se remonte
        el.style.backgroundPositionX = `${-(spec.frames - 1) * CELL}px`;
        setCurrent("idle");
        onReturnToIdle?.();
        return;
      }

      const f = frameRef.current % spec.frames;
      el.style.backgroundPositionX = `${-f * CELL}px`;
    }, frameMs);

    return () => clearInterval(interval);
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width: CELL, height: CELL }}
    >
      <div
        ref={divRef}
        className="absolute bg-no-repeat"
        style={{ left: 0, right: 0, imageRendering: "pixelated" }}
      />
    </div>
  );
}
