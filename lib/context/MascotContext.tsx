"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type MascotState = "idle" | "think" | "curious" | "celebrate" | "worry" | "learning";

interface MascotMessage {
  id: string;
  text: string;
  type: "info" | "question" | "success" | "warning";
  duration?: number;
}

interface MascotContextType {
  name: string;
  setName: (name: string) => void;
  state: MascotState;
  setState: (state: MascotState) => void;
  messages: MascotMessage[];
  say: (text: string, type?: MascotMessage["type"], duration?: number) => void;
  clearMessages: () => void;
}

const MascotContext = createContext<MascotContextType | undefined>(undefined);

export function MascotProvider({ children }: { children: React.ReactNode }) {
  const [name, setNameState] = useState<string>("Compañero");
  const [state, setState] = useState<MascotState>("idle");
  const [messages, setMessages] = useState<MascotMessage[]>([]);

  // Cargamos el nombre desde localStorage si existe
  useEffect(() => {
    const savedName = localStorage.getItem("repovg_mascot_name");
    if (savedName) setNameState(savedName);
  }, []);

  const setName = (newName: string) => {
    setNameState(newName);
    localStorage.setItem("repovg_mascot_name", newName);
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
    <MascotContext.Provider value={{ name, setName, state, setState, messages, say, clearMessages }}>
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
