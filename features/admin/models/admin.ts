export type AccesoTipo = "activo" | "historico";

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
  profile?: any; // To avoid circular dependency with Auth if needed, or import Profile
}

export interface Evaluacion {
  id: string;
  materia_id: string;
  tema_slug: string;
  estado: "borrador" | "aprobada";
  complejidad: number;
  generada_por_ia: boolean;
}
