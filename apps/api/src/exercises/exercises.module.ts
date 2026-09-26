/**
 * ARCHIVO: exercises.module.ts
 * ----------------------------
 * Módulo de NestJS del dominio EJERCICIOS. Importa PrismaModule para poder
 * usar PrismaService, registra su controlador y servicio, y exporta el
 * servicio para que otros módulos puedan reutilizarlo.
 */

import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { ExercisesController } from "./exercises.controller.js";
import { ExercisesService } from "./exercises.service.js";

/**
 * Módulo raíz del dominio de ejercicios.
 * - imports: PrismaModule (acceso a base de datos).
 * - controllers: rutas HTTP bajo "/exercises".
 * - providers: ExercisesService.
 * - exports: permite que otros módulos inyecten ExercisesService.
 */
@Module({
  imports: [PrismaModule],
  controllers: [ExercisesController],
  providers: [ExercisesService],
  exports: [ExercisesService],
})
export class ExercisesModule {}
