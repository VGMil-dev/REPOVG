export type Rol = "profesor" | "estudiante" | "exalumno" | "externo";

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
  gemini_api_key_enc: string | null;
  onboarding_step: number;
  mascot_sprite: string | null;
  mascot_cosmetic: string | null;
  created_at: string;
}

export interface RegisterData {
  email: string;
  password?: string;
  nombre: string;
  rol: Rol;
}
