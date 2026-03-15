"use client";

import { useState } from "react";
import { asignarAcceso } from "@/lib/admin/actions";
import { Typography } from "@/components/ui/Typography";
import { X, Key, User, BookOpen, Clock, ShieldCheck, Loader2 } from "lucide-react";

interface Props {
  usuarios: { id: string; nombre: string; email: string }[];
  materias: { id: string; titulo: string }[];
  semestres: { id: string; nombre: string }[];
}

export default function AsignarAccesoForm({ usuarios, materias, semestres }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tipo, setTipo] = useState<"activo" | "historico">("activo");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await asignarAcceso(formData);
    setOpen(false);
    setLoading(false);
  }

  return (
    <>
      <button 
        onClick={() => setOpen(true)} 
        className="btn-primary flex items-center gap-2 font-pixel text-xs px-6"
      >
        <Key className="w-4 h-4" /> ASIGNAR ACCESO
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-md bg-[#050505] border-2 border-brand-500/20 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.1)]">
            <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
            
            <div className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-8">
                <Typography as="h2" variant="brand-h3" glow className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-brand-500" /> Sincronizar Materia
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
                  <Typography variant="terminal-sm" className="!text-brand-500/50 uppercase">Sujeto Experimental (Usuario)</Typography>
                  <div className="relative group/field">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500/30 group-focus-within/field:text-brand-500 transition-colors" />
                    <select name="user_id" className="w-full bg-black/40 border-2 border-brand-500/10 rounded-xl py-3 pl-10 pr-4 font-terminal text-sm text-brand-300 focus:border-brand-500/40 focus:outline-none transition-all appearance-none" required>
                      <option value="" className="bg-[#050505]">Seleccionar Usuario...</option>
                      {usuarios.map((u) => (
                        <option key={u.id} value={u.id} className="bg-[#050505]">{u.nombre} — {u.email}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Typography variant="terminal-sm" className="!text-brand-500/50 uppercase">Módulo de Datos (Materia)</Typography>
                  <div className="relative group/field">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500/30 group-focus-within/field:text-brand-500 transition-colors" />
                    <select name="materia_id" className="w-full bg-black/40 border-2 border-brand-500/10 rounded-xl py-3 pl-10 pr-4 font-terminal text-sm text-brand-300 focus:border-brand-500/40 focus:outline-none transition-all appearance-none" required>
                      <option value="" className="bg-[#050505]">Seleccionar Materia...</option>
                      {materias.map((m) => (
                        <option key={m.id} value={m.id} className="bg-[#050505]">{m.titulo}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Typography variant="terminal-sm" className="!text-brand-500/50 uppercase">Protocolo</Typography>
                    <div className="relative group/field">
                      <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500/30 group-focus-within/field:text-brand-500 transition-colors" />
                      <select 
                        name="tipo" 
                        defaultValue="activo"
                        onChange={(e) => setTipo(e.target.value as any)}
                        className="w-full bg-black/40 border-2 border-brand-500/10 rounded-xl py-3 pl-10 pr-4 font-terminal text-sm text-brand-300 focus:border-brand-500/40 focus:outline-none transition-all appearance-none" 
                        required
                      >
                        <option value="activo" className="bg-[#050505]">ACTIVO</option>
                        <option value="historico" className="bg-[#050505]">HISTÓRICO</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Typography variant="terminal-sm" className="!text-brand-500/50 uppercase">Periodo</Typography>
                    <div className="relative group/field">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500/30 group-focus-within/field:text-brand-500 transition-colors" />
                      <select name="semestre_id" className="w-full bg-black/40 border-2 border-brand-500/10 rounded-xl py-3 pl-10 pr-4 font-terminal text-sm text-brand-300 focus:border-brand-500/40 focus:outline-none transition-all appearance-none">
                        <option value="" className="bg-[#050505]">GLOBAL</option>
                        {semestres.map((s) => (
                          <option key={s.id} value={s.id} className="bg-[#050505]">{s.nombre}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sección de Descripción / Info */}
                <div className="bg-brand-500/5 border border-brand-500/20 rounded-xl p-4 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="mt-0.5">
                    <Key className="w-4 h-4 text-brand-500 opacity-50" />
                  </div>
                  <div className="space-y-1">
                    <Typography variant="terminal-sm" className="!text-brand-500 font-bold uppercase tracking-wider">
                      Nota de Protocolo
                    </Typography>
                    <Typography variant="terminal-sm" className="!text-brand-300/70 leading-relaxed text-[10px]">
                      {tipo === 'activo' 
                        ? "Permite cursar la materia actualmente: realizar ejercicios, ganar XP y interactuar con la mascota en tiempo real." 
                        : "Acceso de consulta para materias aprobadas o periodos pasados. El progreso no afecta las métricas vigentes."}
                    </Typography>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setOpen(false)} 
                    className="flex-1 py-4 border-2 border-brand-500/10 rounded-xl hover:bg-white/5 transition-all outline-none"
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
                        <Key className="w-5 h-5 px-0" />
                        <Typography variant="pixel-label" className="!text-black !font-bold uppercase tracking-widest">Enlazar</Typography>
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
