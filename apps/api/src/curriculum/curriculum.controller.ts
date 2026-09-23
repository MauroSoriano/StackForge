import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { CurriculumService } from "./curriculum.service.js";

@ApiTags("curriculum")
@Controller("curriculum")
export class CurriculumController {
  constructor(private readonly curriculum: CurriculumService) {}

  @Get("syllabus")
  @ApiOperation({
    summary: "Syllabus completo del curso en texto",
    description:
      "Todo el curso navegable en texto plano (tracks → módulos → lecciones con markdown → ejercicios). Entorno de aprendizaje 100% texto, sin videos.",
  })
  getSyllabus() {
    return this.curriculum.getSyllabus();
  }

  @Get("tracks")
  @ApiOperation({ summary: "Lista los tracks del currículum", description: "Acceso público lectura." })
  listTracks() {
    return this.curriculum.listTracks();
  }

  @Get("tracks/:slug")
  @ApiOperation({ summary: "Track con sus módulos" })
  @ApiParam({ name: "slug", description: "Slug del track", example: "jungla-junior" })
  getTrack(@Param("slug") slug: string) {
    return this.curriculum.getTrack(slug);
  }

  @Get("lessons/:id")
  @ApiOperation({ summary: "Lección con sus ejercicios", description: "Detalle de una lección." })
  @ApiParam({ name: "id", description: "Id (cuid) de la lección" })
  getLesson(@Param("id") id: string) {
    return this.curriculum.getLesson(id);
  }
}
