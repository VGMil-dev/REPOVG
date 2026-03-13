"use client";

import React from "react";

export type AnimationType = "welcome" | "idle";

interface MascotSpriteProps {
  animation?: AnimationType;
  className?: string;
}

const ANIMATIONS = {
  welcome: {
    url: "/global/spritesheet_welcome.webp",
    frames: 20,
    width: 256,
    height: 256,
    duration: "1.2s",
    steps: 20,
  },
  idle: {
    url: "/global/spritesheet_idle.webp", // El que acabamos de crear
    frames: 18,
    width: 256,
    height: 256,
    duration: "1.5s",
    steps: 18,
  },
};

export function MascotSprite({ animation = "idle", className = "" }: MascotSpriteProps) {
  const spec = ANIMATIONS[animation];

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width: `${spec.width}px`,
        height: `${spec.height}px`,
      }}
    >
      <div
        className="absolute inset-0 bg-no-repeat transition-[background-image] duration-300"
        style={{
          backgroundImage: `url('${spec.url}')`,
          backgroundSize: `${spec.width * spec.frames}px ${spec.height}px`,
          imageRendering: "pixelated",
          animation: `${animation}-play ${spec.duration} steps(${spec.steps}) infinite`,
        }}
      />

      <style jsx global>{`
        @keyframes welcome-play {
          from { background-position: 0 0; }
          to { background-position: -${256 * 20}px 0; }
        }
        @keyframes idle-play {
          from { background-position: 0 0; }
          to { background-position: -${256 * 18}px 0; }
        }
      `}</style>
    </div>
  );
}
