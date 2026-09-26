/**
 * ARCHIVO: exercises.controller.ts
 * ---------------------------------
 * Capa HTTP del dominio EJERCICIOS. Expone la consulta de ejercicios de una
 * lección y el detalle de un ejercicio (con requisitos y tests). Solo lectura.
 */

import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ExercisesService } from "./exercises.service.js";

/**
 * Controlador REST de ejercicios.
 * Depende de ExercisesService, inyectado por NestJS vía constructor.
 */
@ApiTags("exercises")
@Controller("exercises")
export class ExercisesController {
  // Servicio de ejercicios; NestJS lo inyecta automáticamente.
  constructor(private readonly exercises: ExercisesService) {}

  /**
   * GET /exercises/lesson/:lessonId
   * Lista los ejercicios de una lección concreta.
   * @param lessonId Id (cuid) de la lección.
   * @returns Ejercicios de la lección o 404 si la lección no existe.
   */
  @Get("lesson/:lessonId")
  @ApiOperation({ summary: "Ejercicios de una lección" })
  @ApiParam({ name: "lessonId", description: "Id (cuid) de la lección" })
  listForLesson(@Param("lessonId") lessonId: string) {
    return this.exercises.listForLesson(lessonId);
  }

  /**
   * GET /exercises/:id
   * Devuelve el detalle de un ejercicio: requisitos, tests y ubicación.
   * @param id Id (cuid) del ejercicio.
   * @returns El ejercicio completo o 404 si no existe.
   */
  @Get(":id")
  @ApiOperation({ summary: "Detalle de un ejercicio con requisitos y tests" })
  @ApiParam({ name: "id", description: "Id (cuid) del ejercicio" })
  getExercise(@Param("id") id: string) {
    return this.exercises.getExercise(id);
  }
}
