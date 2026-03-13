'use client'

import { useState } from 'react'
import { revocarAcceso, cambiarTipoAcceso } from '@/lib/auth/actions'
import { Trash2, RefreshCw, Loader2 } from 'lucide-react'

export default function AccesoActions({ accesoId, tipoActual }: {
  accesoId: string
  tipoActual: 'activo' | 'historico'
}) {
  const [loading, setLoading] = useState<'toggle' | 'delete' | null>(null)

  async function handleToggle() {
    setLoading('toggle')
    await cambiarTipoAcceso(accesoId, tipoActual === 'activo' ? 'historico' : 'activo')
    setLoading(null)
  }

  async function handleDelete() {
    if (!confirm('¿Revocar este acceso?')) return
    setLoading('delete')
    await revocarAcceso(accesoId)
    setLoading(null)
  }

  const btnBase = {
    background: 'none', border: 'none', padding: '0.35rem', borderRadius: '6px',
    cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.1s',
  }

  return (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      <button
        onClick={handleToggle}
        disabled={loading !== null}
        title={tipoActual === 'activo' ? 'Pasar a histórico' : 'Reactivar'}
        style={{ ...btnBase, color: 'var(--text-3)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; (e.currentTarget as HTMLElement).style.background = 'var(--accent-dim)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-3)'; (e.currentTarget as HTMLElement).style.background = 'none' }}
      >
        {loading === 'toggle' ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
      </button>
      <button
        onClick={handleDelete}
        disabled={loading !== null}
        title="Revocar acceso"
        style={{ ...btnBase, color: 'var(--text-3)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--danger)'; (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.1)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-3)'; (e.currentTarget as HTMLElement).style.background = 'none' }}
      >
        {loading === 'delete' ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
      </button>
    </div>
  )
}
