import { BadRequestException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { ProgressService } from "../src/progress/progress.service.js";
import type { PrismaService } from "../src/prisma/prisma.service.js";

function makeProgress() {
  const prisma = {
    $transaction: vi.fn(async (fn: (tx: unknown) => unknown) => fn(prisma)),
    track: { findMany: vi.fn() },
    module: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
    },
    userProgress: { findMany: vi.fn(), upsert: vi.fn() },
  } as unknown as PrismaService;
  const progress = new ProgressService(prisma);
  return { prisma, progress };
}

describe("ProgressService", () => {
  it("devuelve el progreso del usuario", async () => {
    const { prisma, progress } = makeProgress();
    prisma.track.findMany.mockResolvedValue([{ id: "t1", slug: "junior" }]);
    prisma.userProgress.findMany.mockResolvedValue([]);

    const out = await progress.getMyProgress("user-1");

    expect(out.tracks).toEqual([{ id: "t1", slug: "junior" }]);
    expect(out.progress).toEqual([]);
  });

  it("marca un módulo como IN_PROGRESS al empezarlo", async () => {
    const { prisma, progress } = makeProgress();
    prisma.module.findUnique.mockResolvedValue({ id: "m1", trackId: "t1", order: 1 });
    prisma.userProgress.upsert.mockResolvedValue({
      userId: "user-1",
      trackId: "t1",
      moduleId: "m1",
      state: "IN_PROGRESS",
      progress: 0,
    });

    const out = await progress.startModule("user-1", "t1", "m1");

    expect(out.state).toBe("IN_PROGRESS");
  });

  it("completa el módulo y desbloquea el siguiente", async () => {
    const { prisma, progress } = makeProgress();
    prisma.module.findUnique.mockResolvedValue({ id: "m1", trackId: "t1", order: 1 });
    prisma.module.findFirst.mockResolvedValue({ id: "m2" });
    prisma.userProgress.upsert.mockResolvedValue({
      userId: "user-1",
      trackId: "t1",
      moduleId: "m1",
      state: "COMPLETED",
      progress: 100,
    });

    const out = await progress.completeAndUnlock("user-1", "t1", "m1");

    expect(out.completed).toBe("m1");
    expect(out.unlocked).toBe("m2");
  });

  it("lanza 400 si el módulo no existe", async () => {
    const { prisma, progress } = makeProgress();
    prisma.module.findUnique.mockResolvedValue(null);

    await expect(
      progress.completeAndUnlock("user-1", "t1", "nope"),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("lanza 400 si el módulo no pertenece al track", async () => {
    const { prisma, progress } = makeProgress();
    prisma.module.findUnique.mockResolvedValue({ id: "m1", trackId: "otro", order: 1 });

    await expect(
      progress.completeAndUnlock("user-1", "t1", "m1"),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
