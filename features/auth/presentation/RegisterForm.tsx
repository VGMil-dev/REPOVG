"use client";

import { Mail, Lock, User, UserPlus, Loader2 } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";

interface RegisterFormProps {
  loading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const RegisterForm = ({
  loading,
  error,
  onSubmit,
}: RegisterFormProps) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <FormField
        label="Identidad Real"
        name="nombre"
        placeholder="NOMBRE APELLIDO"
        icon={<User className="w-4 h-4" />}
        required
      />

      <FormField
        label="Correo Electronico"
        name="email"
        type="email"
        placeholder="estudiante@repovg.com"
        icon={<Mail className="w-4 h-4" />}
        required
      />

      <FormField
        label="Contraseña"
        name="password"
        type="password"
        placeholder="••••••••"
        icon={<Lock className="w-4 h-4" />}
        required
        minLength={8}
      />

      <input type="hidden" name="rol" value="externo" />

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 font-terminal text-xs uppercase text-center animate-pulse">
          SISTEMA_ERROR: {error}
        </div>
      )}

      <Button
        type="submit"
        loading={loading}
        className="w-full py-5 flex items-center justify-center gap-3 group mt-4 text-lg"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
          <>
            GENERAR CUENTA <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </>
        )}
      </Button>
    </form>
  );
};
