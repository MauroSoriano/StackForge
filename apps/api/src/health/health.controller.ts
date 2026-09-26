/**
 * Controlador de salud (health check).
 * Expone GET /api/health para verificar que la API responde y que la
 * base de datos PostgreSQL está accesible.
 */

import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

/** Forma de la respuesta del health check. */
interface HealthResponse {
  status: "ok" | "degraded"; // estado general del servicio
  database: "up" | "down"; // estado de la conexión a PostgreSQL
  timestamp: string; // fecha/hora ISO de la comprobación
}

@Controller("health") // Ruta base: /api/health
export class HealthController {
  // Inyecta el servicio de Prisma para poder consultar la base de datos
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Comprueba la salud ejecutando un SELECT trivial.
   * @returns "ok"/"up" si la consulta funciona, "degraded"/"down" si falla.
   */
  @Get()
  async check(): Promise<HealthResponse> {
    try {
      // Consulta mínima para verificar que la conexión a la BD responde
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: "ok", database: "up", timestamp: new Date().toISOString() };
    } catch {
      // La app sigue viva aunque la BD no esté disponible
      return { status: "degraded", database: "down", timestamp: new Date().toISOString() };
    }
  }
}