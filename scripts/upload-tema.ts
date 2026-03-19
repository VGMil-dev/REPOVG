/**
 * scripts/upload-tema.ts
 * Sincroniza el contenido de content/ hacia Supabase (tablas: materias, secciones, temas).
 * Uso: npm run upload
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { createClient } from '@supabase/supabase-js'

// ─── Cliente Supabase (service_role, bypass RLS) ───────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ─── Rutas ─────────────────────────────────────────────────────────────────

const CONTENT_DIR = path.join(process.cwd(), 'content')

// ─── Helpers ───────────────────────────────────────────────────────────────

function readFrontmatter(filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf8')
  return matter(raw)
}

function getMateriaTitle(materiaPath: string, slug: string): string {
  const indexPath = path.join(materiaPath, 'index.md')
  if (fs.existsSync(indexPath)) {
    const { data } = readFrontmatter(indexPath)
    if (data.titulo) return data.titulo
  }
  return slug
}

// ─── Lógica principal ──────────────────────────────────────────────────────

async function syncMateria(materiaSlug: string) {
  const materiaPath = path.join(CONTENT_DIR, materiaSlug)
  const titulo = getMateriaTitle(materiaPath, materiaSlug)

  // Upsert materia
  const { data: materia, error: matErr } = await supabase
    .from('materias')
    .upsert({ slug: materiaSlug, titulo, descripcion: '', color: '#4f6ef7' }, { onConflict: 'slug' })
    .select('id')
    .single()

  if (matErr || !materia) {
    console.error(`  ❌ Error upserting materia "${materiaSlug}":`, matErr?.message)
    return
  }

  const materiaId = materia.id
  console.log(`\n📚 ${titulo} (${materiaSlug})`)

  // Leer entradas de la materia
  const entries = (fs.readdirSync(materiaPath, { withFileTypes: true }) as fs.Dirent[])
    .filter(e => e.name !== 'index.md')
    .sort((a, b) => a.name.localeCompare(b.name))

  let temasRaiz: { slug: string; titulo: string; orden: number; content: string }[] = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      await syncSeccion(materiaId, materiaPath, entry.name)
    } else if (/\.(md|mdx)$/.test(entry.name)) {
      const slug = entry.name.replace(/\.(md|mdx)$/, '')
      const filePath = path.join(materiaPath, entry.name)
      const { data, content } = readFrontmatter(filePath)
      temasRaiz.push({ slug, titulo: data.titulo || slug, orden: data.orden ?? 0, content })
    }
  }

  // Temas sin sección (raíz de materia)
  for (const tema of temasRaiz) {
    await upsertTema(materiaId, null, tema)
  }
}

async function syncSeccion(materiaId: string, materiaPath: string, seccionDir: string) {
  const seccionPath = path.join(materiaPath, seccionDir)
  const indexPath = path.join(seccionPath, 'index.md')
  let titulo = seccionDir
  let orden = 0

  if (fs.existsSync(indexPath)) {
    const { data } = readFrontmatter(indexPath)
    titulo = data.titulo || seccionDir
    orden = data.orden ?? 0
  }

  // Upsert sección
  const { data: seccion, error: secErr } = await supabase
    .from('secciones')
    .upsert({ materia_id: materiaId, slug: seccionDir, titulo, orden }, { onConflict: 'materia_id,slug' })
    .select('id')
    .single()

  if (secErr || !seccion) {
    console.error(`  ❌ Error upserting sección "${seccionDir}":`, secErr?.message)
    return
  }

  console.log(`  📂 ${titulo}`)

  // Leer temas de la sección
  const temas = fs.readdirSync(seccionPath)
    .filter(f => /\.(md|mdx)$/.test(f) && f !== 'index.md')
    .map(f => {
      const slug = f.replace(/\.(md|mdx)$/, '')
      const { data, content } = readFrontmatter(path.join(seccionPath, f))
      return { slug, titulo: data.titulo || slug, orden: data.orden ?? 0, content }
    })
    .sort((a, b) => a.orden - b.orden || a.slug.localeCompare(b.slug))

  for (const tema of temas) {
    await upsertTema(materiaId, seccion.id, tema)
  }
}

async function upsertTema(
  materiaId: string,
  seccionId: string | null,
  tema: { slug: string; titulo: string; orden: number; content: string }
) {
  const { error } = await supabase
    .from('temas')
    .upsert(
      {
        materia_id: materiaId,
        seccion_id: seccionId,
        slug: tema.slug,
        titulo: tema.titulo,
        orden: tema.orden,
        contenido_mdx: tema.content,
      },
      { onConflict: 'materia_id,slug' }
    )

  if (error) {
    console.error(`    ❌ Error upserting tema "${tema.slug}":`, error.message)
  } else {
    console.log(`    ✓ ${tema.titulo} (${tema.slug})`)
  }
}

// ─── Entrypoint ────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`❌ No existe el directorio content/ en ${CONTENT_DIR}`)
    process.exit(1)
  }

  const materias = (fs.readdirSync(CONTENT_DIR, { withFileTypes: true }) as fs.Dirent[])
    .filter(d => d.isDirectory())
    .map(d => d.name)

  if (materias.length === 0) {
    console.log('⚠️  No se encontraron materias en content/')
    return
  }

  console.log(`🚀 Sincronizando ${materias.length} materia(s)...\n`)

  for (const materia of materias) {
    await syncMateria(materia)
  }

  console.log('\n✅ Sincronización completada.')
}

main().catch(err => {
  console.error('❌ Error inesperado:', err)
  process.exit(1)
})
