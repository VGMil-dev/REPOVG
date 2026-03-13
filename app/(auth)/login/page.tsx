"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Github, ArrowLeft } from "lucide-react";
import { login } from "@/lib/auth/actions";

const LoginPage = () => {
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
    <div className="relative min-h-screen flex flex-col lg:flex-row bg-[#050505] overflow-hidden text-gray-100">
      {/* Scanlines overlay */}
      <div className="pointer-events-none fixed inset-0 scanlines opacity-20 z-0" />

      {/* Left Column: Login form */}
      <div className="relative z-10 w-full lg:w-3/5 flex flex-col justify-center p-8 md:p-16 lg:p-24 overflow-y-auto">
        {/* Decorative corner brackets */}
        <div className="absolute top-12 left-12 w-8 h-8 border-t-2 border-l-2 border-brand-500/30" />
        <div className="absolute bottom-12 left-12 w-8 h-8 border-b-2 border-l-2 border-brand-500/30" />

        {/* Left vertical border decoration */}
        <div className="absolute left-8 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-brand-500/20 to-transparent" />

        <div className="max-w-md w-full mx-auto md:mx-0">
          <div className="mb-12">
            <Link href="/" className="inline-flex items-center gap-2 text-brand-500/60 hover:text-brand-400 transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-terminal text-sm tracking-wider uppercase">Volver al Inicio</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-pixel mb-4 tracking-tighter leading-tight">
              <span className="text-orange-500 text-glow-orange block">INICIAR</span>
              <span className="text-brand-500 text-glow">SESIÓN</span>
            </h1>
            <p className="font-terminal text-gray-300 text-sm uppercase tracking-widest">
              Identifícate para acceder al Núcleo de RepoVG
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="font-pixel text-[10px] text-brand-500/70 uppercase block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-500/40" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="usuario@dominio.com"
                  className="w-full bg-black/40 border-2 border-brand-500/20 rounded-lg py-4 pl-10 pr-4 font-mono text-sm text-brand-200 focus:border-brand-500/60 focus:outline-none transition-all placeholder:text-brand-900 shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-pixel text-[10px] text-brand-500/70 uppercase block">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-500/40" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="************"
                  className="w-full bg-black/40 border-2 border-brand-500/20 rounded-lg py-4 pl-10 pr-12 font-mono text-sm text-brand-200 focus:border-brand-500/60 focus:outline-none transition-all placeholder:text-brand-900 shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-900 hover:text-brand-500 transition-colors"
                >
                  {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 font-terminal text-xs uppercase text-center animate-pulse">
                ERROR::{error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-5 flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
            >
              {loading ? "ACCEDIENDO_SISTEMA..." : "INICIAR SESIÓN"}
            </button>

            <div className="flex items-center gap-3 text-xs text-brand-600">
              <div className="h-px flex-1 bg-brand-500/50" />
              <span className="font-terminal text-xs uppercase">Integración_Externa</span>
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

          <footer className="mt-12 pt-8 border-t border-brand-500/10">
            <p className="font-terminal text-md text-brand-500 tracking-wider">
              ¿ERES EXTERNO?{" "}
              <Link href="/register" className="text-brand-400 hover:text-brand-500 font-bold transition-colors underline decoration-brand-500/30 underline-offset-4">
                REGÍSTRATE AQUÍ
              </Link>
            </p>
          </footer>
        </div>
      </div>

      {/* Right Column: Visual Component */}
      <div className="hidden lg:flex relative w-2/5 bg-black border-l border-brand-500/10 overflow-hidden">
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(var(--brand-500) 1px, transparent 1px), linear-gradient(90deg, var(--brand-500) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Centered Mascot with Bubble */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 select-none">
          <div className="relative flex flex-col items-center">
            {/* Mascot Bubble Message */}
            <div className="absolute -top-36 left-1/2 -translate-x-1/2 mb-8 animate-float-subtle group">
              <div className="relative w-[220px] h-[100px] flex items-center justify-center">
                <img
                  src="/assets/mascot/speech-bubble.webp"
                  alt="Speech Bubble"
                  className="absolute z-10 top-39 w-full h-fit object-cover pixelated pointer-events-none"
                />
                <p className="font-pixel text-[10px] text-black leading-tight text-center relative z-10 px-6 pb-2 mb-2">
                  TU COMPAÑERO TE ESPERA...
                </p>
              </div>
            </div>

            {/* The Mascot */}
            <div className="mascot-sprite scale-[2] drop-shadow-[0_0_60px_rgba(34,197,94,0.4)]" />
          </div>
        </div>

        {/* HUD Elements */}
        <div className="absolute top-8 right-8 text-brand-500/20 font-terminal text-[10px] vertical-text select-none">
          REPOVG_AUTH_V.1.0_STABLE
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
