import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StackForge — Aprende Fullstack construyendo",
  description:
    "Aprende desarrollando proyectos reales en tu propio entorno y recibe feedback automático de IA mientras construyes tu portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}