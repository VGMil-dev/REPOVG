"use client";

import { useState, useMemo } from "react";
import { Typography } from "@/components/ui/Typography";
import { User, BookOpen, Shield, Clock, Filter, Search, X } from "lucide-react";

interface AccesoRow {
  id: string;
  user_id: string;
  materia_id: string;
  tipo: "activo" | "historico";
  created_at: string;
  profile?: { nombre: string; email: string };
  materia?: { titulo: string };
}

interface Props {
  initialAccesos: AccesoRow[];
  materias: { id: string; titulo: string }[];
}

export default function AccesoList({ initialAccesos, materias }: Props) {
  const [filterMateria, setFilterMateria] = useState<string>("all");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAccesos = useMemo(() => {
    return initialAccesos.filter((a) => {
      const matchMateria = filterMateria === "all" || a.materia_id === filterMateria;
      const matchEstado = filterEstado === "all" || a.tipo === filterEstado;
      const matchSearch = 
        a.profile?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.profile?.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchMateria && matchEstado && matchSearch;
    });
  }, [initialAccesos, filterMateria, filterEstado, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Barra de Filtros */}
      <div className="flex flex-wrap items-center gap-4 bg-black/20 p-4 rounded-xl border border-brand-500/10 backdrop-blur-sm">
        <div className="flex-1 min-w-[200px] relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500/30 group-focus-within:text-brand-500 transition-colors" />
          <input 
            type="text"
            placeholder="Buscar por usuario o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-brand-500/10 rounded-lg py-2.5 pl-10 pr-4 font-terminal text-sm text-brand-300 focus:border-brand-500/40 focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3 h-3 text-brand-500/50" />
            <select 
              value={filterMateria}
              onChange={(e) => setFilterMateria(e.target.value)}
              className="bg-black/40 border border-brand-500/10 rounded-lg py-2.5 px-3 font-terminal text-xs text-brand-300 focus:border-brand-500/40 focus:outline-none transition-all appearance-none cursor-pointer min-w-[150px]"
            >
              <option value="all">TODAS LAS MATERIAS</option>
              {materias.map(m => (
                <option key={m.id} value={m.id}>{m.titulo.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <select 
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="bg-black/40 border border-brand-500/10 rounded-lg py-2.5 px-3 font-terminal text-xs text-brand-300 focus:border-brand-500/40 focus:outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="all">ESTADO: TODOS</option>
            <option value="activo">SOLO ACTIVOS</option>
            <option value="historico">SOLO HISTÓRICOS</option>
          </select>

          {(filterMateria !== "all" || filterEstado !== "all" || searchTerm !== "") && (
            <button 
              onClick={() => {
                setFilterMateria("all");
                setFilterEstado("all");
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

      {/* Tabla */}
      <div className="relative group/table card !p-0 overflow-hidden !bg-black/40 !backdrop-blur-md !border-brand-500/10">
        <div className="absolute inset-0 scanlines opacity-[0.03] pointer-events-none" />
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-500/10 bg-brand-500/5">
              <th className="px-6 py-4">
                <Typography variant="terminal-sm" className="!text-brand-500/50 flex items-center gap-2">
                  <User className="w-3 h-3" /> Usuario
                </Typography>
              </th>
              <th className="px-6 py-4">
                <Typography variant="terminal-sm" className="!text-brand-500/50 flex items-center gap-2">
                  <BookOpen className="w-3 h-3" /> Materia
                </Typography>
              </th>
              <th className="px-6 py-4 text-center">
                <Typography variant="terminal-sm" className="!text-brand-500/50 flex items-center gap-2 justify-center">
                  <Shield className="w-3 h-3" /> Estado
                </Typography>
              </th>
              <th className="px-6 py-4 text-right">
                <Typography variant="terminal-sm" className="!text-brand-500/50 flex items-center gap-2 justify-end">
                  <Clock className="w-3 h-3" /> Registro
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-500/5 relative z-10">
            {filteredAccesos.length > 0 ? (
              filteredAccesos.map((a) => (
                <tr key={a.id} className="group/row hover:bg-brand-500/[0.03] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <Typography variant="body" className="!text-white font-medium group-hover/row:!text-brand-400 transition-colors">
                        {a.profile?.nombre}
                      </Typography>
                      <Typography variant="terminal-sm" className="!text-gray-500 lowercase">
                        {a.profile?.email}
                      </Typography>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Typography variant="body-sm" className="!text-gray-300">
                      {a.materia?.titulo}
                    </Typography>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Typography 
                      variant="pixel-badge" 
                      className={`px-3 py-1 rounded-sm border inline-block text-[10px] ${
                        a.tipo === "activo" ? "bg-brand-500/10 border-brand-500/30 !text-brand-400" : "bg-gray-500/10 border-gray-500/30 !text-gray-400"
                      }`}
                    >
                      {a.tipo === "activo" ? "SINCRONIZADO" : "HISTÓRICO"}
                    </Typography>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Typography variant="terminal-sm" className="!text-gray-500">
                      {new Date(a.created_at).toLocaleDateString("es", {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </Typography>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center bg-black/20">
                  <Typography variant="terminal-sm" className="!text-gray-500 uppercase tracking-widest">
                    No se encontraron registros vinculados
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
