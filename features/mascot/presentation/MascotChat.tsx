"use client";

import React, { useEffect, useRef } from "react";
import { Send, X, Trash2 } from "lucide-react";

interface MascotChatProps {
  userId: string;
}

import { ChatMessage } from "../models/mascot";
import { useMascot } from "../services/MascotContext";
import { useMascotChat } from "./useMascotChat";

export function MascotChat({ userId }: MascotChatProps) {
  const {
    name,
    setChatOpen,
    clearChatHistory,
    chatContext,
    setIntentosFallidos,
    setGeminiQuota,
  } = useMascot();

  const {
    input,
    setInput,
    handleSend,
    isThinking,
    isQuotaActive,
    remainingTime,
    chatHistory,
  } = useMascotChat(userId);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isThinking]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="flex flex-col bg-[#0a0a0a] border border-brand-500/30 rounded-none shadow-[0_0_30px_rgba(34,197,94,0.15)]"
      style={{ width: 320, height: 440 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-brand-500/20 bg-[#050505]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-brand-500">
            {name}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => { clearChatHistory(); setGeminiQuota(null); setIntentosFallidos(0); }}
            className="p-1 text-brand-500/30 hover:text-brand-500/70 transition-colors"
            title="Limpiar historial y reiniciar estado"
          >
            <Trash2 size={12} />
          </button>
          <button
            onClick={() => setChatOpen(false)}
            className="p-1 text-brand-500/30 hover:text-brand-500/70 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Context indicator */}
      {chatContext.temaTitulo && (
        <div className="px-3 py-1 bg-brand-500/5 border-b border-brand-500/10">
          <span className="font-mono text-[9px] uppercase tracking-wider text-brand-500/50">
            Tema: {chatContext.temaTitulo}
          </span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scrollbar-thin scrollbar-thumb-brand-500/20">
        {chatHistory.length === 0 && (
          <div className="text-center py-8">
            <p className="font-mono text-[10px] text-brand-500/30 uppercase tracking-wider">
              Cuéntame qué estás aprendiendo
            </p>
          </div>
        )}

        {chatHistory.map((msg) => (
          <ChatBubble key={msg.id} msg={msg} />
        ))}

        {isThinking && <ThinkingIndicator />}

        <div ref={bottomRef} />
      </div>

      {/* Quota exhausted overlay */}
      {isQuotaActive && (
        <div className="px-3 py-2 bg-[#050505] border-t border-brand-500/10">
          <p className="font-mono text-[10px] text-brand-500/50 uppercase tracking-wider text-center">
            Descansando — {remainingTime}
          </p>
        </div>
      )}

      {/* Input */}
      <div className="px-3 py-2 border-t border-brand-500/20 bg-[#050505]">
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!!isQuotaActive || isThinking}
            placeholder={isQuotaActive ? "Mascota descansando..." : "Enseñame algo..."}
            className="flex-1 bg-transparent border border-brand-500/20 rounded-none px-2 py-1.5 font-mono text-[11px] text-brand-500/90 placeholder:text-brand-500/20 focus:outline-none focus:border-brand-500/50 disabled:opacity-30 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !!isQuotaActive || isThinking}
            className="p-1.5 border border-brand-500/30 text-brand-500 hover:bg-brand-500/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ChatBubble({ msg }: { msg: ChatMessage }) {
  const isMascot = msg.role === "mascot";
  return (
    <div className={`flex ${isMascot ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[80%] px-3 py-2 font-mono text-[11px] leading-snug ${
          isMascot
            ? "bg-brand-500/10 border border-brand-500/20 text-brand-500/90"
            : "bg-[#1a1a1a] border border-white/10 text-white/70"
        }`}
      >
        {msg.text}
        {msg.conceptosValidados && msg.conceptosValidados.length > 0 && (
          <div className="mt-1 pt-1 border-t border-brand-500/20">
            <span className="text-brand-500/50 text-[9px] uppercase tracking-wider">
              Aprendido: {msg.conceptosValidados.join(", ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="px-3 py-2 bg-brand-500/10 border border-brand-500/20">
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-brand-500/60 animate-bounce"
              style={{ animationDelay: `${i * 150}ms`, animationDuration: "700ms" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
