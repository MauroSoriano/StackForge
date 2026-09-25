import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class ExercisesService {
  constructor(private readonly prisma: PrismaService) {}

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
