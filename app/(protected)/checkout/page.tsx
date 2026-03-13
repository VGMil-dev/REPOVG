"use client";

import React from "react";
import { CreditCard, ShieldCheck, Zap, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl w-full relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: Info */}
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
          <div>
            <div className="px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full text-brand-500 text-[10px] font-pixel uppercase tracking-widest mb-6 w-fit">
              Acceso Externo / Exalumno
            </div>
            <h1 className="text-4xl lg:text-5xl font-pixel text-white text-glow mb-6 leading-tight">
              CONTINÚA TU <br />
              <span className="text-orange-500 text-glow-orange">AVENTURA</span>
            </h1>
            <p className="font-terminal text-gray-400 uppercase tracking-wider leading-relaxed">
              Como exalumno o usuario externo, necesitas una suscripción activa para acceder al Leaderboard Alumni y a las misiones Premium.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Star, text: "Acceso ilimitado a todas las materias" },
              { icon: Zap, text: "IA de Gemini sin límites de tokens" },
              { icon: ShieldCheck, text: "Certificado de completitud verificado" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-brand-400 font-terminal text-sm">
                <item.icon className="w-4 h-4" />
                <span>{item.text.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Card */}
        <div className="border-2 border-brand-500/20 bg-black/60 backdrop-blur-xl p-8 rounded-2xl shadow-[0_0_50px_rgba(34,197,94,0.05)] animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="flex justify-between items-center mb-8">
            <div className="font-pixel text-xs text-brand-500 uppercase">Plan Mensual</div>
            <div className="text-3xl font-pixel text-white">$10<span className="text-sm text-gray-500">/mes</span></div>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-brand-500/5 border border-brand-500/10 rounded-xl space-y-4">
              <div className="flex items-center gap-3 text-white font-terminal text-sm border-b border-brand-500/10 pb-3">
                <CreditCard className="w-5 h-5 text-brand-500" />
                MÉTODO DE PAGO
              </div>
              <p className="text-gray-500 font-terminal text-xs leading-relaxed uppercase">
                Esta es una demostración. En la versión final, aquí se integrará Stripe o PayPal.
              </p>
            </div>

            <button className="btn-primary w-full py-5 flex items-center justify-center gap-3 group text-lg opacity-50 cursor-not-allowed">
              ORDENAR AHORA <ArrowRight className="w-5 h-5" />
            </button>
            
            <Link 
              href="/dashboard" 
              className="block text-center text-gray-600 hover:text-brand-500 font-terminal text-[10px] uppercase tracking-widest transition-colors"
            >
              Volver al inicio (Modo Demo)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
