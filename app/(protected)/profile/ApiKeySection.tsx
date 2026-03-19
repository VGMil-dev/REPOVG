"use client";

import { useState } from "react";
import { ShieldCheck, ExternalLink, Check, X, Loader2, Pencil, Trash2 } from "lucide-react";
import { Typography } from "@/components/ui/Typography";
import { updateGeminiKey } from "@/features/auth/services/profile-actions";
import { useRouter } from "next/navigation";

interface Props {
  geminiConnected: boolean;
}

export function ApiKeySection({ geminiConnected }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async () => {
    if (!value.trim()) return;
    setStatus("saving");
    setErrorMsg(null);
    const result = await updateGeminiKey(value.trim());
    if (result.success) {
      setStatus("ok");
      setTimeout(() => {
        setEditing(false);
        setValue("");
        setStatus("idle");
        router.refresh();
      }, 1000);
    } else {
      setStatus("error");
      setErrorMsg(result.error || "Error al guardar");
    }
  };

  const handleRemove = async () => {
    setStatus("saving");
    await updateGeminiKey("");
    setStatus("idle");
    router.refresh();
  };

  return (
    <div className="border border-brand-500/10 rounded-xl p-4 bg-black/20 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Typography variant="terminal-sm" className="!text-white font-bold text-[13px]">
            Google Gemini
          </Typography>
          <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase border rounded tracking-widest bg-brand-500/10 border-brand-500/20 text-brand-500">
            GRATIS
          </span>
        </div>

        <div className="flex items-center gap-2">
          {geminiConnected ? (
            <>
              <div className="flex items-center gap-1 text-brand-500">
                <Check className="w-3.5 h-3.5" />
                <Typography variant="terminal-sm" className="!text-brand-500 text-[10px] uppercase">Conectado</Typography>
              </div>
              <button onClick={() => setEditing(true)} title="Editar" className="p-1 rounded text-gray-600 hover:text-gray-300 transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={handleRemove} title="Desconectar" className="p-1 rounded text-gray-600 hover:text-red-400 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1 text-gray-600">
              <X className="w-3.5 h-3.5" />
              <Typography variant="terminal-sm" className="!text-gray-600 text-[10px] uppercase">No conectado</Typography>
            </div>
          )}
        </div>
      </div>

      {/* Edit form */}
      {(editing || !geminiConnected) && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between px-1">
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
              <Typography variant="terminal-sm" className="!text-orange-500 hover:text-orange-400 flex items-center gap-1 transition-colors text-[10px] uppercase">
                Obtener en AI Studio <ExternalLink className="w-3 h-3" />
              </Typography>
            </a>
            {editing && (
              <button
                onClick={() => { setEditing(false); setValue(""); setStatus("idle"); setErrorMsg(null); }}
                className="text-[10px] font-mono uppercase text-gray-600 hover:text-gray-400 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500/30" />
              <input
                type="password"
                placeholder="AIza..."
                value={value}
                onChange={(e) => { setValue(e.target.value); setStatus("idle"); setErrorMsg(null); }}
                className="w-full bg-black/40 border border-brand-500/20 rounded-lg py-2.5 pl-10 pr-4 font-mono text-sm text-brand-300 focus:border-brand-500/60 focus:outline-none transition-all placeholder:text-brand-900"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={!value.trim() || status === "saving" || status === "ok"}
              className="px-4 py-2 bg-brand-500/10 border border-brand-500/30 rounded-lg font-mono text-xs text-brand-400 hover:bg-brand-500/20 hover:border-brand-500/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 uppercase whitespace-nowrap"
            >
              {status === "saving" ? <Loader2 className="w-4 h-4 animate-spin" /> :
               status === "ok" ? <Check className="w-4 h-4 text-brand-500" /> :
               "Guardar"}
            </button>
          </div>
          {errorMsg && (
            <Typography variant="terminal-sm" className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg !text-red-500 uppercase text-[10px]">
              {errorMsg}
            </Typography>
          )}
        </div>
      )}
    </div>
  );
}
