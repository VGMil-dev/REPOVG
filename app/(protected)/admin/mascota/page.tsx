"use client";

import React, { useState } from "react";
import { AdminTemplate } from "@/components/templates/AdminTemplate";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { useMascot } from "@/lib/context/MascotContext";
import { MascotWidget } from "@/components/mascot/MascotWidget";
import { Play, MessageSquare, Info, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";

export default function MascotTestPage() {
  const { state, setState, say, clearMessages } = useMascot();
  const [customText, setCustomText] = useState("¡Hola recluta! Estoy listo para las pruebas.");

  const animations: { value: typeof state; label: string }[] = [
    { value: "idle", label: "Idle (En espera)" },
    { value: "think", label: "Think (Pensando)" },
    { value: "curious", label: "Curious (Curioso)" },
    { value: "celebrate", label: "Celebrate (Celebración)" },
    { value: "worry", label: "Worry (Preocupado)" },
    { value: "learning", label: "Learning (Aprendiendo)" },
    { value: "putbrain", label: "Put Brain (Instalando cerebro)" },
  ];

  return (
    <AdminTemplate title="LABORATORIO DE MASCOTA" subtitle="DEPURACIÓN Y PRUEBAS DE ANIMACIONES">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
        
        {/* Panel de Control de Animaciones */}
        <section className="bg-black/40 border border-white/5 p-6 rounded-sm space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Play className="w-4 h-4 text-brand-500" />
            <Typography variant="pixel-label" className="text-brand-500">CONTROL DE ANIMACIÓN</Typography>
          </div>

          <div className="space-y-4">
            <Typography variant="body-sm">Selecciona un estado para forzar la animación:</Typography>
            <div className="grid grid-cols-1 gap-2">
              {animations.map((anim) => (
                <button
                  key={anim.value}
                  onClick={() => setState(anim.value)}
                  className={`flex items-center justify-between p-3 border font-terminal text-sm transition-all ${
                    state === anim.value 
                      ? "bg-brand-500/10 border-brand-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.1)]" 
                      : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                  }`}
                >
                  <span className="uppercase tracking-wider">{anim.label}</span>
                  <span className="font-pixel text-[10px] text-gray-500">{anim.value}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Panel de Burbujas de Texto */}
        <section className="bg-black/40 border border-white/5 p-6 rounded-sm space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4 text-orange-500" />
            <Typography variant="pixel-label" className="text-orange-500">SISTEMA DE MENSAJES</Typography>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Typography variant="body-sm">Mensaje personalizado:</Typography>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-sm p-3 font-terminal text-sm text-gray-300 focus:outline-none focus:border-orange-500/50 min-h-[80px]"
                placeholder="Escribe algo aquí..."
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="secondary" 
                onClick={() => say(customText, "info")}
                className="flex items-center justify-center gap-2"
              >
                <Info className="w-3 h-3" /> INFO
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => say(customText, "success")}
                className="flex items-center justify-center gap-2 !text-brand-500"
              >
                <CheckCircle className="w-3 h-3" /> SUCCESS
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => say(customText, "warning")}
                className="flex items-center justify-center gap-2 !text-orange-500"
              >
                <AlertTriangle className="w-3 h-3" /> WARNING
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => say(customText, "question")}
                className="flex items-center justify-center gap-2 !text-blue-400"
              >
                <HelpCircle className="w-3 h-3" /> QUESTION
              </Button>
            </div>

            <Button 
              onClick={clearMessages}
              className="w-full mt-4 bg-gray-900 border-gray-800 hover:bg-gray-800"
            >
              LIMPIAR MENSAJES
            </Button>
          </div>
        </section>
      </div>

      {/* Instrucciones */}
      <div className="mt-8 p-4 border border-brand-500/20 bg-brand-500/5 rounded-sm max-w-5xl">
        <Typography variant="body-sm" className="text-brand-500/80">
          <strong className="text-brand-500">NOTA:</strong> El widget de la mascota se muestra en la esquina inferior derecha. 
          En esta página hemos forzado su visibilidad ignorando las reglas de exclusión habituales de la sección de administración.
        </Typography>
      </div>

      {/* Forzar el Widget aquí para pruebas */}
      <MascotWidget forceVisible={true} />
    </AdminTemplate>
  );
}
