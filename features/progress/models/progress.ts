export type TopicEstado = "bloqueado" | "disponible" | "visto" | "completado";

export interface TopicProgress {
  user_id: string;
  materia_id: string;
  tema_slug: string;
  estado: TopicEstado;
  score: number | null;
  intentos: number;
  completado_at: string | null;
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
