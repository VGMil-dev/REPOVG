import { Acceso, AccesoTipo } from "../models/admin";

export interface IAdminService {
  crearUsuario(formData: FormData): Promise<boolean>;
  eliminarUsuario(userId: string): Promise<boolean>;
  asignarAcceso(formData: FormData): Promise<boolean>;
  cambiarTipoAcceso(accesoId: string, nuevoTipo: AccesoTipo): Promise<boolean>;
  revocarAcceso(accesoId: string): Promise<boolean>;
}
