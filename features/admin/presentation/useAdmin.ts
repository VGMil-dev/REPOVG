"use client";

import { useState } from "react";
import { 
  crearUsuario as crearUsuarioService, 
  asignarAcceso as asignarAccesoService,
  revocarAcceso as revocarAccesoService,
  cambiarTipoAcceso as cambiarTipoAccesoService,
  eliminarUsuario as eliminarUsuarioService
} from "../services/actions";
import type { AccesoTipo } from "../models/admin";

export const useAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetState = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  const crearUsuario = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    const result = await crearUsuarioService(formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return false;
    }
    setSuccess(true);
    return true;
  };

  const asignarAcceso = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    const result = await asignarAccesoService(formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return false;
    }
    setSuccess(true);
    return true;
  };

  const revocarAcceso = async (accesoId: string) => {
    setLoading(true);
    setError(null);
    const result = await revocarAccesoService(accesoId);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return false;
    }
    return true;
  };

  const cambiarTipoAcceso = async (accesoId: string, tipo: AccesoTipo) => {
    setLoading(true);
    setError(null);
    const result = await cambiarTipoAccesoService(accesoId, tipo);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return false;
    }
    return true;
  };

  const eliminarUsuario = async (userId: string) => {
    setLoading(true);
    setError(null);
    const result = await eliminarUsuarioService(userId);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return false;
    }
    return true;
  };

  return {
    loading,
    error,
    success,
    crearUsuario,
    asignarAcceso,
    revocarAcceso,
    cambiarTipoAcceso,
    eliminarUsuario,
    resetState
  };
};
