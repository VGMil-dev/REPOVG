"use client";

import React from "react";
import { Input } from "../ui/Input";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  as?: "input" | "select";
  children?: React.ReactNode;
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
