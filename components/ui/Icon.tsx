"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface IconProps {
  icon: LucideIcon;
  className?: string;
  glow?: boolean;
  glowColor?: "brand" | "orange";
}

export const Icon = ({ 
  icon: LucideIcon, 
  className = "w-5 h-5", 
  glow = false, 
  glowColor = "brand" 
}: IconProps) => {
  const glowClass = glow 
    ? (glowColor === "brand" ? "text-glow" : "text-glow-orange") 
    : "";
    
  return <LucideIcon className={`${className} ${glowClass}`} />;
};
