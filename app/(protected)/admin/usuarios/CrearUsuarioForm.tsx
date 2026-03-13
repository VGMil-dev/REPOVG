"use client";

import { useState } from "react";
import { crearUsuario } from "@/lib/admin/actions";
import { UserPlus, X, Loader2, User, Mail, Lock, ShieldCheck } from "lucide-react";

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
                <h2 className="text-xl font-pixel text-white text-glow uppercase tracking-tighter flex items-center gap-3">
                  <UserPlus className="w-5 h-5 text-brand-500" /> Nuevo Recluta
                </h2>
                <button 
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="font-pixel text-[10px] text-brand-500/50 uppercase">Identidad</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500/30" />
                    <input 
                      name="nombre" 
                      placeholder="NOMBRE COMPLETO" 
                      required 
                      className="w-full bg-black/40 border-2 border-brand-500/10 rounded-xl py-3 pl-10 pr-4 font-mono text-sm text-brand-300 focus:border-brand-500/40 focus:outline-none transition-all placeholder:text-brand-900" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-pixel text-[10px] text-brand-500/50 uppercase">Canal de Enlace (Email)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500/30" />
                    <input 
                      name="email" 
                      type="email" 
                      placeholder="correo@ejemplo.com" 
                      required 
                      className="w-full bg-black/40 border-2 border-brand-500/10 rounded-xl py-3 pl-10 pr-4 font-mono text-sm text-brand-300 focus:border-brand-500/40 focus:outline-none transition-all placeholder:text-brand-900" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-pixel text-[10px] text-brand-500/50 uppercase">Código de Acceso (Password)</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500/30" />
                    <input 
                      name="password" 
                      type="password" 
                      placeholder="••••••••" 
                      required 
                      className="w-full bg-black/40 border-2 border-brand-500/10 rounded-xl py-3 pl-10 pr-4 font-mono text-sm text-brand-300 focus:border-brand-500/40 focus:outline-none transition-all placeholder:text-brand-900" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-pixel text-[10px] text-brand-500/50 uppercase">Protocolo de Rol</label>
                  <div className="relative text-brand-300">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500/30" />
                    <select 
                      name="rol" 
                      className="w-full bg-black/40 border-2 border-brand-500/10 rounded-xl py-3 pl-10 pr-4 font-mono text-sm focus:border-brand-500/40 focus:outline-none transition-all appearance-none" 
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
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 font-terminal text-[10px] uppercase text-center animate-pulse">
                    ERROR_EN_RECLUTAMIENTO: {error}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setOpen(false)} 
                    className="flex-1 py-4 border-2 border-brand-500/10 rounded-xl font-pixel text-[10px] text-gray-500 hover:bg-white/5 hover:text-white transition-all uppercase"
                  >
                    Abortar
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="flex-[2] py-4 bg-brand-500 text-black rounded-xl font-pixel text-[10px] hover:bg-brand-400 transition-all flex items-center justify-center gap-2 uppercase font-bold"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Iniciar Sincronización"}
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
