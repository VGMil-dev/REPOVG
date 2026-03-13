import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Key, BookOpen, Settings, BarChart3, Shield } from "lucide-react";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("rol").eq("id", user.id).single();

  if (profile?.rol !== "profesor") redirect("/dashboard");

  const menuItems = [
    { 
      href: "/admin/usuarios", 
      icon: Users, 
      label: "Usuarios", 
      desc: "Gestionar reclutas y sus perfiles",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    { 
      href: "/admin/accesos", 
      icon: Key, 
      label: "Accesos", 
      desc: "Asignar materias y permisos",
      color: "text-brand-500",
      bg: "bg-brand-500/10"
    },
    { 
      href: "/admin/contenido", 
      icon: BookOpen, 
      label: "Contenido", 
      desc: "Subir temas MDX y evaluaciones",
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    },
    { 
      href: "/admin/analytics", 
      icon: BarChart3, 
      label: "Métricas", 
      desc: "Progreso global de la plataforma",
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    { 
      href: "/admin/seguridad", 
      icon: Shield, 
      label: "Seguridad", 
      desc: "Logs y políticas de acceso",
      color: "text-red-500",
      bg: "bg-red-500/10"
    },
    { 
      href: "/admin/configuracion", 
      icon: Settings, 
      label: "Ajustes", 
      desc: "Configuración global del sistema",
      color: "text-gray-500",
      bg: "bg-gray-500/10"
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8">
      <header className="mb-12">
        <h1 className="text-4xl font-pixel text-white text-glow mb-4 tracking-tighter uppercase">
          CENTRAL DE <span className="text-brand-500">COMANDO</span>
        </h1>
        <p className="font-terminal text-gray-400 uppercase tracking-widest text-sm">
          Panel de Administración Maestro — RepoVG Core
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className="group relative overflow-hidden card p-8 border-2 border-brand-500/10 hover:border-brand-500/40 transition-all duration-300"
          >
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-24 h-24 ${item.bg} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className={`p-3 rounded-xl w-fit mb-6 ${item.bg}`}>
                <item.icon className={`w-8 h-8 ${item.color}`} />
              </div>
              <h2 className="text-xl font-pixel text-white mb-2 tracking-tight group-hover:text-brand-400 transition-colors uppercase">
                {item.label}
              </h2>
              <p className="font-terminal text-gray-500 text-xs tracking-wider leading-relaxed flex-1">
                {item.desc.toUpperCase()}
              </p>
              
              <div className="mt-8 flex items-center gap-2 text-[10px] font-pixel text-brand-500/40 group-hover:text-brand-500 transition-colors">
                ACCEDER AL MÓDULO <span className="text-lg">→</span>
              </div>
            </div>

            {/* Corner Decorative */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-brand-500/30" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-brand-500/30" />
          </Link>
        ))}
      </div>

      <footer className="mt-20 pt-8 border-t border-brand-500/10 flex justify-between items-center opacity-40">
        <div className="font-terminal text-[10px] text-gray-500 uppercase tracking-widest">
          SISTEMA OPERATIVO REPOVG v1.0.4
        </div>
        <div className="font-terminal text-[10px] text-gray-500 uppercase tracking-widest">
          ESTADO: ONLINE_SECURE
        </div>
      </footer>
    </div>
  );
}
