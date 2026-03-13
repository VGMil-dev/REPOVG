import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { MateriaContent, TemaNode, SeccionNode, TemaData } from '@/types'

const CONTENT_DIR = path.join(process.cwd(), 'content')

// ─── Build sidebar tree ───────────────────────────────────────────────────────

export async function getMateriaContent(materiaSlug: string): Promise<MateriaContent | null> {
  const materiaPath = path.join(CONTENT_DIR, materiaSlug)
  if (!fs.existsSync(materiaPath)) return null

  const indexPath = path.join(materiaPath, 'index.md')
  let titulo = materiaSlug
  if (fs.existsSync(indexPath)) {
    const { data } = matter(fs.readFileSync(indexPath, 'utf8'))
    titulo = data.titulo || materiaSlug
  }

  const secciones: SeccionNode[] = []

  const entries = fs.readdirSync(materiaPath, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  for (const entry of entries) {
    if (entry.name === 'index.md') continue

    if (entry.isDirectory()) {
      // Sección con subsección
      const seccionPath = path.join(materiaPath, entry.name)
      const seccionIndex = path.join(seccionPath, 'index.md')
      let seccionTitulo = entry.name

      if (fs.existsSync(seccionIndex)) {
        const { data } = matter(fs.readFileSync(seccionIndex, 'utf8'))
        seccionTitulo = data.titulo || entry.name
      }

      const temas = readTemasFromDir(seccionPath)
      if (temas.length > 0) {
        secciones.push({ titulo: seccionTitulo, temas })
      }
    } else if (entry.name.match(/\.(md|mdx)$/)) {
      // Tema en raíz de materia — sin sección
      const slug = entry.name.replace(/\.(md|mdx)$/, '')
      const { data } = matter(fs.readFileSync(path.join(materiaPath, entry.name), 'utf8'))
      const rootSec = secciones.find(s => s.titulo === '__root__')
      const node: TemaNode = { slug, titulo: data.titulo || slug, orden: data.orden ?? 0 }
      if (rootSec) {
        rootSec.temas.push(node)
      } else {
        secciones.unshift({ titulo: '__root__', temas: [node] })
      }
    }
  }

  return { slug: materiaSlug, titulo, secciones }
}

function readTemasFromDir(dirPath: string): TemaNode[] {
  return fs
    .readdirSync(dirPath)
    .filter(f => f.match(/\.(md|mdx)$/) && f !== 'index.md')
    .map(f => {
      const slug = f.replace(/\.(md|mdx)$/, '')
      const { data } = matter(fs.readFileSync(path.join(dirPath, f), 'utf8'))
      return { slug, titulo: data.titulo || slug, orden: data.orden ?? 0 }
    })
    .sort((a, b) => a.orden - b.orden || a.slug.localeCompare(b.slug))
}

// ─── Get flat list of all temas ───────────────────────────────────────────────

function flattenTemas(secciones: SeccionNode[]): TemaNode[] {
  return secciones.flatMap(s => s.temas)
}

// ─── Read a single tema ───────────────────────────────────────────────────────

export async function getTema(
  materiaSlug: string,
  slugParts: string[]
): Promise<TemaData | null> {
  const slugStr = slugParts.join('/')
  const materiaPath = path.join(CONTENT_DIR, materiaSlug)

  // Search both flat and nested
  const candidates = [
    path.join(materiaPath, `${slugStr}.mdx`),
    path.join(materiaPath, `${slugStr}.md`),
    path.join(materiaPath, slugParts[0], `${slugParts.slice(1).join('/')}.mdx`),
    path.join(materiaPath, slugParts[0], `${slugParts.slice(1).join('/')}.md`),
  ]

  let filePath: string | null = null
  for (const c of candidates) {
    if (fs.existsSync(c)) { filePath = c; break }
  }
  if (!filePath) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { content, data } = matter(raw)

  const materiaContent = await getMateriaContent(materiaSlug)
  const allTemas = materiaContent ? flattenTemas(materiaContent.secciones) : []
  const idx = allTemas.findIndex(t => t.slug === slugParts[slugParts.length - 1])

  return {
    content,
    meta: {
      titulo: data.titulo || slugStr,
      descripcion: data.descripcion || null,
      materia: data.materia || materiaSlug,
      seccion: data.seccion || null,
    },
    prev: idx > 0 ? allTemas[idx - 1] : null,
    next: idx < allTemas.length - 1 ? allTemas[idx + 1] : null,
  }
}

// ─── Get all slugs for static generation ─────────────────────────────────────

export async function getAllTemaParams() {
  if (!fs.existsSync(CONTENT_DIR)) return []
  const materias = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)

  const params: { materia: string; slug: string[] }[] = []

  for (const materia of materias) {
    const content = await getMateriaContent(materia)
    if (!content) continue
    for (const seccion of content.secciones) {
      for (const tema of seccion.temas) {
        params.push({ materia, slug: [tema.slug] })
      }
    }
  }

  return params
}
