"use client";

import React, { useState } from "react";
import { Brain, Sparkles, ShieldCheck, ArrowRight, Loader2, ExternalLink } from "lucide-react";
import { validateGeminiKey } from "@/lib/auth/onboarding-actions";
import { useRouter } from "next/navigation";

export default function Mission1Page() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await validateGeminiKey(apiKey);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/onboarding/mision-2"); // Siguiente paso
      }, 2000);
    } else {
      setError(result.error || "Validación fallida");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10">
        {/* Mission Header */}
        <div className="flex flex-col items-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full text-brand-500 text-[10px] font-pixel uppercase tracking-widest mb-6">
            Misión 01 — Protocolo de Inteligencia
          </div>
          <h1 className="text-4xl md:text-5xl font-pixel text-white text-glow mb-4 text-center leading-tight">
            OPERACIÓN <br />
            <span className="text-orange-500 text-glow-orange">CEREBRITO</span>
          </h1>
          <p className="font-terminal text-gray-400 text-center uppercase tracking-wider max-w-md">
            Necesitamos un núcleo cognitivo para tu aventura. Vamos a conectar con Gemini.
          </p>
        </div>

        {/* Action Card */}
        <div className={`border-2 transition-all duration-500 ${success ? 'border-brand-500 bg-brand-500/5' : 'border-brand-500/20 bg-black/60'} backdrop-blur-xl p-8 rounded-2xl shadow-[0_0_50px_rgba(34,197,94,0.05)]`}>
          {!success ? (
            <div className="space-y-8">
              <div className="flex items-start gap-4 p-4 bg-brand-500/5 border border-brand-500/10 rounded-xl">
                <Brain className="w-8 h-8 text-brand-500 shrink-0 mt-1" />
                <div className="space-y-2">
                  <h3 className="text-white font-pixel text-xs tracking-tighter uppercase">Instrucciones del Sistema</h3>
                  <p className="text-brand-400/60 font-terminal text-sm leading-relaxed">
                    Para que RepoVG te ayude a codear, necesitamos tu propia **Gemini API Key**.
                    Es gratuita y tus datos se almacenan de forma segura.
                  </p>
                </div>
              </div>

              <form onSubmit={handleValidate} className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="font-pixel text-[10px] text-brand-500/50 uppercase">Google AI API KEY</label>
                    <a 
                      href="https://aistudio.google.com/app/apikey" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-400 font-terminal text-[10px] flex items-center gap-1 transition-colors underline decoration-orange-500/30"
                    >
                      OBTENER KEY <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-500/30" />
                    <input
                      type="password"
                      placeholder="Pega aquí tu API Key (AIza...)"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full bg-black/40 border-2 border-brand-500/20 rounded-xl py-4 pl-12 pr-4 font-mono text-sm text-brand-300 focus:border-brand-500/60 focus:outline-none transition-all placeholder:text-brand-900 shadow-[inset_0_0_15px_rgba(34,197,94,0.05)]"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 font-terminal text-xs uppercase text-center animate-shake">
                    ERROR_DE_NÚCLEO: {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !apiKey}
                  className="btn-primary w-full py-5 flex items-center justify-center gap-3 group text-lg"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      SINCRONIZAR NÚCLEO <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="relative">
                <div className="w-20 h-20 bg-brand-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.6)]">
                   <Sparkles className="w-10 h-10 text-black animate-pulse" />
                </div>
                <div className="absolute inset-0 bg-brand-500 rounded-full animate-ping opacity-25" />
              </div>
              <div className="space-y-2">
                <h2 className="text-brand-500 font-pixel text-xl uppercase tracking-tighter">NÚCLEO SINCRONIZADO</h2>
                <p className="text-brand-400 font-terminal uppercase tracking-widest text-sm">Escaneando parámetros de red...</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-8 flex justify-center gap-8 opacity-40">
           <div className="flex items-center gap-2 font-terminal text-[10px] text-gray-500 uppercase tracking-widest">
              <Zap className="w-3 h-3" /> Gemini AI Enabled
           </div>
           <div className="flex items-center gap-2 font-terminal text-[10px] text-gray-500 uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" /> Secure Storage
           </div>
        </div>
      </div>
    </div>
  );
}

// Re-using Zap icon
function Zap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.71 13.06 3.5a.5.5 0 0 1 .84.51L11.5 12h7a.5.5 0 0 1 .36.85L9.5 24.5a.5.5 0 0 1-.84-.51L10.5 16h-6.14a.5.5 0 0 1-.36-.85z" />
    </svg>
  );
}
