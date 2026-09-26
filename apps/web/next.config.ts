/*
 * next.config.ts
 * -----------------------------------------------------------------------------
 * Configuración de Next.js del frontend (apps/web) de StackForge.
 * Define el modo estricto de React y un "rewrite" que funciona como proxy:
 * las llamadas a /api/... del navegador se reenvían al backend real.
 * -----------------------------------------------------------------------------
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Modo estricto de React: ayuda a detectar efectos y malas prácticas en desarrollo
  reactStrictMode: true,

  /**
   * Rewrites: reglas que reescriben la URL interna SIN cambiar la del navegador.
   * Sirven para evitar problemas de CORS al hablar con la API desde el mismo origen.
   */
  async rewrites() {
    return [
      {
        // Origen: cualquier petición del frontend que empiece por /api/
        source: "/api/:path*",
        // Destino: backend indicado en API_PROXY (por defecto http://localhost:4000)
        destination: `${process.env.API_PROXY ?? "http://localhost:4000"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;