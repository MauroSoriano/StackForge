import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { Inject } from "@nestjs/common";
import { SANDBOX_RUNNER } from "./sandbox/sandbox-runner.interface.js";

import type {
  SandboxFile,
  SandboxRunner,
  SandboxRunResult,
} from "./sandbox/sandbox-runner.interface.js";

import { PrismaService } from "../prisma/prisma.service.js";
import { SubmissionStatus } from "../generated/prisma/client.js";

const EVAL_TIMEOUT_MS = 30_000;
const EVAL_COMMAND = "node --test";

/** Extensiones admitidas para la entrega de actividades (documentos y comprimidos). */
const ALLOWED_EXERCISE_EXTENSIONS = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".txt",
  ".md",
  ".zip",
  ".rar",
  ".7z",
  ".tar",
  ".gz",
  ".tgz",
]);

/** Tamaño máximo de un archivo de actividad. */
const MAX_EXERCISE_FILE_BYTES = 25 * 1024 * 1024;

export interface UploadedActivityFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class SubmissionsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SANDBOX_RUNNER) private readonly runner: SandboxRunner,
  ) {}

  async getMySubmissions(userId: string) {
    return this.prisma.submission.findMany({
      where: { userId },
      select: {
        id: true,
        projectId: true,
        exerciseId: true,
        attemptNumber: true,
        status: true,
        result: true,
        submittedAt: true,
      },
      orderBy: { submittedAt: "desc" },
    });
  }

  async submit(userId: string, projectId: string, files: SandboxFile[]) {
    const attemptNumber =
      (await this.prisma.submission.count({ where: { userId, projectId } })) +
      1;

    return this.prisma.submission.create({
      data: {
        userId,
        projectId,
        attemptNumber,
        status: SubmissionStatus.RECEIVED,
        files: {
          create: files.map((f) => ({ path: f.path, content: f.content })),
        },
        submittedAt: new Date(),
      },
      select: {
        id: true,
        projectId: true,
        attemptNumber: true,
        status: true,
        submittedAt: true,
      },
    });
  }

  /** Directorio donde se guardan los archivos entregados de actividades. */
  private async exerciseUploadDir(): Promise<string> {
    const root = process.env.UPLOAD_DIR
      ? path.resolve(process.env.UPLOAD_DIR)
      : path.join(process.cwd(), "uploads");
    const dir = path.join(root, "activities");
    await fs.promises.mkdir(dir, { recursive: true });
    return dir;
  }

  /** Valida el archivo de una actividad (tamaño y extensión). */
  private assertValidActivityFile(file: UploadedActivityFile) {
    if (!file || !file.buffer || file.size === 0) {
      throw new BadRequestException("No se recibió ningún archivo para entregar.");
    }
    if (file.size > MAX_EXERCISE_FILE_BYTES) {
      throw new BadRequestException(
        `El archivo supera el tamaño máximo de ${MAX_EXERCISE_FILE_BYTES / (1024 * 1024)} MB.`,
      );
    }
    const extension = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXERCISE_EXTENSIONS.has(extension)) {
      throw new BadRequestException(
        `Extensión "${extension || "(sin extensión)"}" no permitida. Usa un documento (PDF, DOC, DOCX, TXT, MD) o un comprimido (ZIP, RAR, 7Z, TAR, GZ).`,
      );
    }
  }

  /** Escribe el archivo de una entrega en disco y devuelve ruta y hash. */
  private async storeActivityFile(
    submissionId: string,
    file: UploadedActivityFile,
  ): Promise<{ stored: string; sha256: string }> {
    const sha256 = createHash("sha256").update(file.buffer).digest("hex");
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const stored = path.join(
      await this.exerciseUploadDir(),
      `${submissionId}-${safeName}`,
    );
    await fs.promises.writeFile(stored, file.buffer);
    return { stored, sha256 };
  }

  /** Borra del disco el archivo de una entrega (ignora si ya no existe). */
  private async removeStoredFile(archiveKey: string | null) {
    if (!archiveKey) return;
    try {
      await fs.promises.unlink(archiveKey);
    } catch {
      // El archivo ya no existe: no es un error.
    }
  }

  /**
   * Guarda la entrega de una actividad (ejercicio): sube el archivo a disco y
   * registra la Submission junto a su SubmissionFile. La revisión por IA llega
   * en una fase posterior; por ahora queda en estado RECEIVED.
   */
  async uploadForExercise(userId: string, exerciseId: string, file: UploadedActivityFile) {
    this.assertValidActivityFile(file);

    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
      select: { id: true },
    });
    if (!exercise) {
      throw new NotFoundException(`No existe la actividad "${exerciseId}"`);
    }

    const attemptNumber =
      (await this.prisma.submission.count({ where: { userId, exerciseId } })) +
      1;

    const sha256 = createHash("sha256").update(file.buffer).digest("hex");
    const submission = await this.prisma.submission.create({
      data: {
        userId,
        exerciseId,
        attemptNumber,
        status: SubmissionStatus.RECEIVED,
        archiveSizeBytes: file.size,
        fileCount: 1,
        files: {
          create: [
            {
              path: file.originalname,
              sizeBytes: file.size,
              sha256,
            },
          ],
        },
        submittedAt: new Date(),
      },
      select: {
        id: true,
        exerciseId: true,
        attemptNumber: true,
        status: true,
        archiveSizeBytes: true,
        fileCount: true,
        submittedAt: true,
      },
    });

    const { stored } = await this.storeActivityFile(submission.id, file);
    await this.prisma.submission.update({
      where: { id: submission.id },
      data: { archiveKey: stored },
    });

    return submission;
  }

  /** Reemplaza el archivo de una entrega propia (mantiene el intento). */
  async replaceExerciseSubmission(
    userId: string,
    submissionId: string,
    file: UploadedActivityFile,
  ) {
    this.assertValidActivityFile(file);

    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      select: { id: true, userId: true, exerciseId: true, archiveKey: true },
    });
    if (!submission || !submission.exerciseId) {
      throw new NotFoundException(`No existe la entrega de actividad "${submissionId}"`);
    }
    if (submission.userId !== userId) {
      throw new ForbiddenException("Esta entrega no te pertenece.");
    }

    await this.removeStoredFile(submission.archiveKey);
    const { stored, sha256 } = await this.storeActivityFile(submission.id, file);

    return this.prisma.$transaction(async (tx) => {
      await tx.submissionFile.deleteMany({ where: { submissionId: submission.id } });
      await tx.submissionFile.create({
        data: {
          submissionId: submission.id,
          path: file.originalname,
          sizeBytes: file.size,
          sha256,
        },
      });
      return tx.submission.update({
        where: { id: submission.id },
        data: {
          archiveKey: stored,
          archiveSizeBytes: file.size,
          fileCount: 1,
          status: SubmissionStatus.RECEIVED,
          submittedAt: new Date(),
        },
        select: {
          id: true,
          attemptNumber: true,
          status: true,
          archiveSizeBytes: true,
          fileCount: true,
          submittedAt: true,
        },
      });
    });
  }

  /** Elimina una entrega propia y su archivo. */
  async deleteExerciseSubmission(userId: string, submissionId: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      select: { id: true, userId: true, exerciseId: true, archiveKey: true },
    });
    if (!submission || !submission.exerciseId) {
      throw new NotFoundException(`No existe la entrega de actividad "${submissionId}"`);
    }
    if (submission.userId !== userId) {
      throw new ForbiddenException("Esta entrega no te pertenece.");
    }

    await this.removeStoredFile(submission.archiveKey);
    await this.prisma.submission.delete({ where: { id: submission.id } });
  }

  /** Entregas de una actividad hechas por el usuario (sin la revisión IA). */
  getMyExerciseSubmissions(userId: string, exerciseId: string) {
    return this.prisma.submission.findMany({
      where: { userId, exerciseId },
      select: {
        id: true,
        attemptNumber: true,
        status: true,
        archiveSizeBytes: true,
        fileCount: true,
        submittedAt: true,
        files: { select: { path: true, sizeBytes: true } },
      },
      orderBy: { submittedAt: "desc" },
    });
  }

  async evaluate(id: string, command: string = EVAL_COMMAND) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: {
        files: { select: { path: true, content: true } },
      },
    });
    if (!submission) {
      throw new NotFoundException(`No existe el envío "${id}"`);
    }

    const run: SandboxRunResult = await this.runner.run(
      submission.files.map((f) => ({ path: f.path, content: f.content })),
      command,
      EVAL_TIMEOUT_MS,
    );

    const status =
      run.exitCode === 0 && !run.timedOut
        ? SubmissionStatus.PASSED
        : run.exitCode === 0
          ? SubmissionStatus.PARTIAL
          : SubmissionStatus.NEEDS_WORK;

    return this.prisma.submission.update({
      where: { id },
      data: {
        status,
        result: {
          exitCode: run.exitCode,
          timedOut: run.timedOut,
          usedMs: run.usedMs,
          stdout: run.stdout.slice(0, 64 * 1024),
          stderr: run.stderr.slice(0, 64 * 1024),
        },
        processedAt: new Date(),
      },
      select: { id: true, status: true, result: true },
    });
  }
}
