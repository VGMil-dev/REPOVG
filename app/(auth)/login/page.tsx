"use client";

import React from "react";
import Link from "next/link";
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { LoginForm } from "@/components/organisms/LoginForm";
import { AuthVisual } from "@/components/organisms/AuthVisual";

const LoginPage = () => {
  return (
    <AuthTemplate
      title="SESIÓN"
      accentTitle="INICIAR"
      subtitle="Identifícate para acceder al Núcleo de RepoVG"
      visualContent={<AuthVisual message="TU COMPAÑERO TE ESPERA..." />}
      footer={
        <p className="font-terminal text-md text-brand-500 tracking-wider uppercase">
          ¿ERES EXTERNO?{" "}
          <Link href="/register" className="text-brand-400 hover:text-brand-500 font-bold transition-colors underline decoration-brand-500/30 underline-offset-4">
            REGÍSTRATE AQUÍ
          </Link>
        </p>
      }
    >
      <LoginForm />
    </AuthTemplate>
  );
};

export default LoginPage;
