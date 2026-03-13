"use client";

import React from "react";
import { Input } from "../ui/Input";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label: string;
  name: string;
  icon?: React.ReactNode;
  as?: "input" | "select";
  error?: string | null;
}

export const FormField = ({ 
  label, 
  error, 
  ...inputProps 
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="font-pixel text-[10px] text-brand-500/70 uppercase block tracking-wider">
        {label}
      </label>
      <Input {...inputProps} />
      {error && (
        <p className="font-terminal text-[10px] text-red-500 uppercase tracking-tighter animate-pulse">
          ERROR::{error}
        </p>
      )}
    </div>
  );
};
