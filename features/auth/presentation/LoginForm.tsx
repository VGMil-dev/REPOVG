"use client";

import { Mail, Lock, Eye, EyeOff, Github } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";

interface LoginFormProps {
  loading: boolean;
  error: string | null;
  showPassword?: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onTogglePassword?: () => void;
}

export const LoginForm = ({
  loading,
  error,
  showPassword = false,
  onSubmit,
  onTogglePassword,
}: LoginFormProps) => {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <FormField
        label="Email"
        name="email"
        type="email"
        required
        placeholder="usuario@dominio.com"
        icon={<Mail className="h-4 w-4" />}
      />

      <div className="relative group">
        <FormField
          label="Contraseña"
          name="password"
          type={showPassword ? "text" : "password"}
          required
          placeholder="************"
          icon={<Lock className="h-4 w-4" />}
        />
        {onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-[38px] text-brand-900 hover:text-brand-500 transition-colors"
          >
            {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        )}
      </div>

      {error && (
        <Typography variant="terminal-sm" className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg !text-red-500 uppercase text-center animate-pulse">
          ERROR::{error}
        </Typography>
      )}

      <Button type="submit" loading={loading} className="w-full py-5 text-lg hover:scale-[1.02]">
        {loading ? "ACCEDIENDO_SISTEMA..." : "INICIAR SESIÓN"}
      </Button>

      <div className="flex items-center gap-3 text-xs text-brand-600">
        <div className="h-px flex-1 bg-brand-500/50" />
        <Typography variant="terminal-sm" as="span" className="!text-[10px] uppercase">Integración_Externa</Typography>
        <div className="h-px flex-1 bg-brand-500/50" />
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-brand-500/10 bg-black/40 py-4 font-terminal text-sm text-brand-300 hover:bg-brand-500/5 hover:border-brand-500/30 transition-all"
      >
        <Github className="h-5 w-5" />
        <Typography variant="body-sm" as="span">Continuar con GitHub</Typography>
      </button>
    </form>
  );
};
