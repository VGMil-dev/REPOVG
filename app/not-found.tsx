import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center">
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="text-2xl font-bold text-white mb-2">Página no encontrada</h1>
        <p className="text-gray-400 mb-6">El contenido que buscas no existe o fue movido.</p>
        <Link href="/dashboard" className="btn-primary">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
