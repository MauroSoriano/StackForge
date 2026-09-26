/**
 * ARCHIVO: progress.module.ts
 * ---------------------------
 * Módulo de NestJS del dominio PROGRESO (Learning Engine). Agrupa el
 * controlador HTTP y el servicio que gobierna el avance del estudiante.
 */

import { Module } from "@nestjs/common";
import { ProgressController } from "./progress.controller.js";
import { ProgressService } from "./progress.service.js";

/**
 * Módulo raíz del dominio de progreso.
 * - controllers: rutas HTTP bajo "/progress".
 * - providers: ProgressService (lógica de avance y desbloqueo).
 */
@Module({
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}
