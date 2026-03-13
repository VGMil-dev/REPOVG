'use client'

import { useState } from 'react'
import { crearUsuario } from '@/lib/admin/actions'
import { Plus, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

export default function CreateUserForm() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await crearUsuario(new FormData(e.currentTarget))
    setLoading(false)
    if (result?.error) { setError(result.error); return }
    setSuccess(true)
    setTimeout(() => { setOpen(false); setSuccess(false) }, 1200)
  }

  const inputStyle = {
    width: '100%', background: 'var(--bg-elevated)',
    border: '1px solid var(--border-mid)', borderRadius: '8px',
    padding: '0.6rem 0.85rem', color: 'var(--text-1)',
    fontSize: '0.875rem', fontFamily: 'Literata, serif', outline: 'none',
  }

  const labelStyle = {
    display: 'block', fontSize: '0.75rem', fontFamily: 'Syne, sans-serif',
    fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.05em',
    color: 'var(--text-3)', marginBottom: '0.35rem',
  }

  return (
    <>
      <button onClick={() => setOpen(true)} style={{
        display: 'flex', alignItems: 'center', gap: '0.45rem',
        background: 'var(--accent)', color: '#000', border: 'none',
        borderRadius: '8px', padding: '0.55rem 1rem',
        fontFamily: 'Syne, sans-serif', fontSize: '0.85rem', fontWeight: 700,
        cursor: 'pointer', letterSpacing: '0.01em',
      }}>
        <Plus size={15} /> Nuevo Usuario
      </button>

      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }} onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}>
          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border-mid)',
            borderRadius: '14px', padding: '1.75rem', width: '100%', maxWidth: '420px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-1)' }}>
                Nuevo Usuario
              </h2>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
                color: 'var(--danger)', borderRadius: '8px', padding: '0.6rem 0.85rem',
                fontSize: '0.82rem', marginBottom: '1rem',
              }}>
                <AlertCircle size={13} /> {error}
              </div>
            )}

            {success && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)',
                color: 'var(--success)', borderRadius: '8px', padding: '0.6rem 0.85rem',
                fontSize: '0.82rem', marginBottom: '1rem',
              }}>
                <CheckCircle size={13} /> Usuario creado exitosamente
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Nombre completo</label>
                <input name="nombre" type="text" placeholder="Ana García" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input name="email" type="email" placeholder="ana@email.com" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Contraseña temporal</label>
                <input name="password" type="password" placeholder="mínimo 6 caracteres" required minLength={6} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Rol</label>
                <select name="rol" required style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="estudiante">Estudiante</option>
                  <option value="exalumno">Ex-alumno</option>
                  <option value="profesor">Profesor</option>
                </select>
              </div>
              <button type="submit" disabled={loading} style={{
                marginTop: '0.25rem', height: '42px',
                background: 'var(--accent)', color: '#000', border: 'none',
                borderRadius: '8px', fontFamily: 'Syne, sans-serif',
                fontSize: '0.875rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '0.5rem',
              }}>
                {loading ? <><Loader2 size={15} className="animate-spin" /> Creando…</> : 'Crear Usuario'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
