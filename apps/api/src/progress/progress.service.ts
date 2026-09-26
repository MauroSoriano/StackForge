/**
 * ARCHIVO: progress.service.ts
 * ----------------------------
 * Learning Engine (fase 4 + clases). Gestiona el progreso del usuario:
 *  - UserProgress a nivel de modulo, con desbloqueo secuencial.
 *  - LessonProgress a nivel de clase, que recalcula el avance del modulo.
 * Usa transacciones de Prisma para mantener consistente el encadenamiento.
 */

import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ModuleState } from "../generated/prisma/client.ts";
import { PrismaService } from "../prisma/prisma.service.js";

/**
 * Fase 4 �?" Learning Engine.
 *
 * Progreso del usuario sobre el curr��culum (UserProgress) y desbloqueo por
 * secuencia: cada track tiene sus m��dulos ordenados; al completar el m��dulo
 * actual se desbloquea (AVAILABLE) el siguiente de la secuencia. Todo dentro
 * de una transacci��n para no romper el encadenamiento.
 *
 * Desde la fase de entrega: progreso a nivel de clase (LessonProgress). Cada
 * clase que el estudiante abre se marca como empeziada; al terminarla se marca
 * completada y el m��dulo (secci��n) repite el encadenamiento.
 */
@Injectable()
export class ProgressService {
  // Cliente Prisma inyectado; se usa para todas las consultas y transacciones.
  constructor(private readonly prisma: PrismaService) {}

  /** Estado del progreso del usuario consultado por userId. */
  async getMyProgress(userId: string) {
    // Se lanzan en paralelo tres consultas: catalogo de tracks con su jerarquia,
    // progreso por modulo y progreso por clase del usuario.
    const [tracks, progress, lessonProgress] = await Promise.all([
      this.prisma.track.findMany({
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
              order: true,
              lessons: {
                select: { id: true, title: true, order: true },
                orderBy: { order: "asc" },
              },
            },
            orderBy: { order: "asc" },
          },
          _count: { select: { modules: true } },
        },
        orderBy: { order: "asc" },
      }),
      this.prisma.userProgress.findMany({
        where: { userId },
        select: {
          id: true,
          userId: true,
          trackId: true,
          moduleId: true,
          state: true,
          progress: true,
          completedAt: true,
        },
      }),
      this.prisma.lessonProgress.findMany({
        where: { userId },
        select: {
          id: true,
          lessonId: true,
          startedAt: true,
          completedAt: true,
        },
      }),
    ]);
    // Se devuelve el catalogo junto con ambos mapas de progreso.
    return { tracks, progress, lessonProgress };
  }

  /** Valida la dependencia y devuelve los datos del m��dulo o 404/400. */
  private async assertModule(trackId: string, moduleId: string) {
    // Busca el modulo por id para comprobar su existencia y a que track pertenece.
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
      select: { id: true, trackId: true, order: true, slug: true },
    });
    if (!module) {
      throw new NotFoundException(`No existe el m��dulo "${moduleId}"`);
    }
    // Si el modulo no pertenece al track indicado, la peticion es invalida (400).
    if (module.trackId !== trackId) {
      throw new BadRequestException(
        `El m��dulo "${moduleId}" no pertenece al track "${trackId}"`,
      );
    }
    return module;
  }

  /** Marca un m��dulo como empezado cuando su anterior estǭ completado. */
  async startModule(userId: string, trackId: string, moduleId: string) {
    // Valida que el modulo exista y pertenezca al track.
    await this.assertModule(trackId, moduleId);
    // Upsert idempotente: crea el progreso o lo pasa a IN_PROGRESS.
    return this.prisma.userProgress.upsert({
      where: {
        userId_trackId_moduleId: { userId, trackId, moduleId },
      },
      update: { state: ModuleState.IN_PROGRESS, progress: 0 },
      create: {
        userId,
        trackId,
        moduleId,
        state: ModuleState.IN_PROGRESS,
        progress: 0,
      },
    });
  }

  /** Completa el m��dulo y desbloquea el siguiente de la secuencia. */
  async completeAndUnlock(userId: string, trackId: string, moduleId: string) {
    // Todo ocurre en una transaccion: marcar completado y desbloquear el siguiente.
    return this.prisma.$transaction(async (tx) => {
      const module = await tx.module.findUnique({
        where: { id: moduleId },
        select: { id: true, trackId: true, order: true },
      });
      if (!module || module.trackId !== trackId) {
        throw new BadRequestException(
          `El m��dulo "${moduleId}" no es vǭlido para el track "${trackId}"`,
        );
      }

      // Marca el modulo actual como COMPLETED al 100%.
      const done = await tx.userProgress.upsert({
        where: {
          userId_trackId_moduleId: { userId, trackId, moduleId },
        },
        update: { state: ModuleState.COMPLETED, progress: 100, completedAt: new Date() },
        create: {
          userId,
          trackId,
          moduleId,
          state: ModuleState.COMPLETED,
          progress: 100,
          completedAt: new Date(),
        },
      });

      // Busca el siguiente modulo del track por orden.
      const next = await tx.module.findFirst({
        where: { trackId, order: { gt: module.order } },
        select: { id: true },
        orderBy: { order: "asc" },
      });
      if (next) {
        // Deja el siguiente modulo disponible (AVAILABLE) al 0%.
        await tx.userProgress.upsert({
          where: {
            userId_trackId_moduleId: { userId, trackId, moduleId: next.id },
          },
          update: { state: ModuleState.AVAILABLE, progress: 0 },
          create: {
            userId,
            trackId,
            moduleId: next.id,
            state: ModuleState.AVAILABLE,
            progress: 0,
          },
        });
      }

      // Devuelve el modulo completado y el recien desbloqueado (o null).
      return { completed: done.moduleId, unlocked: next?.id ?? null };
    });
  }

  /** Valida que la clase exista y devuelve el m��dulo al que atiende. */
  private async assertLesson(lessonId: string) {
    // Busca la clase y su modulo; devuelve ambos datos basicos.
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true, moduleId: true },
    });
    if (!lesson) {
      throw new NotFoundException(`No existe la clase "${lessonId}"`);
    }
    return lesson;
  }

  /** Marca una clase como empezada (sin forzar orden de secciones). */
  async startLesson(userId: string, lessonId: string) {
    // Valida que la clase exista.
    await this.assertLesson(lessonId);
    // Upsert idempotente: crea el avance o lo reabre (completedAt = null).
    return this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { completedAt: null },
      create: {
        userId,
        lessonId,
        startedAt: new Date(),
      },
    });
  }

  /** Marca la clase completada y actualiza el progreso de su secci��n. */
  async completeLesson(userId: string, lessonId: string) {
    // Transaccion: marcar clase, recalcular modulo y desbloquear el siguiente.
    return this.prisma.$transaction(async (tx) => {
      // Carga la clase, su modulo y la lista de clases del modulo.
      const lesson = await tx.lesson.findUnique({
        where: { id: lessonId },
        select: {
          id: true,
          moduleId: true,
          module: {
            select: {
              trackId: true,
              lessons: { select: { id: true } },
            },
          },
        },
      });
      if (!lesson) {
        throw new NotFoundException(`No existe la clase "${lessonId}"`);
      }

      // Marca la clase como completada (completedAt con fecha actual).
      const done = await tx.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId } },
        update: { completedAt: new Date() },
        create: {
          userId,
          lessonId,
          startedAt: new Date(),
          completedAt: new Date(),
        },
      });

      // Cuenta cuantas clases del modulo ha completado el usuario.
      const completedCount = await tx.lessonProgress.count({
        where: {
          userId,
          completedAt: { not: null },
          lesson: { moduleId: lesson.moduleId },
        },
      });
      // Total de clases del modulo y porcentaje redondeado.
      const total = lesson.module.lessons.length;
      const progressPct = total === 0 ? 100 : Math.round((completedCount / total) * 100);

      // El modulo se marca COMPLETED solo si el 100% de sus clases lo esta.
      const moduleState = progressPct >= 100 ? ModuleState.COMPLETED : ModuleState.IN_PROGRESS;
      await tx.userProgress.upsert({
        where: {
          userId_trackId_moduleId: {
            userId,
            trackId: lesson.module.trackId,
            moduleId: lesson.moduleId,
          },
        },
        update: { state: moduleState, progress: progressPct, completedAt: moduleState === ModuleState.COMPLETED ? new Date() : null },
        create: {
          userId,
          trackId: lesson.module.trackId,
          moduleId: lesson.moduleId,
          state: moduleState,
          progress: progressPct,
          completedAt: moduleState === ModuleState.COMPLETED ? new Date() : null,
        },
      });

      if (moduleState === ModuleState.COMPLETED) {
        // Si se completo el modulo, se busca el siguiente para desbloquearlo.
        const mod = await tx.module.findUnique({
          where: { id: lesson.moduleId },
          select: { order: true, trackId: true },
        });
        if (mod) {
          // Siguiente modulo del track por orden.
          const next = await tx.module.findFirst({
            where: { trackId: mod.trackId, order: { gt: mod.order } },
            select: { id: true },
            orderBy: { order: "asc" },
          });
          if (next) {
            // Evita pisar un modulo que el usuario ya completo.
            const pending = await tx.userProgress.findUnique({
              where: {
                userId_trackId_moduleId: { userId, trackId: mod.trackId, moduleId: next.id },
              },
              select: { state: true, progress: true },
            });
            if (!pending || pending.state !== ModuleState.COMPLETED) {
              // Lo deja disponible conservando su progreso previo si existia.
              await tx.userProgress.upsert({
                where: {
                  userId_trackId_moduleId: { userId, trackId: mod.trackId, moduleId: next.id },
                },
                update: { state: ModuleState.AVAILABLE, progress: pending?.progress ?? 0 },
                create: {
                  userId,
                  trackId: mod.trackId,
                  moduleId: next.id,
                  state: ModuleState.AVAILABLE,
                  progress: 0,
                },
              });
            }
          }
        }
      }

      // Devuelve la clase completada, su modulo y el porcentaje alcanzado.
      return { completed: done.lessonId, moduleId: lesson.moduleId, progress: progressPct };
    });
  }
}