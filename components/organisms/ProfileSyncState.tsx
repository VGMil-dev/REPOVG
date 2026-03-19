"use client";

import React from "react";

export default function ProfileSyncState() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <p className="text-2xl animate-bounce">⏳</p>
        <h1 className="text-xl font-bold text-white">Sincronizando perfil...</h1>
        <p className="text-gray-400 text-sm">Estamos preparando tu aventura. Por favor espera un momento.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-brand-500 text-xs underline mt-4 hover:text-brand-400 transition-colors"
        >
          Reintentar ahora
        </button>
      </div>
    </div>
  );
}
