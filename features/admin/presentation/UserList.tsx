"use client";

import { useState, useMemo } from "react";
import { Typography } from "@/components/ui/Typography";
import { Users, Mail, Shield, Zap, Dog, Search, Filter, X } from "lucide-react";
import type { Rol, Profile } from "@/features/auth/models/auth";

interface Props {
  initialUsers: Profile[];
}

export default function UserList({ initialUsers }: Props) {
  const [filterRol, setFilterRol] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    return initialUsers.filter((u) => {
      const matchRol = filterRol === "all" || u.rol === filterRol;
      const matchSearch = 
        u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchRol && matchSearch;
    });
  }, [initialUsers, filterRol, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Barra de Filtros */}
      <div className="flex flex-wrap items-center gap-4 bg-black/20 p-4 rounded-xl border border-brand-500/10 backdrop-blur-sm">
        <div className="flex-1 min-w-[200px] relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500/30 group-focus-within:text-brand-500 transition-colors" />
          <input 
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-brand-500/10 rounded-lg py-2.5 pl-10 pr-4 font-terminal text-sm text-brand-300 focus:border-brand-500/40 focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3 h-3 text-brand-500/50" />
            <select 
              value={filterRol}
              onChange={(e) => setFilterRol(e.target.value)}
              className="bg-black/40 border border-brand-500/10 rounded-lg py-2.5 px-3 font-terminal text-xs text-brand-300 focus:border-brand-500/40 focus:outline-none transition-all appearance-none cursor-pointer min-w-[150px]"
            >
              <option value="all">TODOS LOS PROTOCOLOS (ROLES)</option>
              <option value="profesor">PROFESOR</option>
              <option value="estudiante">ESTUDIANTE</option>
              <option value="exalumno">EXALUMNO</option>
              <option value="externo">EXTERNO</option>
            </select>
          </div>

          {(filterRol !== "all" || searchTerm !== "") && (
            <button 
              onClick={() => {
                setFilterRol("all");
                setSearchTerm("");
              }}
              className="p-2.5 hover:bg-brand-500/10 rounded-lg text-brand-500/50 hover:text-brand-500 transition-colors"
              title="Limpiar filtros"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="relative group/table card !p-0 overflow-hidden !bg-black/40 !backdrop-blur-md !border-brand-500/10">
        <div className="absolute inset-0 scanlines opacity-[0.03] pointer-events-none" />
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-500/10 bg-brand-500/5">
              <th className="px-6 py-4">
                <Typography variant="terminal-sm" className="!text-brand-500/50 flex items-center gap-2">
                  <span className="w-1 h-1 bg-brand-500 rounded-full animate-blink" /> Identidad
                </Typography>
              </th>
              <th className="px-6 py-4">
                <Typography variant="terminal-sm" className="!text-brand-500/50 flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Enlace
                </Typography>
              </th>
              <th className="px-6 py-4">
                <Typography variant="terminal-sm" className="!text-brand-500/50 flex items-center gap-2">
                  <Shield className="w-3 h-3" /> Protocolo
                </Typography>
              </th>
              <th className="px-6 py-4 text-center">
                <Typography variant="terminal-sm" className="!text-brand-500/50 flex items-center gap-2 justify-center">
                  <Zap className="w-3 h-3" /> Nivel_XP
                </Typography>
              </th>
              <th className="px-6 py-4">
                <Typography variant="terminal-sm" className="!text-brand-500/50 flex items-center gap-2">
                  <Dog className="w-3 h-3" /> Avatar
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-500/5 relative z-10">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr key={u.id} className="group/row hover:bg-brand-500/[0.03] transition-colors">
                  <td className="px-6 py-4">
                    <Typography variant="body" className="!text-white font-medium group-hover/row:!text-brand-400 transition-colors">
                      {u.nombre}
                    </Typography>
                  </td>
                  <td className="px-6 py-4">
                    <Typography variant="terminal-sm" className="!text-gray-500 lowercase">
                      {u.email}
                    </Typography>
                  </td>
                  <td className="px-6 py-4">
                    <Typography 
                      variant="pixel-badge" 
                      className={`px-3 py-1 rounded-sm border inline-block text-[10px] ${
                        u.rol === "profesor" ? "bg-purple-500/10 border-purple-500/30 !text-purple-400" :
                        u.rol === "estudiante" ? "bg-brand-500/10 border-brand-500/30 !text-brand-400" :
                        u.rol === "exalumno" ? "bg-blue-500/10 border-blue-500/30 !text-blue-400" :
                        "bg-gray-500/10 border-gray-500/30 !text-gray-400"
                      }`}
                    >
                      {u.rol?.toUpperCase()}
                    </Typography>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Typography variant="body" className="!text-yellow-400 !font-pixel !text-xs">
                      {u.xp_total.toLocaleString()}
                    </Typography>
                  </td>
                  <td className="px-6 py-4">
                    <Typography variant="terminal-sm" className="!text-gray-500 italic">
                      {u.nombre_mascota ?? "No sincronizado"}
                    </Typography>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center bg-black/20">
                  <Typography variant="terminal-sm" className="!text-gray-500 uppercase tracking-widest">
                    No se encontraron reclutas registrados
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
