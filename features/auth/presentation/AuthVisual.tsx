import React from "react";
import { MascotSprite } from "@/features/mascot/presentation/MascotSprite";

const MascotLandingMessage = ({ message }: { message: React.ReactNode }) => {
  return (
    <div className="absolute -top-36 left-1/2 -translate-x-1/2 mb-8 animate-float-subtle group">
      <div className="relative w-[220px] h-[100px] flex items-center justify-center">
        <img
          src="/assets/mascot/speech-bubble.webp"
          alt="Speech Bubble"
          className="absolute z-10 top-39 w-full h-fit object-cover pixelated pointer-events-none"
        />
        <p className="font-pixel text-[10px] text-black leading-tight text-center relative z-10 px-6 pb-2 mb-2">
          {message}
        </p>
      </div>
    </div>
  );
};

export const AuthVisual = ({ message }: { message: React.ReactNode }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 select-none">
      <div className="relative flex flex-col items-center">
        <MascotLandingMessage message={message} />
        <MascotSprite
          animation="welcome"
          className="scale-[2] drop-shadow-[0_0_60px_rgba(34,197,94,0.4)]"
        />
      </div>
    </div>
  );
};
