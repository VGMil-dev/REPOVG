"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus, Loader2, Mail, Lock, User, ShieldCheck, Zap, Globe } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("estudiante");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre,
            rol,
          },
        },
      });

      if (signUpError) throw signUpError;

      router.push("/login?message=¡Registro exitoso! Por favor verifica tu email.");
    } catch (err: any) {
      setError(err.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row bg-[#050505] overflow-hidden">
      {/* Scanlines Effect */}
      <div className="pointer-events-none fixed inset-0 scanlines opacity-20 z-0" />

      {/* Left Column: Content & Form */}
      <div className="relative z-10 w-full lg:w-3/5 flex flex-col justify-center p-8 md:p-16 lg:p-24 overflow-y-auto">
        {/* Decorative corner brackets */}
        <div className="absolute top-12 left-12 w-8 h-8 border-t-2 border-l-2 border-brand-500/30" />
        <div className="absolute bottom-12 left-12 w-8 h-8 border-b-2 border-l-2 border-brand-500/30" />

        {/* Left vertical border decoration */}
        <div className="absolute left-8 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-brand-500/20 to-transparent" />

        {/* Back Button */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-brand-500/60 hover:text-brand-400 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-terminal text-sm tracking-wider uppercase">Volver al Inicio</span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto md:mx-0">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-pixel mb-4 tracking-tighter leading-tight">
              <span className="text-orange-500 text-glow-orange block">NUEVO</span>
              <span className="text-brand-500 text-glow">RECLUTA</span>
            </h1>
            <p className="font-terminal text-gray-300 text-sm uppercase tracking-widest">
              Comienza tu entrenamiento en RepoVG
            </p>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-pixel text-[10px] text-brand-500/70 uppercase">Identidad Real</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500/40" />
                <input
                  type="text"
                  placeholder="NOMBRE APELLIDO"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-black/40 border-2 border-brand-500/20 rounded-lg py-4 pl-10 pr-4 font-mono text-sm text-brand-200 focus:border-brand-500/60 focus:outline-none transition-all placeholder:text-brand-900 shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-pixel text-[10px] text-brand-500/70 uppercase">Correo Electronico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500/40" />
                <input
                  type="email"
                  placeholder="estudiante@repovg.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border-2 border-brand-500/20 rounded-lg py-4 pl-10 pr-4 font-mono text-sm text-brand-200 focus:border-brand-500/60 focus:outline-none transition-all placeholder:text-brand-900 shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-pixel text-[10px] text-brand-500/70 uppercase">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500/40" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border-2 border-brand-500/20 rounded-lg py-4 pl-10 pr-4 font-mono text-sm text-brand-200 focus:border-brand-500/60 focus:outline-none transition-all placeholder:text-brand-900 shadow-[inset_0_0_10px_rgba(34,197,94,0.05)]"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-pixel text-[10px] text-brand-500/70 uppercase">Rol de Acceso</label>
              <div className="relative text-brand-200">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500/40" />
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  className="w-full bg-black/40 border-2 border-brand-500/20 rounded-lg py-4 pl-10 pr-4 font-mono text-sm focus:border-brand-500/60 focus:outline-none transition-all shadow-[inset_0_0_10px_rgba(34,197,94,0.05)] appearance-none"
                >
                  <option value="estudiante" className="bg-[#050505] text-brand-300">ESTUDIANTE</option>
                  <option value="profesor" className="bg-[#050505] text-brand-300">PROFESOR (ADMIN)</option>
                  <option value="externo" className="bg-[#050505] text-brand-300">EXTERNO</option>
                  <option value="exalumno" className="bg-[#050505] text-brand-300">EXALUMNO</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 font-terminal text-xs uppercase text-center animate-pulse">
                SISTEMA_ERROR: {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-5 flex items-center justify-center gap-3 group mt-4 text-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  GENERAR CUENTA <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </form>
          <footer className="mt-12 pt-8 border-t border-brand-500/10">
            <p className="font-terminal text-md text-brand-500 tracking-wider">
              ¿YA TIENES ACCESO?{" "}
              <Link href="/login" className="text-brand-400 hover:text-brand-500 font-bold transition-colors underline decoration-brand-500/30 underline-offset-4">
                INGRESAR AQUÍ
              </Link>
            </p>
          </footer>
        </div>
      </div>

      {/* Right Column: Visuals */}
      <div className="hidden md:flex relative w-2/5 bg-black border-l border-brand-500/10 overflow-hidden">
        {/* Background Decorative Grid/Dots */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(var(--brand-500) 1px, transparent 1px), linear-gradient(90deg, var(--brand-500) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Large Central Mascot */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
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
                  BIENVENIDO RECLUTA...
                </p>
              </div>
            </div>
            {/* Mascot Sprite */}
            <div className="mascot-sprite scale-[2] drop-shadow-[0_0_60px_rgba(34,197,94,0.4)]" />
          </div>
        </div>

        {/* Decorative Borders */}
        <div className="absolute top-8 right-8 text-brand-500/20 font-terminal text-[10px] vertical-text select-none">
          REPOVG_CORE_SYSTEM_V.1.0_BUILD_2026
        </div>
      </div>
    </div>
  );
}

// Estilo para el texto vertical
const styles = `
  .vertical-text {
    writing-mode: vertical-rl;
  }
  @keyframes loading {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(300%); }
  }
`;
