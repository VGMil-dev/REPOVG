"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { 
  ChatMessage, 
  MascotChatContext, 
  MascotState, 
  GeminiQuotaState,
  MascotSpriteVariant 
} from "../models/mascot";

export type { MascotSpriteVariant };

interface MascotContextType {
  name: string;
  isChatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  chatHistory: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChatHistory: () => void;
  chatContext: MascotChatContext;
  intentosFallidos: number;
  setIntentosFallidos: (n: number) => void;
  isThinking: boolean;
  setIsThinking: (thinking: boolean) => void;
  geminiQuota: GeminiQuotaState | null;
  setGeminiQuota: (quota: GeminiQuotaState | null) => void;
  state: MascotState;
  setState: (state: MascotState) => void;
  say: (text: string, type?: "info" | "success" | "warning" | "error" | "question", duration?: number) => void;
  setName: (name: string) => void;
  setSprite: (sprite: MascotSpriteVariant) => void;
  sprite: MascotSpriteVariant;
  userId: string | null;
  setUserId: (id: string | null) => void;
  bubble: { text: string; type: "info" | "success" | "warning" | "error" | "question" } | null;
  clearBubble: () => void;
  chatOpen: boolean;
  setChatContext: (context: MascotChatContext) => void;
}

const MascotContext = createContext<MascotContextType | undefined>(undefined);

export function MascotProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState("KODIE");
  const [sprite, setSprite] = useState<MascotSpriteVariant>("default");
  const [isChatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [geminiQuota, setGeminiQuota] = useState<GeminiQuotaState | null>(null);
  const [state, setState] = useState<MascotState>("idle");
  const [chatContext, setChatContext] = useState<MascotChatContext>({
    materiaSlug: null,
    materiaId: null,
    temaSlug: null,
    temaTitulo: null,
    conceptosClave: [],
    preguntaActivaId: null,
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [bubble, setBubble] = useState<{ text: string; type: any } | null>(null);

  const addChatMessage = (msg: ChatMessage) => {
    setChatHistory((prev) => [...prev, msg]);
  };

  const clearChatHistory = () => {
    setChatHistory([]);
  };

  const say = (text: string, type: any = "info", duration: number = 5000) => {
    setBubble({ text, type });
    if (duration > 0) {
      setTimeout(() => setBubble(null), duration);
    }
  };

  const clearBubble = () => setBubble(null);

  return (
    <MascotContext.Provider
      value={{
        name,
        isChatOpen,
        setChatOpen,
        chatHistory,
        addChatMessage,
        clearChatHistory,
        chatContext,
        intentosFallidos,
        setIntentosFallidos,
        isThinking,
        setIsThinking,
        geminiQuota,
        setGeminiQuota,
        state,
        setState,
        say,
        setName,
        setSprite,
        sprite,
        userId,
        setUserId,
        bubble,
        clearBubble,
        chatOpen: isChatOpen,
        setChatContext
      }}
    >
      {children}
    </MascotContext.Provider>
  );
}

export function useMascot() {
  const context = useContext(MascotContext);
  if (context === undefined) {
    throw new Error("useMascot must be used within a MascotProvider");
  }
  return context;
}
