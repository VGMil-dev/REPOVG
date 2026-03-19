"use client";

import React from "react";
import { Input } from "../ui/Input";
import { Typography } from "../ui/Typography";

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
      <Typography variant="pixel-label" as="label" className="text-brand-500/70 uppercase block tracking-wider">
        {label}
      </Typography>
      <Input {...inputProps} />
      {error && (
        <Typography variant="terminal-sm" className="!text-red-500 uppercase tracking-tighter animate-pulse">
          ERROR::{error}
        </Typography>
      )}
    </div>
  );
};
