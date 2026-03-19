/**
 * infrastructure/content/db-reader.ts
 * Funciones de lectura de contenido educativo desde Supabase.
 * Complementa a reader.ts (filesystem) durante la transición a DB.
 */

import { createClient } from '@/infrastructure/supabase/server'
import type { DBMateria, DBMateriaConSecciones, DBSeccion, DBTema } from './models'

// ─── Materias ──────────────────────────────────────────────────────────────

export async function getMaterias(): Promise<DBMateria[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('materias')
    .select('*')
    .order('titulo')

  if (error) {
    console.error('[db-reader] getMaterias:', error.message)
    return []
  }

  return data as DBMateria[]
}

export async function getMateriaBySlug(slug: string): Promise<DBMateriaConSecciones | null> {
  const supabase = await createClient()

  const { data: materia, error: matErr } = await supabase
    .from('materias')
    .select('*')
    .eq('slug', slug)
    .single()

  if (matErr || !materia) return null

  const { data: secciones, error: secErr } = await supabase
    .from('secciones')
    .select('*')
    .eq('materia_id', materia.id)
    .order('orden')

  if (secErr) {
    console.error('[db-reader] getMateriaBySlug secciones:', secErr.message)
    return { ...(materia as DBMateria), secciones: [] }
  }

  // Cargar temas de cada sección
  const seccionesConTemas = await Promise.all(
    (secciones as DBSeccion[]).map(async (sec) => {
      const { data: temas, error: temErr } = await supabase
        .from('temas')
        .select('*')
        .eq('seccion_id', sec.id)
        .order('orden')

      if (temErr) {
        console.error('[db-reader] temas de sección:', temErr.message)
        return { ...sec, temas: [] }
      }

      return { ...sec, temas: temas as DBTema[] }
    })
  )

  // Temas sin sección (raíz de materia)
  const { data: temasRaiz } = await supabase
    .from('temas')
    .select('*')
    .eq('materia_id', materia.id)
    .is('seccion_id', null)
    .order('orden')

  const result: DBMateriaConSecciones = {
    ...(materia as DBMateria),
    secciones:
      temasRaiz && temasRaiz.length > 0
        ? [{ id: '__root__', materia_id: materia.id, slug: '__root__', titulo: '__root__', orden: -1, created_at: '', temas: temasRaiz as DBTema[] }, ...seccionesConTemas]
        : seccionesConTemas,
  }

  return result
}

// ─── Temas ─────────────────────────────────────────────────────────────────

export async function getTemaFromDB(
  materiaSlug: string,
  temaSlug: string
): Promise<DBTema | null> {
  const supabase = await createClient()

  const { data: materia } = await supabase
    .from('materias')
    .select('id')
    .eq('slug', materiaSlug)
    .single()

  if (!materia) return null

  const { data, error } = await supabase
    .from('temas')
    .select('*')
    .eq('materia_id', materia.id)
    .eq('slug', temaSlug)
    .single()

  if (error) return null
  return data as DBTema
}
