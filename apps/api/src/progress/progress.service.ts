import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ModuleState } from "../generated/prisma/client.ts";
import { PrismaService } from "../prisma/prisma.service.js";

/**
 * Fase 4 — Learning Engine.
 *
 * Progreso del usuario sobre el currículum (UserProgress) y desbloqueo por
 * secuencia: cada track tiene sus módulos ordenados; al completar el módulo
 * actual se desbloquea (AVAILABLE) el siguiente de la secuencia. Todo dentro
 * de una transacción para no romper el encadenamiento.
 */
@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  /** Estado del progreso del usuario consultado por userId. */
  async getMyProgress(userId: string) {
    const tracks = await this.prisma.track.findMany({
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
    const progress = await this.prisma.userProgress.findMany({
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
    });
    return { tracks, progress };
  }

  /** Valida la dependencia y devuelve los datos del módulo o 404/400. */
  private async assertModule(trackId: string, moduleId: string) {
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
      select: { id: true, trackId: true, order: true, slug: true },
    });
    if (!module) {
      throw new NotFoundException(`No existe el módulo "${moduleId}"`);
    }
    if (module.trackId !== trackId) {
      throw new BadRequestException(
        `El módulo "${moduleId}" no pertenece al track "${trackId}"`,
      );
    }
    return module;
  }

  /** Marca un módulo como empezado cuando su anterior está completado. */
  async startModule(userId: string, trackId: string, moduleId: string) {
    await this.assertModule(trackId, moduleId);
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

  /** Completa el módulo y desbloquea el siguiente de la secuencia. */
  async completeAndUnlock(userId: string, trackId: string, moduleId: string) {
    return this.prisma.$transaction(async (tx) => {
      const module = await tx.module.findUnique({
        where: { id: moduleId },
        select: { id: true, trackId: true, order: true },
      });
      if (!module || module.trackId !== trackId) {
        throw new BadRequestException(
          `El módulo "${moduleId}" no es válido para el track "${trackId}"`,
        );
      }

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

      const next = await tx.module.findFirst({
        where: { trackId, order: { gt: module.order } },
        select: { id: true },
        orderBy: { order: "asc" },
      });
      if (next) {
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

      return { completed: done.moduleId, unlocked: next?.id ?? null };
    });
  }
}
