"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ShieldCheck, UserPlus, Loader2 } from "lucide-react";
import { FormField } from "../shared/FormField";
import { Button } from "../ui/Button";

export const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("estudiante");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre,
            rol,
          },
        },
      });

      if (signUpError) throw signUpError;

      router.push("/login?message=¡Registro exitoso! Por favor verifica tu email.");
    } catch (err: any) {
      setError(err.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-6">
      <FormField
        label="Identidad Real"
        name="nombre"
        placeholder="NOMBRE APELLIDO"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        icon={<User className="w-4 h-4" />}
        required
      />

      <FormField
        label="Correo Electronico"
        name="email"
        type="email"
        placeholder="estudiante@repovg.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<Mail className="w-4 h-4" />}
        required
      />

      <FormField
        label="Contraseña"
        name="password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<Lock className="w-4 h-4" />}
        required
        minLength={8}
      />

      <FormField
        label="Rol de Acceso"
        name="rol"
        as="select"
        value={rol}
        onChange={(e) => setRol(e.target.value)}
        icon={<ShieldCheck className="w-4 h-4" />}
      >
        <option value="estudiante" className="bg-[#050505] text-brand-300">ESTUDIANTE</option>
        <option value="profesor" className="bg-[#050505] text-brand-300">PROFESOR (ADMIN)</option>
        <option value="externo" className="bg-[#050505] text-brand-300">EXTERNO</option>
        <option value="exalumno" className="bg-[#050505] text-brand-300">EXALUMNO</option>
      </FormField>

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
