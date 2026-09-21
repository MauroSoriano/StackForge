import { NotFoundException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { CurriculumService } from "../src/curriculum/curriculum.service.js";
import type { PrismaService } from "../src/prisma/prisma.service.js";

type CurriculumPrismaMock = {
  track: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
  };
  lesson: {
    findUnique: ReturnType<typeof vi.fn>;
  };
};

function makeCurriculum() {
  const prisma: CurriculumPrismaMock = {
    track: { findMany: vi.fn(), findUnique: vi.fn() },
    lesson: { findUnique: vi.fn() },
  };
  const curriculum = new CurriculumService(prisma as unknown as PrismaService);
  return { prisma, curriculum };
}

describe("CurriculumService", () => {
  it("lista los tracks visibles del currículum", async () => {
    const { prisma, curriculum } = makeCurriculum();
    prisma.track.findMany.mockResolvedValue([{ id: "track-1" }]);

    const tracks = await curriculum.listTracks();

    expect(prisma.track.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { order: "asc" } }),
    );
    expect(tracks).toHaveLength(1);
  });

  it("devuelve un track con sus módulos por slug", async () => {
    const { prisma, curriculum } = makeCurriculum();
    const track = { id: "track-1", slug: "jungla-junior", modules: [] };
    prisma.track.findUnique.mockResolvedValue(track);

    await expect(curriculum.getTrack("jungla-junior")).resolves.toBe(track);
  });

  it("lanza 404 si el track no existe", async () => {
    const { prisma, curriculum } = makeCurriculum();
    prisma.track.findUnique.mockResolvedValue(null);

    await expect(curriculum.getTrack("no-existe")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("lanza 404 si la lección no existe", async () => {
    const { prisma, curriculum } = makeCurriculum();
    prisma.lesson.findUnique.mockResolvedValue(null);

    await expect(curriculum.getLesson("no-existe")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
