import { Controller, Get, Post, Param, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import type { AuthUser } from "../auth/interfaces/auth-user.interface.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { ProgressService } from "./progress.service.js";

@ApiTags("progress")
@UseGuards(JwtAuthGuard)
@Controller("progress")
export class ProgressController {
  constructor(private readonly progress: ProgressService) {}

  @Get()
  @ApiOperation({ summary: "Mi progreso en el curr��culum" })
  getMyProgress(@CurrentUser() user: AuthUser) {
    return this.progress.getMyProgress(user.id);
  }

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

  @Post("lessons/:lessonId/start")
  @ApiOperation({ summary: "Empezar una clase (registra el avance)" })
  @ApiParam({ name: "lessonId", description: "Id (cuid) de la clase" })
  startLesson(
    @CurrentUser() user: AuthUser,
    @Param("lessonId") lessonId: string,
  ) {
    return this.progress.startLesson(user.id, lessonId);
  }

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