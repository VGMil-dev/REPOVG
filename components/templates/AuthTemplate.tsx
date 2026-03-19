import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Typography } from "@/components/ui/Typography";

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
        <div className="flex-1 overflow-y-auto px-8 md:px-16 lg:px-24 py-12 flex flex-col scrollbar-hide">
          {/* Decorative corner brackets */}
          <div className="absolute top-12 left-12 w-8 h-8 border-t-2 border-l-2 border-brand-500/30 pointer-events-none" />
          <div className="absolute bottom-12 left-12 w-8 h-8 border-b-2 border-l-2 border-brand-500/30 pointer-events-none" />

          {/* Left vertical border decoration */}
          <div className="absolute left-8 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-brand-500/20 to-transparent pointer-events-none" />

          <div className="max-w-md w-full mx-auto lg:mx-0 my-auto py-4">
            <div className="mb-6 lg:mb-10">
              <Link href="/" className="inline-flex items-center gap-2 text-brand-500/60 hover:text-brand-400 transition-colors group">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                <Typography variant="terminal-sm">Volver al Inicio</Typography>
              </Link>
            </div>

            <div className="mb-6">
              <Typography as="h1" variant="brand-h1" glow className="flex flex-col mb-3">
                {accentTitle && <Typography as="span" variant="brand-h2" glow className="!text-orange-500">{accentTitle}</Typography>}
                <span>{title}</span>
              </Typography>
              <Typography variant="terminal-sm" className="!text-gray-300">
                {subtitle}
              </Typography>
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
        <Typography variant="terminal-sm" className="absolute top-8 right-8 !text-brand-500/20 vertical-text select-none">
          FRAGMENTS_AUTH_SYSTEM_V.1.0
        </Typography>
      </div>
    </div>
  );
};
