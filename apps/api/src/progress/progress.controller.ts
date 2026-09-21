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
  @ApiOperation({ summary: "Mi progreso en el currículum" })
  getMyProgress(@CurrentUser() user: AuthUser) {
    return this.progress.getMyProgress(user.id);
  }

  @Post("tracks/:trackId/modules/:moduleId/start")
  @ApiOperation({ summary: "Empezar un módulo de la secuencia" })
  @ApiParam({ name: "trackId", description: "Id (cuid) del track" })
  @ApiParam({ name: "moduleId", description: "Id (cuid) del módulo" })
  startModule(
    @CurrentUser() user: AuthUser,
    @Param("trackId") trackId: string,
    @Param("moduleId") moduleId: string,
  ) {
    return this.progress.startModule(user.id, trackId, moduleId);
  }

  @Post("tracks/:trackId/modules/:moduleId/complete")
  @ApiOperation({ summary: "Completar un módulo y desbloquear el siguiente" })
  @ApiParam({ name: "trackId", description: "Id (cuid) del track" })
  @ApiParam({ name: "moduleId", description: "Id (cuid) del módulo" })
  complete(
    @CurrentUser() user: AuthUser,
    @Param("trackId") trackId: string,
    @Param("moduleId") moduleId: string,
  ) {
    return this.progress.completeAndUnlock(user.id, trackId, moduleId);
  }
}
