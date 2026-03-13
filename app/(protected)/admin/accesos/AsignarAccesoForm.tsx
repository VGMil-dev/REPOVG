"use client";

import { useState } from "react";
import { asignarAcceso } from "@/lib/admin/actions";

interface Props {
  usuarios: { id: string; nombre: string; email: string }[];
  materias: { id: string; titulo: string }[];
  semestres: { id: string; nombre: string }[];
}

export default function AsignarAccesoForm({ usuarios, materias, semestres }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
      <button onClick={() => setOpen(true)} className="btn-primary">
        + Asignar acceso
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md">
            <h2 className="text-lg font-bold text-white mb-4">Asignar acceso a materia</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select name="user_id" className="input" required>
                <option value="">Selecciona un usuario</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>{u.nombre} — {u.email}</option>
                ))}
              </select>
              <select name="materia_id" className="input" required>
                <option value="">Selecciona una materia</option>
                {materias.map((m) => (
                  <option key={m.id} value={m.id}>{m.titulo}</option>
                ))}
              </select>
              <select name="tipo" className="input" required>
                <option value="activo">Activo</option>
                <option value="historico">Histórico</option>
              </select>
              {semestres.length > 0 && (
                <select name="semestre_id" className="input">
                  <option value="">Sin semestre</option>
                  {semestres.map((s) => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                  ))}
                </select>
              )}
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setOpen(false)} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? "Asignando..." : "Asignar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
