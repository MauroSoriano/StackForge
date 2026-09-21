import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { CurriculumService } from "./curriculum.service.js";

@ApiTags("curriculum")
@Controller("curriculum")
export class CurriculumController {
  constructor(private readonly curriculum: CurriculumService) {}

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
