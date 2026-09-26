import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";

/**
 * PrismaClient de StackForge.
 * Prisma 7 requiere un driver adapter en el constructor; usamos @prisma/adapter-pg
 * con la connection string de DATABASE_URL.
 * Implementa los hooks de ciclo de vida de Nest para conectar/desconectar.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Logger con el nombre del servicio para trazar la conexión a la base de datos
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    // Pasa el adaptador de PostgreSQL al cliente Prisma (obligatorio en Prisma 7)
    super({
      adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" }),
    });
  }

  /**
   * Hook que Nest ejecuta al inicializar el módulo.
   * Intenta conectar; si falla solo registra un aviso (la app sigue arriba
   * y el endpoint /health reportará "degraded").
   */
  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log("Conectado a PostgreSQL");
    } catch (error) {
      this.logger.warn(
        `PostgreSQL no disponible al arrancar (health reportará degraded): ${String(error)}`,
      );
    }
  }

  /**
   * Hook que Nest ejecuta al apagar la app: cierra la conexión a PostgreSQL.
   */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}