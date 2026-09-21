import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ExercisesService } from "./exercises.service.js";

@ApiTags("exercises")
@Controller("exercises")
export class ExercisesController {
  constructor(private readonly exercises: ExercisesService) {}

  @Get("lesson/:lessonId")
  @ApiOperation({ summary: "Ejercicios de una lección" })
  @ApiParam({ name: "lessonId", description: "Id (cuid) de la lección" })
  listForLesson(@Param("lessonId") lessonId: string) {
    return this.exercises.listForLesson(lessonId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Detalle de un ejercicio con requisitos y tests" })
  @ApiParam({ name: "id", description: "Id (cuid) del ejercicio" })
  getExercise(@Param("id") id: string) {
    return this.exercises.getExercise(id);
  }
}
