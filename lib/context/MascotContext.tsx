"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type MascotState = "idle" | "think" | "curious" | "celebrate" | "worry" | "learning" | "putbrain";

export type MascotSpriteVariant = "default" | "fire" | "ice" | "dark";

interface MascotMessage {
  id: string;
  text: string;
  type: "info" | "question" | "success" | "warning";
  duration?: number;
}

interface MascotContextType {
  name: string;
  setName: (name: string) => void;
  sprite: MascotSpriteVariant;
  setSprite: (sprite: MascotSpriteVariant) => void;
  state: MascotState;
  setState: (state: MascotState) => void;
  messages: MascotMessage[];
  say: (text: string, type?: MascotMessage["type"], duration?: number) => void;
  clearMessages: () => void;
}

const MascotContext = createContext<MascotContextType | undefined>(undefined);

const VALID_SPRITES: MascotSpriteVariant[] = ["default", "fire", "ice", "dark"];

export function MascotProvider({ children }: { children: React.ReactNode }) {
  const [name, setNameState] = useState<string>("Compañero");
  const [sprite, setSpriteState] = useState<MascotSpriteVariant>("default");
  const [state, setState] = useState<MascotState>("idle");
  const [messages, setMessages] = useState<MascotMessage[]>([]);

  useEffect(() => {
    const savedName = localStorage.getItem("repovg_mascot_name");
    if (savedName) setNameState(savedName);

    const savedSprite = localStorage.getItem("repovg_mascot_sprite") as MascotSpriteVariant | null;
    if (savedSprite && VALID_SPRITES.includes(savedSprite)) setSpriteState(savedSprite);
  }, []);

  const setName = (newName: string) => {
    setNameState(newName);
    localStorage.setItem("repovg_mascot_name", newName);
  };

  const setSprite = (s: MascotSpriteVariant) => {
    setSpriteState(s);
    localStorage.setItem("repovg_mascot_sprite", s);
  };

  const say = useCallback((text: string, type: MascotMessage["type"] = "info", duration = 5000) => {
    const id = Math.random().toString(36).substring(7);
    const newMessage: MascotMessage = { id, text, type, duration };

    setMessages((prev) => [...prev, newMessage]);

    if (duration > 0) {
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }, duration);
    }
  }, []);

  const clearMessages = () => setMessages([]);

  return (
    <MascotContext.Provider value={{ name, setName, sprite, setSprite, state, setState, messages, say, clearMessages }}>
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
