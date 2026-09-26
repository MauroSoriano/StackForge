/**
 * ARCHIVO: submissions.controller.ts
 * ----------------------------------
 * Capa HTTP del dominio ENTREGAS (submissions). Gestiona:
 *  - Subida de archivos de actividad (multipart "file") para un ejercicio.
 *  - Consulta de entregas propias y por ejercicio.
 *  - Reemplazo y eliminación de una entrega propia.
 *  - Envío de código (JSON) y evaluación en sandbox.
 * Todas las rutas están protegidas con JwtAuthGuard y operan sobre el usuario
 * autenticado (CurrentUser).
 */

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { memoryStorage } from "multer";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import type { AuthUser } from "../auth/interfaces/auth-user.interface.js";
import {
  SubmissionsService,
  type UploadedActivityFile,
} from "./submissions.service.js";
import type { SandboxFile } from "./sandbox/sandbox-runner.interface.js";

/** Cuerpo para enviar código de un proyecto: id del proyecto y sus archivos. */
interface SubmitSubmissionDto {
  projectId: string;
  files: SandboxFile[];
}

/** Cuerpo opcional para evaluar: comando de shell a ejecutar (por defecto "node --test"). */
interface EvaluateSubmissionDto {
  command?: string;
}

/**
 * Controlador REST de entregas.
 * Depende de SubmissionsService, inyectado por NestJS vía constructor.
 */
@ApiTags("submissions")
@UseGuards(JwtAuthGuard)
@Controller("submissions")
export class SubmissionsController {
  // Servicio de entregas; NestJS lo inyecta automáticamente.
  constructor(private readonly submissions: SubmissionsService) {}

  /**
   * GET /submissions/mine
   * Lista todas las entregas del usuario autenticado.
   */
  @Get("mine")
  getMine(@CurrentUser() user: AuthUser) {
    return this.submissions.getMySubmissions(user.id);
  }

  /**
   * POST /submissions/exercises/:exerciseId
   * Sube un archivo de actividad para un ejercicio. El archivo viaja en
   * memoria (memoryStorage) y multer aplica un límite duro de 32 MB; la
   * validación real de extensión/tamaño la hace el servicio.
   */
  @Post("exercises/:exerciseId")
  @UseInterceptors(
    FileInterceptor("file", {
      // Guarda el archivo en un buffer en memoria (no en disco todavía).
      storage: memoryStorage(),
      // Límite duro de 32 MB impuesto por multer.
      limits: { fileSize: 32 * 1024 * 1024 },
    }),
  )
  uploadForExercise(
    @CurrentUser() user: AuthUser,
    @Param("exerciseId") exerciseId: string,
    @UploadedFile() file: UploadedActivityFile | undefined,
  ) {
    // Si multer no recibió archivo en el campo "file", se rechaza la petición.
    if (!file) {
      throw new BadRequestException("Envía el archivo en el campo \"file\".");
    }
    return this.submissions.uploadForExercise(user.id, exerciseId, file);
  }

  /**
   * GET /submissions/exercises/:exerciseId
   * Lista las entregas del usuario autenticado para un ejercicio.
   */
  @Get("exercises/:exerciseId")
  getForExercise(
    @CurrentUser() user: AuthUser,
    @Param("exerciseId") exerciseId: string,
  ) {
    return this.submissions.getMyExerciseSubmissions(user.id, exerciseId);
  }

  /**
   * PUT /submissions/:id/file
   * Reemplaza el archivo de una entrega propia (conserva el mismo intento).
   */
  @Put(":id/file")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: 32 * 1024 * 1024 },
    }),
  )
  replaceForExercise(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @UploadedFile() file: UploadedActivityFile | undefined,
  ) {
    if (!file) {
      throw new BadRequestException("Envía el archivo en el campo \"file\".");
    }
    return this.submissions.replaceExerciseSubmission(user.id, id, file);
  }

  /**
   * DELETE /submissions/:id
   * Elimina una entrega propia y su archivo en disco.
   */
  @Delete(":id")
  removeForExercise(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.submissions.deleteExerciseSubmission(user.id, id);
  }

  /**
   * POST /submissions
   * Envía código de un proyecto (JSON) y crea una Submission.
   */
  @Post()
  submit(@CurrentUser() user: AuthUser, @Body() dto: SubmitSubmissionDto) {
    return this.submissions.submit(user.id, dto.projectId, dto.files);
  }

  /**
   * POST /submissions/:id/evaluate
   * Ejecuta el comando (por defecto "node --test") en el sandbox y guarda el
   * resultado real (exitCode, stdout, stderr, timeout).
   */
  @Post(":id/evaluate")
  evaluate(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: EvaluateSubmissionDto) {
    return this.submissions.evaluate(id, dto.command);
  }
}