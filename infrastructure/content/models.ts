export interface TopicFrontmatter {
  titulo: string;
  materia: string;
  seccion: string;
  orden: number;
  dificultad: 1 | 2 | 3 | 4 | 5;
  depende_de: string[];
  mascota_preguntas?: { pregunta: string; conceptos_clave: string[] }[];
  mascota_preguntas_ia?: boolean;
  evaluacion?: {
    puntaje_minimo: number;
    completar_con_ia?: boolean;
    ejercicios: EjercicioDefinicion[];
  };
}

export type TipoEjercicio =
  | "multiple_opcion"
  | "completar_codigo"
  | "ordenar_lineas"
  | "matching"
  | "encontrar_bug"
  | "predecir_output"
  | "escribir_desde_cero";

export interface EjercicioDefinicion {
  tipo: TipoEjercicio;
  [key: string]: unknown;
}

export interface TemaNode {
  slug: string;
  titulo: string;
  orden: number;
}

export interface SeccionNode {
  titulo: string;
  temas: TemaNode[];
}

export interface MateriaContent {
  slug: string;
  titulo: string;
  secciones: SeccionNode[];
}

// ─── Tipos de base de datos (Supabase) ───────────────────────────────────────

export interface DBMateria {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string;
  color: string;
  premium: boolean;
  created_at: string;
}

export interface DBSeccion {
  id: string;
  materia_id: string;
  slug: string;
  titulo: string;
  orden: number;
  created_at: string;
}

export interface DBTema {
  id: string;
  materia_id: string;
  seccion_id: string | null;
  slug: string;
  titulo: string;
  descripcion: string | null;
  orden: number;
  premium: boolean;
  contenido_mdx: string | null;
  created_at: string;
}

export interface DBMateriaConSecciones extends DBMateria {
  secciones: (DBSeccion & { temas: DBTema[] })[];
}

// ─────────────────────────────────────────────────────────────────────────────

export interface TemaData {
  content: string;
  meta: {
    titulo: string;
    descripcion: string | null;
    materia: string;
    seccion: string | null;
  };
  prev: TemaNode | null;
  next: TemaNode | null;
}
