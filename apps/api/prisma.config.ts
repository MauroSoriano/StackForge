import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Configuración de Prisma 7.
 * En Prisma 7 la conexión (url) NO va en el schema.prisma:
 * se define aquí para Migrate/CLI y se pasa el adaptador al PrismaClient en runtime.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});