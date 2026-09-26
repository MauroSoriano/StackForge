/**
 * ARCHIVO: mentor.controller.ts
 * -----------------------------
 * Capa HTTP del dominio MENTOR (Fase 08). Expone rutas protegidas (JWT) para
 * lanzar una revisión del mentor sobre un envío ya evaluado y consultar su
 * historial de feedbacks. El prefijo incluye el submissionId en la ruta.
 */

// MentorController — Fase 08. Rutas protegidas (JWT) y propias del usuario.
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import type { AuthUser } from "../auth/interfaces/auth-user.interface.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { MentorService } from "./mentor.service.js";
import type { MentorMode } from "../generated/prisma/client.js";

/**
 * Controlador REST del mentor.
 * Todas las rutas cuelgan de "/submissions/:submissionId/mentor" y exigen JWT.
 */
@ApiTags("submissions")
@UseGuards(JwtAuthGuard)
@Controller("submissions/:submissionId/mentor")
export class MentorController {
  // Servicio del mentor; NestJS lo inyecta automáticamente.
  constructor(private readonly mentor: MentorService) {}

  /** Ejecuta el mentor ($0, gratuito) sobre un envio ya evaluado (fase 06). */
  @Post("review")
  review(
    @CurrentUser() user: AuthUser,
    @Param("submissionId") submissionId: string,
    @Body("mode") mode?: MentorMode,
  ) {
    // Si no se indica modo, se usa "REVIEW" por defecto.
    return this.mentor.review(submissionId, user.id, mode ?? "REVIEW");
  }

  /** Historial de feedbacks del mentor para un envio. */
  @Get()
  history(@CurrentUser() user: AuthUser, @Param("submissionId") submissionId: string) {
    return this.mentor.history(submissionId, user.id);
  }
}
