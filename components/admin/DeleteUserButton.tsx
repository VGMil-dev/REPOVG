'use client'

import { useState } from 'react'
import { eliminarUsuario } from '@/lib/auth/actions'
import { Trash2, Loader2 } from 'lucide-react'

export default function DeleteUserButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) return
    setLoading(true)
    await eliminarUsuario(userId)
    setLoading(false)
  }

  return (
    <button onClick={handleDelete} disabled={loading} title="Eliminar usuario" style={{
      background: 'none', border: 'none',
      color: loading ? 'var(--text-3)' : 'var(--text-3)',
      cursor: loading ? 'not-allowed' : 'pointer',
      padding: '0.35rem', borderRadius: '6px',
      display: 'flex', alignItems: 'center', transition: 'color 0.1s, background 0.1s',
    }}
    onMouseEnter={e => {
      if (!loading) {
        (e.currentTarget as HTMLElement).style.color = 'var(--danger)'
        ;(e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.1)'
      }
    }}
    onMouseLeave={e => {
      ;(e.currentTarget as HTMLElement).style.color = 'var(--text-3)'
      ;(e.currentTarget as HTMLElement).style.background = 'none'
    }}>
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
    </button>
  )
}
