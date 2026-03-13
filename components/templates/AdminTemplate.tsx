"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard } from "lucide-react";

interface AdminTemplateProps {
  children: React.ReactNode;
  visualContent?: React.ReactNode;
  title: string;
  subtitle: string;
  accentTitle?: string;
  sidebar?: React.ReactNode;
}

export const AdminTemplate = ({
  children,
  visualContent,
  title,
  accentTitle,
  subtitle,
  sidebar
}: AdminTemplateProps) => {
  return (
    <div className="relative h-screen w-screen flex flex-col lg:flex-row bg-[#050505] overflow-hidden text-white">


      {/* Main Content Area - Full width */}
      <div className="relative z-10 w-full flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 md:px-12 lg:px-16 py-12 flex flex-col scrollbar-hide">
          {/* Header - Only render if title or subtitle is provided */}
          {(title || subtitle) && (
            <header className="mb-12">
              <h1 className="text-4xl lg:text-5xl font-pixel mb-4 tracking-tighter leading-tight uppercase">
                {accentTitle && <span className="text-orange-500 text-glow-orange block">{accentTitle}</span>}
                <span className="text-brand-500 text-glow block">{title}</span>
              </h1>
              <p className="font-terminal text-white/60 text-xs lg:text-sm uppercase tracking-widest leading-relaxed border-l-2 border-brand-500/20 pl-4">
                {subtitle}
              </p>
            </header>
          )}

          {!title && !subtitle && (
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-brand-500/10" />
            </div>
          )}

          <main className="flex-1 min-h-0">
            {children}
          </main>

          <footer className="mt-12 pt-6 border-t border-brand-500/10 flex justify-between items-center opacity-40">
            <div className="font-terminal text-[10px] text-white/30 uppercase tracking-widest">
              SISTEMA OPERATIVO REPOVG v1.0.4
            </div>
          </footer>
        </div>
      </div>


    </div>
  );
};
