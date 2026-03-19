"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type {
  MascotState,
  ChatMessage,
  MascotChatContext,
  GeminiQuotaState,
} from "@/types";

export type MascotSpriteVariant = "default" | "fire" | "ice" | "dark";

interface MascotBubbleMessage {
  id: string;
  text: string;
  type: "info" | "question" | "success" | "warning";
  duration?: number;
}

const CHAT_STORAGE_KEY = "fragments_chat_history";
const MAX_CHAT_HISTORY = 50;
const QUOTA_STORAGE_KEY = "fragments_gemini_quota";

interface MascotContextType {
  // Auth
  userId: string;
  setUserId: (id: string) => void;
  // Identity
  name: string;
  setName: (name: string) => void;
  sprite: MascotSpriteVariant;
  setSprite: (sprite: MascotSpriteVariant) => void;
  // Animation state
  state: MascotState;
  setState: (state: MascotState) => void;
  // Single bubble (when chat closed)
  bubble: MascotBubbleMessage | null;
  say: (text: string, type?: MascotBubbleMessage["type"], duration?: number) => void;
  clearBubble: () => void;
  // Chat
  chatOpen: boolean;
  setChatOpen: (v: boolean) => void;
  chatHistory: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChatHistory: () => void;
  // Chat context (topic syncing)
  chatContext: MascotChatContext;
  setChatContext: (ctx: MascotChatContext) => void;
  // Interaction state
  intentosFallidos: number;
  setIntentosFallidos: (n: number) => void;
  isThinking: boolean;
  setIsThinking: (v: boolean) => void;
  // Gemini quota
  geminiQuota: GeminiQuotaState | null;
  setGeminiQuota: (q: GeminiQuotaState | null) => void;
}

const MascotContext = createContext<MascotContextType | undefined>(undefined);

const VALID_SPRITES: MascotSpriteVariant[] = ["default", "fire", "ice", "dark"];

const DEFAULT_CHAT_CONTEXT: MascotChatContext = {
  materiaSlug: null,
  materiaId: null,
  temaSlug: null,
  temaTitulo: null,
  conceptosClave: [],
  preguntaActivaId: null,
};

export function MascotProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string>("");
  const [name, setNameState] = useState<string>("Compañero");
  const [sprite, setSpriteState] = useState<MascotSpriteVariant>("default");
  const [state, setState] = useState<MascotState>("idle");
  const [bubble, setBubble] = useState<MascotBubbleMessage | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatContext, setChatContext] = useState<MascotChatContext>(DEFAULT_CHAT_CONTEXT);
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [geminiQuota, setGeminiQuotaState] = useState<GeminiQuotaState | null>(null);

  // Hydrate from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem("fragments_mascot_name");
    if (savedName) setNameState(savedName);

    const savedSprite = localStorage.getItem("fragments_mascot_sprite") as MascotSpriteVariant | null;
    if (savedSprite && VALID_SPRITES.includes(savedSprite)) setSpriteState(savedSprite);

    try {
      const savedHistory = localStorage.getItem(CHAT_STORAGE_KEY);
      if (savedHistory) setChatHistory(JSON.parse(savedHistory));
    } catch { /* ignore */ }

    try {
      const savedQuota = localStorage.getItem(QUOTA_STORAGE_KEY);
      if (savedQuota) {
        const q: GeminiQuotaState = JSON.parse(savedQuota);
        // Auto-clear expired quota
        if (Date.now() >= q.expiraAt) {
          localStorage.removeItem(QUOTA_STORAGE_KEY);
        } else {
          setGeminiQuotaState(q);
        }
      }
    } catch { /* ignore */ }
  }, []);

  const setName = (newName: string) => {
    setNameState(newName);
    localStorage.setItem("fragments_mascot_name", newName);
  };

  const setSprite = (s: MascotSpriteVariant) => {
    setSpriteState(s);
    localStorage.setItem("fragments_mascot_sprite", s);
  };

  const setGeminiQuota = useCallback((q: GeminiQuotaState | null) => {
    setGeminiQuotaState(q);
    if (q) {
      localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(q));
    } else {
      localStorage.removeItem(QUOTA_STORAGE_KEY);
    }
  }, []);

  // say() — single bubble when closed, routes to chat when open
  const say = useCallback((text: string, type: MascotBubbleMessage["type"] = "info", duration = 5000) => {
    if (chatOpen) {
      // Route to chat history as a mascot message
      const msg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        role: "mascot",
        text,
        trigger: "frase_evento",
        timestamp: Date.now(),
      };
      setChatHistory((prev) => {
        const next = [...prev, msg].slice(-MAX_CHAT_HISTORY);
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    } else {
      // Replace single bubble
      const id = Math.random().toString(36).substring(7);
      setBubble({ id, text, type, duration });
      if (duration > 0) {
        setTimeout(() => {
          setBubble((prev) => (prev?.id === id ? null : prev));
        }, duration);
      }
    }
  }, [chatOpen]);

  const clearBubble = useCallback(() => setBubble(null), []);

  const addChatMessage = useCallback((msg: ChatMessage) => {
    setChatHistory((prev) => {
      const next = [...prev, msg].slice(-MAX_CHAT_HISTORY);
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearChatHistory = useCallback(() => {
    setChatHistory([]);
    localStorage.removeItem(CHAT_STORAGE_KEY);
  }, []);

  return (
    <MascotContext.Provider value={{
      userId, setUserId,
      name, setName,
      sprite, setSprite,
      state, setState,
      bubble, say, clearBubble,
      chatOpen, setChatOpen,
      chatHistory, addChatMessage, clearChatHistory,
      chatContext, setChatContext,
      intentosFallidos, setIntentosFallidos,
      isThinking, setIsThinking,
      geminiQuota, setGeminiQuota,
    }}>
      {children}
    </MascotContext.Provider>
  );
}

export function useMascot() {
  const context = useContext(MascotContext);
  if (context === undefined) {
    throw new Error("useMascot debe usarse dentro de un MascotProvider");
  }
  return context;
}
