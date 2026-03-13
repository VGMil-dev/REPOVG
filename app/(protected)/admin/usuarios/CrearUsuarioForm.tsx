"use client";

import { useState } from "react";
import { crearUsuario } from "@/lib/admin/actions";

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
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary">
        + Crear usuario
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md">
            <h2 className="text-lg font-bold text-white mb-4">Crear usuario</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="nombre" placeholder="Nombre completo" required className="input" />
              <input name="email" type="email" placeholder="Email" required className="input" />
              <input name="password" type="password" placeholder="Contraseña temporal" required className="input" />
              <select name="rol" className="input" required>
                <option value="estudiante">Estudiante</option>
                <option value="exalumno">Ex-alumno</option>
                <option value="externo">Externo</option>
              </select>
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setOpen(false)} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? "Creando..." : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
