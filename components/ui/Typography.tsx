"use client";

import React from "react";

type TypographyVariant = 
  | "brand-h1" 
  | "brand-h2" 
  | "brand-h3"
  | "brand-h4"
  | "subheader" 
  | "body" 
  | "body-lg"
  | "body-sm"
  | "body-xs"
  | "terminal-sm" 
  | "pixel-label"
  | "pixel-badge";

interface Props {
  as?: React.ElementType;
  variant?: TypographyVariant;
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

const variantStyles: Record<TypographyVariant, string> = {
  "brand-h1": "font-pixel text-[clamp(1.5rem,5vw,3.5rem)] leading-[1.1] uppercase tracking-tighter text-white",
  "brand-h2": "font-pixel text-[clamp(1.2rem,4vw,2.5rem)] leading-tight uppercase tracking-tighter text-orange-500",
  "brand-h3": "font-pixel text-[clamp(1rem,3vw,1.75rem)] leading-tight uppercase tracking-tighter text-white",
  "brand-h4": "font-pixel text-[clamp(0.8rem,2vw,1.25rem)] leading-tight uppercase tracking-widest text-brand-500",
  "subheader": "font-terminal text-[clamp(0.9rem,2vw,1.25rem)] leading-relaxed uppercase tracking-widest text-gray-400 border-l-2 border-gray-800 pl-4",
  "body": "font-terminal text-base leading-relaxed tracking-wide text-gray-300",
  "body-lg": "font-terminal text-lg leading-relaxed tracking-wide text-gray-200",
  "body-sm": "font-terminal text-sm leading-relaxed tracking-wide text-gray-400",
  "body-xs": "font-terminal text-xs leading-relaxed tracking-wide text-gray-500",
  "terminal-sm": "font-terminal text-[10px] lg:text-xs uppercase tracking-widest text-gray-500",
  "pixel-label": "font-pixel text-[8px] lg:text-[10px] uppercase tracking-widest",
  "pixel-badge": "font-pixel text-[9px] uppercase tracking-tighter text-brand-500",
};

const glowStyles: Partial<Record<TypographyVariant, string>> = {
  "brand-h1": "text-glow",
  "brand-h2": "text-glow-orange",
};

export const Typography = ({ 
  as: Component = "p", 
  variant = "body", 
  children, 
  className = "", 
  glow = false 
}: Props) => {
  const styles = [
    variantStyles[variant],
    glow ? (glowStyles[variant] || "text-glow") : "",
    className
  ].filter(Boolean).join(" ");

  return (
    <Component className={styles}>
      {children}
    </Component>
  );
};
