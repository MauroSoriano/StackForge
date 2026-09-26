/**
 * ARCHIVO: exercises.service.ts
 * -----------------------------
 * Capa de acceso a datos del dominio EJERCICIOS. Lee ejercicios de una lección
 * y el detalle de un ejercicio (requisitos + tests). Solo lectura.
 */

import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

/**
 * Servicio de consulta de ejercicios.
 */
@Injectable()
export class ExercisesService {
  // Cliente Prisma inyectado; se usa para todas las consultas a la base de datos.
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lista los ejercicios de una lección.
   * Primero valida que la lección exista (404 si no) y luego consulta.
   * @param lessonId Id (cuid) de la lección.
   * @returns Ejercicios ordenados por `order` y, como desempate, por `id`.
   */
  async listForLesson(lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true },
    });
    if (!lesson) {
      throw new NotFoundException(`No existe la lección "${lessonId}"`);
    }
    return this.prisma.exercise.findMany({
      where: { lessonId },
      select: {
        id: true,
        title: true,
        description: true,
        order: true,
        difficulty: true,
        maxAttempts: true,
        _count: { select: { tests: true } },
      },
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
  }

  /**
   * Obtiene el detalle de un ejercicio con su ubicación (lección/módulo/track),
   * sus requisitos y sus tests.
   * @param id Id (cuid) del ejercicio.
   * @returns El ejercicio completo.
   * @throws NotFoundException si el ejercicio no existe.
   */
  async getExercise(id: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        instructions: true,
        order: true,
        difficulty: true,
        maxAttempts: true,
        lesson: {
          select: {
            id: true,
            slug: true,
            title: true,
            module: {
              select: {
                id: true,
                slug: true,
                title: true,
                track: { select: { slug: true, title: true } },
              },
            },
          },
        },
        requirements: { orderBy: [{ order: "asc" }, { id: "asc" }] },
        tests: { orderBy: [{ order: "asc" }, { id: "asc" }] },
      },
    });
    if (!exercise) {
      throw new NotFoundException(`No existe el ejercicio "${id}"`);
    }
    return exercise;
  }
}
