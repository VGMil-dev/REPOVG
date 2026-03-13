"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  as?: "input" | "select";
  icon?: React.ReactNode;
  className?: string;
}

export const Input = ({ 
  as: Component = "input", 
  icon, 
  className = "", 
  ...props 
}: InputProps) => {
  return (
    <div className="relative group">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-500/40 group-focus-within:text-brand-500/70 transition-colors">
          {icon}
        </div>
      )}
      <Component
        className={`w-full bg-black/40 border-2 border-brand-500/20 rounded-lg py-4 ${icon ? 'pl-10' : 'px-4'} pr-4 font-mono text-sm text-brand-200 focus:border-brand-500/60 focus:outline-none transition-all placeholder:text-brand-900 shadow-[inset_0_0_10px_rgba(34,197,94,0.05)] ${className}`}
        {...props as any}
      />
    </div>
  );
};
