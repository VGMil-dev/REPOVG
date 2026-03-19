"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../services/actions";
import { createClient } from "@/infrastructure/supabase/client";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError("Credenciales incorrectas. Intenta de nuevo.");
      setLoading(false);
    }
  };

  const handleRegister = async (data: {
    email: string;
    password: string;
    nombre: string;
    rol: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            nombre: data.nombre,
            rol: data.rol,
          },
        },
      });

      if (signUpError) throw signUpError;

      router.push("/login?message=¡Registro exitoso! Por favor verifica tu email.");
    } catch (err: any) {
      setError(err.message || "Error al registrarse");
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return {
    loading,
    error,
    showPassword,
    handleLogin,
    handleRegister,
    togglePasswordVisibility,
  };
};
