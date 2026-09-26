/**
 * ARCHIVO: curriculum.controller.ts
 * ---------------------------------
 * Capa HTTP (controlador) del dominio CURRÍCULUM. Expone rutas de solo
 * lectura para consultar el contenido del curso: tracks, módulos, lecciones y
 * ejercicios. No contiene lógica de negocio: traduce cada petición HTTP al
 * método correspondiente de CurriculumService.
 *
 * Todas las rutas cuelgan del prefijo "/curriculum" y son públicas de lectura
 * (no llevan guard de autenticación).
 */

import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { CurriculumService } from "./curriculum.service.js";

/**
 * Controlador REST del currículum.
 * Depende de CurriculumService, inyectado por NestJS vía constructor.
 */
@ApiTags("curriculum")
@Controller("curriculum")
export class CurriculumController {
  // Servicio de currículum; NestJS lo inyecta automáticamente.
  constructor(private readonly curriculum: CurriculumService) {}

  /**
   * GET /curriculum/syllabus
   * Devuelve TODO el curso en texto plano navegable para el entorno de
   * aprendizaje 100% texto (sin videos).
   * @returns Árbol de tracks → módulos → lecciones (markdown) → ejercicios.
   */
  @Get("syllabus")
  @ApiOperation({
    summary: "Syllabus completo del curso en texto",
    description:
      "Todo el curso navegable en texto plano (tracks → módulos → lecciones con markdown → ejercicios). Entorno de aprendizaje 100% texto, sin videos.",
  })
  getSyllabus() {
    return this.curriculum.getSyllabus();
  }

  /**
   * GET /curriculum/tracks
   * Lista los tracks con un resumen y el conteo de módulos.
   * @returns Array de tracks ordenados por `order`.
   */
  @Get("tracks")
  @ApiOperation({ summary: "Lista los tracks del currículum", description: "Acceso público lectura." })
  listTracks() {
    return this.curriculum.listTracks();
  }

  /**
   * GET /curriculum/tracks/:slug
   * Devuelve un track por su slug, con módulos, lecciones y ejercicios.
   * @param slug Identificador legible del track (p. ej. "jungla-junior").
   * @returns El track completo o 404 si no existe.
   */
  @Get("tracks/:slug")
  @ApiOperation({ summary: "Track con sus módulos" })
  @ApiParam({ name: "slug", description: "Slug del track", example: "jungla-junior" })
  getTrack(@Param("slug") slug: string) {
    return this.curriculum.getTrack(slug);
  }

  /**
   * GET /curriculum/lessons/:id
   * Devuelve el detalle de una lección y sus ejercicios.
   * @param id Identificador (cuid) de la lección.
   * @returns La lección con su módulo/track y sus ejercicios, o 404.
   */
  @Get("lessons/:id")
  @ApiOperation({ summary: "Lección con sus ejercicios", description: "Detalle de una lección." })
  @ApiParam({ name: "id", description: "Id (cuid) de la lección" })
  getLesson(@Param("id") id: string) {
    return this.curriculum.getLesson(id);
  }
}
