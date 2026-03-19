"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/infrastructure/supabase/client";
import CrearUsuarioForm from "@/features/admin/presentation/CrearUsuarioForm";
import UserList from "@/features/admin/presentation/UserList";
import { Typography } from "@/components/ui/Typography";
import { Users } from "lucide-react";
import { useAdmin } from "@/features/admin/presentation/useAdmin";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const { loading, error, success, crearUsuario, resetState } = useAdmin();
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      setUsuarios(data ?? []);
    }
    fetchData();
  }, [supabase, success]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ok = await crearUsuario(new FormData(e.currentTarget));
    if (ok) {
      setTimeout(() => {
        setOpen(false);
        resetState();
      }, 1200);
    }
  }

  return (
    <div className="max-w-5xl space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.1)]">
            <Users className="w-8 h-8 text-brand-500" />
          </div>
          <div>
            <Typography as="h1" variant="brand-h1" glow className="!text-3xl">Usuarios</Typography>
            <Typography variant="terminal-sm" className="mt-1 !text-brand-500/60 uppercase">
              {usuarios.length} RECLUTAS REGISTRADOS EN EL NÚCLEO
            </Typography>
          </div>
        </div>
        <CrearUsuarioForm 
          open={open}
          onOpenChange={setOpen}
          loading={loading}
          error={error}
          success={success}
          onSubmit={handleSubmit}
        />
      </div>

      <UserList initialUsers={usuarios} />
    </div>
  );
}
