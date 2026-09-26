/**
 * ARCHIVO: progress.controller.ts
 * -------------------------------
 * Capa HTTP del dominio PROGRESO. Expone rutas protegidas (JWT) para consultar
 * y actualizar el avance del estudiante: empezar/completar modulos y clases.
 * Cada operacion se ejecuta sobre el usuario autenticado (CurrentUser).
 */

import { Controller, Get, Post, Param, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import type { AuthUser } from "../auth/interfaces/auth-user.interface.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { ProgressService } from "./progress.service.js";

/**
 * Controlador REST de progreso.
 * El guard JwtAuthGuard exige un token valido en todas las rutas; el usuario
 * se obtiene con el decorador @CurrentUser().
 */
@ApiTags("progress")
@UseGuards(JwtAuthGuard)
@Controller("progress")
export class ProgressController {
  // Servicio de progreso; NestJS lo inyecta automaticamente.
  constructor(private readonly progress: ProgressService) {}

  /**
   * GET /progress
   * Devuelve todo el progreso del usuario autenticado: tracks, progreso por
   * modulo (UserProgress) y progreso por clase (LessonProgress).
   */
  @Get()
  @ApiOperation({ summary: "Mi progreso en el curr��culum" })
  getMyProgress(@CurrentUser() user: AuthUser) {
    return this.progress.getMyProgress(user.id);
  }

  /**
   * POST /progress/tracks/:trackId/modules/:moduleId/start
   * Marca el modulo como IN_PROGRESS (empezado) para el usuario.
   * @param trackId Id del track al que pertenece el modulo.
   * @param moduleId Id del modulo que se empieza.
   */
  @Post("tracks/:trackId/modules/:moduleId/start")
  @ApiOperation({ summary: "Empezar un m��dulo de la secuencia" })
  @ApiParam({ name: "trackId", description: "Id (cuid) del track" })
  @ApiParam({ name: "moduleId", description: "Id (cuid) del m��dulo" })
  startModule(
    @CurrentUser() user: AuthUser,
    @Param("trackId") trackId: string,
    @Param("moduleId") moduleId: string,
  ) {
    return this.progress.startModule(user.id, trackId, moduleId);
  }

  /**
   * POST /progress/tracks/:trackId/modules/:moduleId/complete
   * Completa el modulo actual y desbloquea (AVAILABLE) el siguiente.
   * @param trackId Id del track.
   * @param moduleId Id del modulo que se completa.
   */
  @Post("tracks/:trackId/modules/:moduleId/complete")
  @ApiOperation({ summary: "Completar un m��dulo y desbloquear el siguiente" })
  @ApiParam({ name: "trackId", description: "Id (cuid) del track" })
  @ApiParam({ name: "moduleId", description: "Id (cuid) del m��dulo" })
  complete(
    @CurrentUser() user: AuthUser,
    @Param("trackId") trackId: string,
    @Param("moduleId") moduleId: string,
  ) {
    return this.progress.completeAndUnlock(user.id, trackId, moduleId);
  }

  /**
   * POST /progress/lessons/:lessonId/start
   * Registra que el estudiante abrio (empezo) una clase.
   * @param lessonId Id de la clase.
   */
  @Post("lessons/:lessonId/start")
  @ApiOperation({ summary: "Empezar una clase (registra el avance)" })
  @ApiParam({ name: "lessonId", description: "Id (cuid) de la clase" })
  startLesson(
    @CurrentUser() user: AuthUser,
    @Param("lessonId") lessonId: string,
  ) {
    return this.progress.startLesson(user.id, lessonId);
  }

  /**
   * POST /progress/lessons/:lessonId/complete
   * Marca la clase como completada y recalcula el progreso de su modulo.
   * @param lessonId Id de la clase.
   */
  @Post("lessons/:lessonId/complete")
  @ApiOperation({ summary: "Completar una clase y actualizar su secci��n" })
  @ApiParam({ name: "lessonId", description: "Id (cuid) de la clase" })
  completeLesson(
    @CurrentUser() user: AuthUser,
    @Param("lessonId") lessonId: string,
  ) {
    return this.progress.completeLesson(user.id, lessonId);
  }
}