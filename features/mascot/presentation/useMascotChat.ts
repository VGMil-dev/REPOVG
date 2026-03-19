"use client";

import { useState, useCallback, useEffect } from "react";
import { useMascot } from "../services/MascotContext";
import { chatWithMascot } from "../services/actions";
import type { ChatMessage, GeminiQuotaState } from "../models/mascot";

const COOLDOWN_BASE_MS = 30 * 60 * 1000;
const COOLDOWN_LONG_MS = 60 * 60 * 1000;

function makeId() {
  return Math.random().toString(36).substring(2);
}

export const useMascotChat = (userId: string) => {
  const {
    name,
    chatHistory,
    addChatMessage,
    chatContext,
    intentosFallidos,
    setIntentosFallidos,
    isThinking,
    setIsThinking,
    geminiQuota,
    setGeminiQuota,
    setState: setMascotState,
  } = useMascot();

  const [input, setInput] = useState("");
  const [remainingTime, setRemainingTime] = useState("");

  const isQuotaActive = geminiQuota && Date.now() < geminiQuota.expiraAt;

  useEffect(() => {
    if (!geminiQuota || Date.now() >= geminiQuota.expiraAt) {
      if (geminiQuota) setGeminiQuota(null);
      setRemainingTime("");
      return;
    }

    const tick = () => {
      const diff = geminiQuota.expiraAt - Date.now();
      if (diff <= 0) {
        setGeminiQuota(null);
        setRemainingTime("");
        return;
      }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemainingTime(`${m}:${s.toString().padStart(2, "0")}`);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [geminiQuota, setGeminiQuota]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isThinking || isQuotaActive) return;

    setInput("");

    const userMsg: ChatMessage = {
      id: makeId(),
      role: "user",
      text,
      trigger: chatContext.conceptosClave.length > 0 ? "validacion_conceptos" : "chat_libre",
      timestamp: Date.now(),
    };
    addChatMessage(userMsg);
    setIsThinking(true);
    setMascotState("think");

    try {
      const response = await chatWithMascot({
        userMsg: text,
        context: chatContext,
        intentosFallidos,
        mascotName: name,
        userId,
      });

      if (response.quotaExhausted) {
        const fallos = (geminiQuota?.fallosConsecutivos ?? 0) + 1;
        const cooldown = fallos >= 2 ? COOLDOWN_LONG_MS : COOLDOWN_BASE_MS;
        const now = Date.now();
        const newQuota: GeminiQuotaState = {
          agotadoAt: now,
          expiraAt: now + cooldown,
          fallosConsecutivos: fallos,
        };
        setGeminiQuota(newQuota);
        setMascotState("idle");
      } else {
        setMascotState(response.mascotState);
        if (response.debeRegistrarAprendido) {
          setIntentosFallidos(0);
        } else if (!response.debeRegistrarAprendido && chatContext.conceptosClave.length > 0) {
          setIntentosFallidos(intentosFallidos + 1);
        }
      }

      const mascotMsg: ChatMessage = {
        id: makeId(),
        role: "mascot",
        text: response.texto,
        trigger: response.debeRegistrarAprendido ? "validacion_conceptos" : "chat_libre",
        timestamp: Date.now(),
        conceptosValidados: response.conceptosAprendidos,
      };
      addChatMessage(mascotMsg);
    } catch {
      const errMsg: ChatMessage = {
        id: makeId(),
        role: "mascot",
        text: "Tuve un problema de conexion. Intenta de nuevo.",
        trigger: "sistema",
        timestamp: Date.now(),
      };
      addChatMessage(errMsg);
      setMascotState("worry");
    } finally {
      setIsThinking(false);
    }
  }, [
    input, isThinking, isQuotaActive, chatContext, intentosFallidos,
    name, userId, geminiQuota,
    addChatMessage, setIsThinking, setMascotState, setGeminiQuota, setIntentosFallidos,
  ]);

  return {
    input,
    setInput,
    handleSend,
    isThinking,
    isQuotaActive,
    remainingTime,
    chatHistory,
  };
};
