export type Rol = "profesor" | "estudiante" | "exalumno" | "externo";
export type AccesoTipo = "activo" | "historico";
export type TopicEstado = "bloqueado" | "disponible" | "visto" | "completado";

export interface Profile {
  id: string;
  email: string;
  nombre: string;
  rol: Rol;
  avatar_url: string | null;
  xp_total: number;
  coins: number;
  nombre_mascota: string | null;
  github_username: string | null;
  created_at: string;
}

export interface Materia {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string;
  color: string;
}

export interface Semestre {
  id: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

export interface Acceso {
  id: string;
  user_id: string;
  materia_id: string;
  tipo: AccesoTipo;
  semestre_id: string | null;
  asignado_por: string;
  created_at: string;
  // joins
  materia?: Materia;
  profile?: Profile;
}

export interface TopicProgress {
  user_id: string;
  materia_id: string;
  tema_slug: string;
  estado: TopicEstado;
  score: number | null;
  intentos: number;
  completado_at: string | null;
}

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

export interface Evaluacion {
  id: string;
  materia_id: string;
  tema_slug: string;
  estado: "borrador" | "aprobada";
  complejidad: number;
  generada_por_ia: boolean;
}

export interface XPLog {
  id: string;
  user_id: string;
  cantidad_xp: number;
  cantidad_coins: number;
  motivo: string;
  ref_id: string | null;
  created_at: string;
}

// Content Types
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

// ─── Mascot Chat Types ───────────────────────────────────────────────────────

export type MascotState = "idle" | "think" | "curious" | "celebrate" | "worry" | "learning" | "putbrain";

export type ChatRole = "mascot" | "user";

export type ChatTrigger =
  | "pregunta_predefinida"
  | "validacion_conceptos"
  | "pista_socratica"
  | "chat_libre"
  | "frase_evento"
  | "sistema";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  trigger: ChatTrigger;
  timestamp: number;
  conceptosValidados?: string[];
}

export interface MascotChatContext {
  materiaSlug: string | null;
  materiaId: string | null;
  temaSlug: string | null;
  temaTitulo: string | null;
  conceptosClave: string[];
  preguntaActivaId: string | null;
}

export interface GeminiMascotResponse {
  texto: string;
  mascotState: MascotState;
  conceptosAprendidos: string[];
  debeRegistrarAprendido: boolean;
  esBloqueoReal: boolean;
}

export interface GeminiQuotaState {
  agotadoAt: number;
  expiraAt: number;
  fallosConsecutivos: number;
}
