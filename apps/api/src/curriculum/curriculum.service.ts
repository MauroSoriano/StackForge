import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

/**
 * Lectura del currículum (fase 3): tracks, módulos, lecciones y ejercicios.
 * Rutas públicas de consulta (la ruta es visible antes de autenticar); el
 * desbloqueo por progreso llega en una fase posterior (UserProgress).
 */
@Injectable()
export class CurriculumService {
  constructor(private readonly prisma: PrismaService) {}

  listTracks() {
    return this.prisma.track.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        type: true,
        order: true,
        _count: { select: { modules: true } },
      },
      orderBy: { order: "asc" },
    });
  }

  /**
   * Syllabus completo del curso como texto plano navegable (fase 7). Devuelve
   * track → módulos → lecciones (markdown) → ejercicios, sin videos: todo el
   * curso está disponible para leer en la app.
   */
  getSyllabus() {
    return this.prisma.track.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        type: true,
        order: true,
        modules: {
          select: {
            id: true,
            slug: true,
            title: true,
            description: true,
            order: true,
            estimatedHours: true,
            lessons: {
              select: {
                id: true,
                slug: true,
                title: true,
                markdown: true,
                order: true,
                durationMinutes: true,
                exercises: {
                  select: {
                    id: true,
                    title: true,
                    instructions: true,
                    difficulty: true,
                    order: true,
                  },
                  orderBy: [{ order: "asc" }, { id: "asc" }],
                },
              },
              orderBy: [{ order: "asc" }, { id: "asc" }],
            },
          },
          orderBy: [{ order: "asc" }, { id: "asc" }],
        },
      },
    });
  }

  async getTrack(slug: string) {
    const track = await this.prisma.track.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        type: true,
        order: true,
        modules: {
          select: {
            id: true,
            slug: true,
            title: true,
            description: true,
            order: true,
            estimatedHours: true,
            lockedByDefault: true,
            _count: { select: { lessons: true } },
          },
          orderBy: { order: "asc" },
        },
      },
    });
    if (!track) {
      throw new NotFoundException(`No existe el track "${slug}"`);
    }
    return track;
  }

  async getLesson(lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        slug: true,
        title: true,
        markdown: true,
        order: true,
        durationMinutes: true,
        module: {
          select: { id: true, title: true, slug: true, track: { select: { slug: true, title: true } } },
        },
        exercises: {
          select: {
            id: true,
            title: true,
            description: true,
            instructions: true,
            order: true,
            difficulty: true,
            maxAttempts: true,
            _count: { select: { tests: true } },
          },
          orderBy: [{ order: "asc" }, { id: "asc" }],
        },
      },
    });
    if (!lesson) {
      throw new NotFoundException(`No existe la lección "${lessonId}"`);
    }
    return lesson;
  }
}