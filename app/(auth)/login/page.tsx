"use client";

import React from "react";
import Link from "next/link";
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { LoginForm } from "@/features/auth/presentation/LoginForm";
import { AuthVisual } from "@/features/auth/presentation/AuthVisual";
import { Typography } from "@/components/ui/Typography";
import { useAuth } from "@/features/auth/presentation/useAuth";

const LoginPage = () => {
  const { loading, error, showPassword, handleLogin, togglePasswordVisibility } = useAuth();

  return (
    <AuthTemplate
      title="SESIÓN"
      accentTitle="INICIAR"
      subtitle="Identifícate para acceder al Núcleo de RepoVG"
      visualContent={<AuthVisual message="TU COMPAÑERO TE ESPERA..." />}
      footer={
        <Typography variant="body" className="text-brand-500 tracking-wider uppercase">
          ¿ERES EXTERNO?{" "}
          <Link href="/register" className="text-brand-400 hover:text-brand-500 font-bold transition-colors underline decoration-brand-500/30 underline-offset-4">
            REGÍSTRATE AQUÍ
          </Link>
        </Typography>
      }
    >
      <LoginForm 
        loading={loading}
        error={error}
        showPassword={showPassword}
        onSubmit={handleLogin}
        onTogglePassword={togglePasswordVisibility}
      />
    </AuthTemplate>
  );
};

export default LoginPage;
