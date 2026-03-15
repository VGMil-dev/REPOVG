"use client";

import { useEffect } from "react";
import { useMascot } from "@/lib/context/MascotContext";

export function MascotUserSync({ userId }: { userId: string }) {
  const { setUserId } = useMascot();

  useEffect(() => {
    if (userId) setUserId(userId);
  }, [userId, setUserId]);

  return null;
}
