"use client";

import { useState } from "react";
import { crearUsuario } from "@/lib/admin/actions";
import { UserPlus, X, Loader2, User, Mail, Lock, ShieldCheck, Database } from "lucide-react";
import { Typography } from "@/components/ui/Typography";

export default function CrearUsuarioForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await crearUsuario(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setOpen(false);
      setLoading(false);
    }
  }

  return (
    <>
      <button 
        onClick={() => setOpen(true)} 
        className="btn-primary flex items-center gap-2 font-pixel text-xs px-6"
      >
        <UserPlus className="w-4 h-4" /> RECLUTAR NUEVO
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-md bg-[#050505] border-2 border-brand-500/20 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.1)]">
            {/* Scanlines Effect */}
            <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
            
            <div className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-8">
                <Typography as="h2" variant="brand-h3" glow className="flex items-center gap-3">
                  <UserPlus className="w-5 h-5 text-brand-500" /> Nuevo Recluta
                </Typography>
                <button 
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Typography variant="terminal-sm" className="!text-brand-500/50 uppercase">Identidad</Typography>
                  <div className="relative group/field">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500/30 group-focus-within/field:text-brand-500 transition-colors" />
                    <input 
                      name="nombre" 
                      placeholder="NOMBRE COMPLETO" 
                      required 
                      className="w-full bg-black/40 border-2 border-brand-500/10 rounded-xl py-3 pl-10 pr-4 font-terminal text-sm text-brand-300 focus:border-brand-500/40 focus:outline-none transition-all placeholder:text-brand-900" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Typography variant="terminal-sm" className="!text-brand-500/50 uppercase">Canal de Enlace (Email)</Typography>
                  <div className="relative group/field">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500/30 group-focus-within/field:text-brand-500 transition-colors" />
                    <input 
                      name="email" 
                      type="email" 
                      placeholder="correo@ejemplo.com" 
                      required 
                      className="w-full bg-black/40 border-2 border-brand-500/10 rounded-xl py-3 pl-10 pr-4 font-terminal text-sm text-brand-300 focus:border-brand-500/40 focus:outline-none transition-all placeholder:text-brand-900" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Typography variant="terminal-sm" className="!text-brand-500/50 uppercase">Código de Acceso (Password)</Typography>
                  <div className="relative group/field">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500/30 group-focus-within/field:text-brand-500 transition-colors" />
                    <input 
                      name="password" 
                      type="password" 
                      placeholder="••••••••" 
                      required 
                      className="w-full bg-black/40 border-2 border-brand-500/10 rounded-xl py-3 pl-10 pr-4 font-terminal text-sm text-brand-300 focus:border-brand-500/40 focus:outline-none transition-all placeholder:text-brand-900" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Typography variant="terminal-sm" className="!text-brand-500/50 uppercase">Protocolo de Rol</Typography>
                  <div className="relative text-brand-300 group/field">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500/30 group-focus-within/field:text-brand-500 transition-colors" />
                    <select 
                      name="rol" 
                      className="w-full bg-black/40 border-2 border-brand-500/10 rounded-xl py-3 pl-10 pr-4 font-terminal text-sm focus:border-brand-500/40 focus:outline-none transition-all appearance-none" 
                      required
                    >
                      <option value="estudiante" className="bg-[#050505] text-brand-300 uppercase">Estudiante</option>
                      <option value="exalumno" className="bg-[#050505] text-brand-300 uppercase">Ex-alumno</option>
                      <option value="externo" className="bg-[#050505] text-brand-300 uppercase">Externo</option>
                      <option value="profesor" className="bg-[#050505] text-brand-300 uppercase">Profesor (Admin)</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center animate-pulse">
                    <Typography variant="terminal-sm" className="!text-red-500 uppercase">
                      ERROR_EN_RECLUTAMIENTO: {error}
                    </Typography>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setOpen(false)} 
                    className="flex-1 py-4 border-2 border-brand-500/10 rounded-xl hover:bg-white/5 transition-all"
                  >
                    <Typography variant="pixel-label" className="!text-gray-500 group-hover:!text-white uppercase">Abortar</Typography>
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="flex-[2] py-4 bg-brand-500 text-black rounded-xl hover:bg-brand-400 transition-all shadow-[0_4px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_4px_25px_rgba(34,197,94,0.4)] flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Database className="w-5 h-5" />
                        <Typography variant="pixel-label" className="!text-black !font-bold uppercase tracking-widest">Sincronizar</Typography>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
