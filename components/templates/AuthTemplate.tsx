import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AuthTemplateProps {
  children: React.ReactNode;
  visualContent: React.ReactNode;
  title: string;
  subtitle: string;
  accentTitle?: string;
  footer?: React.ReactNode;
}

export const AuthTemplate = ({
  children,
  visualContent,
  title,
  accentTitle,
  subtitle,
  footer
}: AuthTemplateProps) => {
  return (
    <div className="relative h-screen flex flex-col lg:flex-row bg-[#050505] overflow-hidden text-gray-100">
      {/* Scanlines overlay */}
      <div className="pointer-events-none fixed inset-0 scanlines opacity-20 z-0" />

      {/* Left Column: Form area - Viewport constrained */}
      <div className="relative z-10 w-full lg:w-3/5 flex flex-col h-full overflow-hidden">
        {/* Scrollable container for the form content if needed on small screens */}
        <div className="flex-1 overflow-y-auto px-8 md:px-16 lg:px-24 py-12 flex flex-col justify-center scrollbar-hide">
          {/* Decorative corner brackets */}
          <div className="absolute top-12 left-12 w-8 h-8 border-t-2 border-l-2 border-brand-500/30 pointer-events-none" />
          <div className="absolute bottom-12 left-12 w-8 h-8 border-b-2 border-l-2 border-brand-500/30 pointer-events-none" />

          {/* Left vertical border decoration */}
          <div className="absolute left-8 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-brand-500/20 to-transparent pointer-events-none" />

          <div className="max-w-md w-full mx-auto lg:mx-0">
            <div className="mb-8 lg:mb-12">
              <Link href="/" className="inline-flex items-center gap-2 text-brand-500/60 hover:text-brand-400 transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-terminal text-sm tracking-wider uppercase">Volver al Inicio</span>
              </Link>
            </div>

            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-pixel mb-4 tracking-tighter leading-tight uppercase">
                {accentTitle && <span className="text-orange-500 text-glow-orange block">{accentTitle}</span>}
                <span className="text-brand-500 text-glow block">{title}</span>
              </h1>
              <p className="font-terminal text-gray-300 text-sm uppercase tracking-widest leading-relaxed">
                {subtitle}
              </p>
            </div>

            {children}

            {footer && (
              <footer className="mt-8 lg:mt-12 pt-8 border-t border-brand-500/10">
                {footer}
              </footer>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Visual Component - Height constrained */}
      <div className="hidden lg:flex relative w-2/5 bg-black border-l border-brand-500/10 overflow-hidden h-full">
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(var(--brand-500) 1px, transparent 1px), linear-gradient(90deg, var(--brand-500) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {visualContent}

        {/* HUD Elements */}
        <div className="absolute top-8 right-8 text-brand-500/20 font-terminal text-[10px] vertical-text select-none">
          REPOVG_AUTH_SYSTEM_V.1.0
        </div>
      </div>
    </div>
  );
};
