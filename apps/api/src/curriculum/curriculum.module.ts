/**
 * ARCHIVO: curriculum.module.ts
 * -----------------------------
 * Módulo de NestJS del dominio CURRÍCULUM. Agrupa el controlador HTTP y el
 * servicio de lectura. NestJS usa esta clase para instanciar ambos y
 * inyectarlos en el controlador (inversión de dependencias).
 */

import { Module } from "@nestjs/common";
import { CurriculumController } from "./curriculum.controller.js";
import { CurriculumService } from "./curriculum.service.js";

/**
 * Módulo raíz del dominio de currículum.
 * - controllers: las rutas HTTP bajo "/curriculum".
 * - providers: servicios disponibles para inyección dentro de este módulo.
 */
@Module({
  controllers: [CurriculumController],
  providers: [CurriculumService],
})
export class CurriculumModule {}
