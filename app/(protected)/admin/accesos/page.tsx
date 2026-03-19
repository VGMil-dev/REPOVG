"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/infrastructure/supabase/client";
import AsignarAccesoForm from "@/features/admin/presentation/AsignarAccesoForm";
import AccesoList from "@/features/admin/presentation/AccesoList";
import { Typography } from "@/components/ui/Typography";
import { Key } from "lucide-react";
import { useAdmin } from "@/features/admin/presentation/useAdmin";

export default function AccesosPage() {
  const [data, setData] = useState<{
    accesos: any[];
    usuarios: any[];
    materias: any[];
    semestres: any[];
  }>({
    accesos: [],
    usuarios: [],
    materias: [],
    semestres: [],
  });

  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<"activo" | "historico">("activo");
  const { 
    loading, error, success, 
    asignarAcceso, revocarAcceso, cambiarTipoAcceso, 
    resetState 
  } = useAdmin();
  const supabase = createClient();

  async function fetchData() {
    const [{ data: accesos }, { data: usuarios }, { data: materias }, { data: semestres }] =
      await Promise.all([
        supabase.from("accesos").select("*, profile:profiles!user_id(nombre, email), materia:materias(titulo)").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id, nombre, email").neq("rol", "profesor"),
        supabase.from("materias").select("id, titulo"),
        supabase.from("semestres").select("id, nombre").eq("activo", true),
      ]);
    setData({
      accesos: accesos ?? [],
      usuarios: usuarios ?? [],
      materias: materias ?? [],
      semestres: semestres ?? [],
    });
  }

  useEffect(() => {
    fetchData();
  }, [supabase]);

  useEffect(() => {
    if (success) {
      fetchData();
    }
  }, [success]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ok = await asignarAcceso(new FormData(e.currentTarget));
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
            <Key className="w-8 h-8 text-brand-500" />
          </div>
          <div>
            <Typography as="h1" variant="brand-h1" glow className="!text-3xl">Control de Accesos</Typography>
            <Typography variant="terminal-sm" className="mt-1 !text-brand-500/60 uppercase">
              Gestión de Permisos y Autorizaciones de Materias
            </Typography>
          </div>
        </div>
        <AsignarAccesoForm
          open={open}
          onOpenChange={setOpen}
          loading={loading}
          error={error}
          success={success}
          onSubmit={handleSubmit}
          tipo={tipo}
          onTipoChange={setTipo}
          usuarios={data.usuarios}
          materias={data.materias}
          semestres={data.semestres}
        />
      </div>

      <AccesoList 
        initialAccesos={data.accesos} 
        materias={data.materias}
        onRevocar={async (id) => {
          await revocarAcceso(id);
          fetchData();
        }}
        onCambiarTipo={async (id, nuevoTipo) => {
          await cambiarTipoAcceso(id, nuevoTipo);
          fetchData();
        }}
      />
    </div>
  );
}
