/**
 * ARCHIVO: submissions.module.ts
 * ------------------------------
 * Módulo de NestJS del dominio ENTREGAS (submissions). Importa PrismaModule,
 * registra el controlador y el servicio, y sobre todo enlaza el token
 * SANDBOX_RUNNER con la implementación concreta DockerSandboxRunner.
 */

import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { SubmissionsController } from "./submissions.controller.js";
import { SubmissionsService } from "./submissions.service.js";
import { SANDBOX_RUNNER } from "./sandbox/sandbox-runner.interface.js";
import { DockerSandboxRunner } from "./sandbox/docker-sandbox.runner.js";

/**
 * Módulo raíz del dominio de entregas.
 * - imports: PrismaModule (persistencia de submissions).
 * - controllers: rutas HTTP bajo "/submissions".
 * - providers: SubmissionsService y el proveedor del sandbox.
 *   Se usa el token SANDBOX_RUNNER con useValue para inyectar la
 *   implementación Docker; el servicio depende de la interfaz, no de la clase.
 * - exports: SubmissionsService reutilizable por otros módulos.
 */
@Module({
  imports: [PrismaModule],
  controllers: [SubmissionsController],
  providers: [
    SubmissionsService,
    {
      // Enlaza el token de inyección con la implementación basada en Docker.
      provide: SANDBOX_RUNNER,
      useValue: new DockerSandboxRunner(),
    },
  ],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
