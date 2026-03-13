"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export const Button = ({ 
  variant = "primary", 
  children, 
  className = "", 
  loading = false,
  ...props 
}: ButtonProps) => {
  const baseStyles = "transition-all font-pixel text-xs rounded-sm focus:outline-none";
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      disabled={loading}
      {...props}
    >
      {children}
    </button>
  );
};
