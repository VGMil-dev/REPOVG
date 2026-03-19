export type MascotState = "idle" | "think" | "curious" | "celebrate" | "worry" | "learning" | "putbrain";

export type ChatRole = "mascot" | "user";

export type ChatTrigger =
  | "pregunta_predefinida"
  | "validacion_conceptos"
  | "pista_socratica"
  | "chat_libre"
  | "frase_evento"
  | "sistema";

export type MascotSpriteVariant = "default" | "fire" | "ice" | "dark";

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
