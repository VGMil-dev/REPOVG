"use client";

import React from "react";
import Link from "next/link";
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { RegisterForm } from "@/components/organisms/RegisterForm";
import { AuthVisual } from "@/components/organisms/AuthVisual";

export default function RegisterPage() {
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
      <RegisterForm />
    </AuthTemplate>
  );
}
