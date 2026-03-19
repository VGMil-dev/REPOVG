import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-terminal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fragments",
  description: "Plataforma académica gamificada",
};

import { MascotProvider } from "@/lib/context/MascotContext";
import { MascotWidget } from "@/components/mascot/MascotWidget";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${pressStart2P.variable} ${vt323.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-gray-950 text-gray-100 antialiased">
        <MascotProvider>
          {children}
          <MascotWidget />
        </MascotProvider>
      </body>
    </html>
  );
}
