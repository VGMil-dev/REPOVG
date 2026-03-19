"use client";

import React from "react";
import Link from "next/link";
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { RegisterForm } from "@/features/auth/presentation/RegisterForm";
import { AuthVisual } from "@/features/auth/presentation/AuthVisual";
import { useAuth } from "@/features/auth/presentation/useAuth";

export default function RegisterPage() {
  const { loading, error, handleRegister } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await handleRegister({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      nombre: formData.get("nombre") as string,
      rol: formData.get("rol") as string,
    });
  };

  return (
    <AuthTemplate
      title="RECLUTA"
      accentTitle="NUEVO"
      subtitle="Comienza tu entrenamiento en RepoVG"
      visualContent={<AuthVisual message="BIENVENIDO RECLUTA..." />}
      footer={
        <p className="font-terminal text-md text-brand-500 tracking-wider uppercase">
          ¿YA TIENES ACCESO?{" "}
          <Link href="/login" className="text-brand-400 hover:text-brand-500 font-bold transition-colors underline decoration-brand-500/30 underline-offset-4">
            INGRESAR AQUÍ
          </Link>
        </p>
      }
    >
      <RegisterForm 
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
      />
    </AuthTemplate>
  );
}
