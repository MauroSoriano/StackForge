/**
 * Módulo global que expone PrismaService.
 * Al ser @Global(), cualquier otro módulo puede inyectar PrismaService
 * sin necesidad de importar PrismaModule explícitamente.
 */

import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service.js";

@Global() // Hace que los exports del módulo estén disponibles en toda la app
@Module({
  providers: [PrismaService], // Registra el servicio de acceso a datos
  exports: [PrismaService], // Permite inyectarlo desde otros módulos
})
// Módulo encargado de la conexión a PostgreSQL
export class PrismaModule {}