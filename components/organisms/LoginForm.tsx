"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Github } from "lucide-react";
import { FormField } from "../shared/FormField";
import { Button } from "../ui/Button";
import { login } from "@/lib/auth/actions";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError("Credenciales incorrectas. Intenta de nuevo.");
      setLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
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
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[38px] text-brand-900 hover:text-brand-500 transition-colors"
        >
          {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 font-terminal text-xs uppercase text-center animate-pulse">
          ERROR::{error}
        </div>
      )}

      <Button type="submit" loading={loading} className="w-full py-5 text-lg hover:scale-[1.02]">
        {loading ? "ACCEDIENDO_SISTEMA..." : "INICIAR SESIÓN"}
      </Button>

      <div className="flex items-center gap-3 text-xs text-brand-600">
        <div className="h-px flex-1 bg-brand-500/50" />
        <span className="font-terminal text-[10px] uppercase">Integración_Externa</span>
        <div className="h-px flex-1 bg-brand-500/50" />
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-brand-500/10 bg-black/40 py-4 font-terminal text-sm text-brand-300 hover:bg-brand-500/5 hover:border-brand-500/30 transition-all"
      >
        <Github className="h-5 w-5" />
        Continuar con GitHub
      </button>
    </form>
  );
};
