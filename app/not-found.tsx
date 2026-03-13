import Link from "next/link";
import { Typography } from "@/components/ui/Typography";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center">
        <Typography variant="brand-h1" className="mb-4">🔍</Typography>
        <Typography as="h1" variant="brand-h2" className="mb-2 !text-white">Página no encontrada</Typography>
        <Typography variant="body" className="mb-6">El contenido que buscas no existe o fue movido.</Typography>
        <Link href="/dashboard" className="btn-primary">
          <Typography variant="pixel-label" as="span">Volver al inicio</Typography>
        </Link>
      </div>
    </div>
  );
}
