"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Zap, Target, Award, Terminal, Github, Bot } from "lucide-react";
import { MascotSprite } from "@/components/mascot/MascotSprite";

const MascotLandingMessage = () => {
  const messages = [
    "¡HOLA JEFE!",
    "¿LISTO PARA EL COMMIT?",
    "TU MASCOTA TE ESPERA...",
  ];
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return <>{messages[index]}</>;
};

export default function LandingPage() {
  return (
    <div className="relative h-screen flex flex-col md:flex-row bg-[#050505] overflow-hidden">
      {/* Universal CRT Effects */}
      <div className="pointer-events-none fixed inset-0 scanlines opacity-20 z-0" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.05),transparent_70%)] z-0" />

      {/* Left Column: The Message - Viewport constrained */}
      <div className="relative z-10 w-full md:w-3/5 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 md:p-16 lg:px-24 flex flex-col justify-center scrollbar-hide">
          <header className="mb-8 lg:mb-12 max-w-2xl relative">
            {/* Decorative Corner Bracket */}
            <div className="absolute -left-6 -top-6 w-12 h-12 border-t-2 border-l-2 border-brand-500/20 hidden lg:block" />

            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-pixel tracking-tighter mb-6 lg:mb-10 leading-[1.05] uppercase">
              <span className="text-white text-glow block">DOMINA LA</span>
              <span className="text-orange-500 text-glow-orange block">TECNOLOGIA</span>
              <span className="text-brand-500 text-glow block">CON LA</span>
              <span className="text-white text-glow block underline decoration-brand-500/20 underline-offset-8">PROGRAMACION</span>
            </h1>

            <p className="text-lg md:text-xl xl:text-2xl font-terminal text-gray-400 mb-8 lg:mb-12 leading-relaxed max-w-xl border-l-2 border-gray-800 pl-6 uppercase">
              Forja tu camino en el <span className="text-brand-400">Desarrollo</span> con un compañero que evoluciona contigo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
              <Link
                href="/register"
                className="btn-primary flex items-center justify-center gap-3 px-8 lg:px-10 py-4 lg:py-5 text-lg lg:text-xl group shadow-[0_10px_40px_rgba(34,197,94,0.15)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                ERES EXTERNO? <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center gap-3 px-8 lg:px-10 py-4 lg:py-5 border-2 border-gray-800 text-gray-400 font-pixel text-xs lg:text-sm hover:border-brand-500/50 hover:text-brand-400 transition-all rounded-xl backdrop-blur-sm group uppercase"
              >
                ERES ESTUDIANTE? <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </header>

          {/* Minimal Features Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 mt-4 lg:mt-8 opacity-80 border-t border-brand-500/10 pt-8 lg:pt-12 max-w-3xl">
            <div className="space-y-2 lg:space-y-3 group cursor-default">
              <div className="flex items-center gap-2 text-brand-500">
                <Target className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-pixel text-[10px] tracking-widest uppercase">Misiones</span>
              </div>
              <p className="font-terminal text-[10px] lg:text-xs text-gray-500 uppercase leading-tight">Proyectos reales con validación automática</p>
            </div>
            <div className="space-y-2 lg:space-y-3 group cursor-default">
              <div className="flex items-center gap-2 text-brand-500">
                <Zap className="w-4 h-4 group-hover:scale-110 transition-transform text-orange-500" />
                <span className="font-pixel text-[10px] tracking-widest uppercase text-orange-500">Feedback</span>
              </div>
              <p className="font-terminal text-[10px] lg:text-xs text-gray-500 uppercase leading-tight">Revisiones instantáneas con IA de Gemini</p>
            </div>
            <div className="space-y-2 lg:space-y-3 group cursor-default">
              <div className="flex items-center gap-2 text-brand-500">
                <Award className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-pixel text-[10px] tracking-widest uppercase">Ranking</span>
              </div>
              <p className="font-terminal text-[10px] lg:text-xs text-gray-500 uppercase leading-tight">Sube de nivel y desbloquea cosméticos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Visual Centerpiece - Height constrained */}
      <div className="hidden md:flex relative w-2/5 bg-black border-l border-brand-500/10 overflow-hidden h-full">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(var(--brand-500) 1px, transparent 1px), linear-gradient(90deg, var(--brand-500) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Main Hero Visual */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 select-none">
          <div className="relative flex flex-col items-center">
            {/* Mascot Bubble Message */}
            <div className="absolute -top-32 lg:-top-36 left-1/2 -translate-x-1/2 mb-8 animate-float-subtle group">
              <div className="relative w-[180px] lg:w-[220px] h-[80px] lg:h-[100px] flex items-center justify-center">
                {/* Generated WebP Bubble Asset */}
                <img
                  src="/assets/mascot/speech-bubble.webp"
                  alt="Speech Bubble"
                  className="absolute z-10 top-39 w-full h-fit object-cover pixelated pointer-events-none"
                />

                <p className="font-pixel text-[8px] lg:text-[10px] text-black leading-tight text-center relative z-10 px-4 lg:px-6 pb-2 mb-2">
                  <MascotLandingMessage />
                </p>
              </div>
            </div>

            {/* The Mascot */}
            <MascotSprite
              animation="idle"
              className="scale-[1.5] lg:scale-[2] drop-shadow-[0_0_60px_rgba(34,197,94,0.4)]"
            />
          </div>
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 blur-3xl rounded-bl-full" />
        <div className="absolute bottom-12 right-12 text-brand-500/10 font-mono text-[40px] lg:text-[80px] font-bold select-none rotate-90 origin-bottom-right">
          REPOVG
        </div>
      </div>
    </div>
  );
}
