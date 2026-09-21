import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";

/**
 * PrismaClient de StackForge.
 * Prisma 7 requiere un driver adapter en el constructor; usamos @prisma/adapter-pg
 * con la connection string de DATABASE_URL.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" }),
    });
  }

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

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}