/**
 * ARCHIVO: submissions.service.ts
 * -------------------------------
 * Lógica de negocio del dominio ENTREGAS. Cubre dos flujos:
 *  1) Actividades (ejercicios): subida, reemplazo y eliminación de un archivo
 *     con validación de extensión/tamaño, guardado en disco y hash SHA-256.
 *  2) Código de proyecto: envío y evaluación dentro de un sandbox Docker.
 * No conoce HTTP: recibe datos y usa PrismaService (BD) y SandboxRunner (Docker).
 */

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

// Tiempo máximo de ejecución del sandbox para una evaluación (30 s).
const EVAL_TIMEOUT_MS = 30_000;
// Comando por defecto que corre el sandbox (runner de tests de Node).
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
// Tamaño máximo permitido del archivo de actividad (25 MB).
const MAX_EXERCISE_FILE_BYTES = 25 * 1024 * 1024;

/**
 * Forma del archivo recibido por multer en memoria para una actividad.
 * - originalname: nombre original del archivo (para extensión y guardado).
 * - mimetype: tipo MIME declarado por el cliente.
 * - size: tamaño en bytes.
 * - buffer: contenido binario en memoria (aún no escrito en disco).
 */
export interface UploadedActivityFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

/**
 * Servicio de entregas: persiste submissions y ejecuta código en el sandbox.
 */
@Injectable()
export class SubmissionsService {
  constructor(
    // Cliente Prisma para persistir submissions y sus archivos.
    private readonly prisma: PrismaService,
    // Runner del sandbox inyectado por el token SANDBOX_RUNNER (Docker).
    @Inject(SANDBOX_RUNNER) private readonly runner: SandboxRunner,
  ) {}

  /**
   * Lista todas las entregas del usuario (resumen), ordenadas por fecha desc.
   * @param userId Id del usuario dueño de las entregas.
   */
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

  /**
   * Crea una entrega de código de proyecto (Submission) con sus archivos.
   * El número de intento se calcula contando las entregas previas del usuario.
   * @param userId Id del usuario.
   * @param projectId Id del proyecto.
   * @param files Archivos de código (ruta + contenido) a guardar.
   */
  async submit(userId: string, projectId: string, files: SandboxFile[]) {
    // Intento actual = entregas previas del usuario en ese proyecto + 1.
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
    // Raíz de subidas: UPLOAD_DIR si está definida, si no ./uploads del cwd.
    const root = process.env.UPLOAD_DIR
      ? path.resolve(process.env.UPLOAD_DIR)
      : path.join(process.cwd(), "uploads");
    // Las actividades se guardan en la subcarpeta "activities".
    const dir = path.join(root, "activities");
    // Crea la carpeta si no existe (recursive evita error si ya está).
    await fs.promises.mkdir(dir, { recursive: true });
    return dir;
  }

  /** Valida el archivo de una actividad (tamaño y extensión). */
  private assertValidActivityFile(file: UploadedActivityFile) {
    // Rechaza si no llegó archivo o viene vacío.
    if (!file || !file.buffer || file.size === 0) {
      throw new BadRequestException("No se recibió ningún archivo para entregar.");
    }
    // Valida el tamaño máximo permitido.
    if (file.size > MAX_EXERCISE_FILE_BYTES) {
      throw new BadRequestException(
        `El archivo supera el tamaño máximo de ${MAX_EXERCISE_FILE_BYTES / (1024 * 1024)} MB.`,
      );
    }
    // Extrae la extensión (en minúsculas) y la compara con la lista permitida.
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
    // Calcula el hash SHA-256 del contenido para verificar integridad.
    const sha256 = createHash("sha256").update(file.buffer).digest("hex");
    // Sanea el nombre (evita rutas/inyección) reemplazando caracteres no seguros.
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    // El archivo en disco lleva prefijo del id de la entrega para no colisionar.
    const stored = path.join(
      await this.exerciseUploadDir(),
      `${submissionId}-${safeName}`,
    );
    // Escribe el buffer en disco.
    await fs.promises.writeFile(stored, file.buffer);
    return { stored, sha256 };
  }

  /** Borra del disco el archivo de una entrega (ignora si ya no existe). */
  private async removeStoredFile(archiveKey: string | null) {
    // Si la entrega no tiene archivo asociado, no hay nada que borrar.
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
    // 1) Valida extensión y tamaño del archivo recibido.
    this.assertValidActivityFile(file);

    // 2) Verifica que el ejercicio de destino exista.
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
      select: { id: true },
    });
    if (!exercise) {
      throw new NotFoundException(`No existe la actividad "${exerciseId}"`);
    }

    // 3) Calcula el número de intento (entregas previas + 1).
    const attemptNumber =
      (await this.prisma.submission.count({ where: { userId, exerciseId } })) +
      1;

    // 4) Calcula el hash SHA-256 del archivo antes de persistir.
    const sha256 = createHash("sha256").update(file.buffer).digest("hex");
    // 5) Crea la Submission y su SubmissionFile en una sola operación.
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

    // 6) Guarda el archivo en disco y actualiza la ruta (archiveKey).
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
    // Valida el nuevo archivo (extensión y tamaño).
    this.assertValidActivityFile(file);

    // Busca la entrega para comprobar que existe y que es de actividad.
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      select: { id: true, userId: true, exerciseId: true, archiveKey: true },
    });
    if (!submission || !submission.exerciseId) {
      throw new NotFoundException(`No existe la entrega de actividad "${submissionId}"`);
    }
    // Solo el dueño puede reemplazar su entrega.
    if (submission.userId !== userId) {
      throw new ForbiddenException("Esta entrega no te pertenece.");
    }

    // Borra el archivo anterior del disco y guarda el nuevo.
    await this.removeStoredFile(submission.archiveKey);
    const { stored, sha256 } = await this.storeActivityFile(submission.id, file);

    // Actualiza metadatos y registro de archivo en una transacción.
    return this.prisma.$transaction(async (tx) => {
      // Reemplaza el registro de archivo anterior por el nuevo.
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
    // Solo el dueño puede eliminar su entrega.
    if (submission.userId !== userId) {
      throw new ForbiddenException("Esta entrega no te pertenece.");
    }

    // Borra primero el archivo en disco y luego el registro en base de datos.
    await this.removeStoredFile(submission.archiveKey);
    await this.prisma.submission.delete({ where: { id: submission.id } });
  }

  /** Entregas de una actividad hechas por el usuario (sin la revisión IA). */
  getMyExerciseSubmissions(userId: string, exerciseId: string) {
    // Devuelve las entregas del usuario para ese ejercicio, sin la revisión IA.
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

  /**
   * Ejecuta el comando dado (por defecto "node --test") sobre los archivos del
   * envío dentro del sandbox Docker y persiste el resultado real.
   * @param id Id del envío (Submission) a evaluar.
   * @param command Comando de shell a ejecutar (opcional).
   * @returns La Submission con su status y el resultado del sandbox.
   * @throws NotFoundException si el envío no existe.
   */
  async evaluate(id: string, command: string = EVAL_COMMAND) {
    // Recupera el envío con el contenido de todos sus archivos.
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: {
        files: { select: { path: true, content: true } },
      },
    });
    if (!submission) {
      throw new NotFoundException(`No existe el envío "${id}"`);
    }

    // Delega la ejecución en el runner (DockerSandboxRunner) con timeout fijo.
    const run: SandboxRunResult = await this.runner.run(
      submission.files.map((f) => ({ path: f.path, content: f.content })),
      command,
      EVAL_TIMEOUT_MS,
    );

    // Traduce el resultado a un estado de la entrega:
    // - exit 0 sin timeout -> PASSED
    // - exit 0 pero timeout -> PARTIAL
    // - cualquier otro exit -> NEEDS_WORK
    const status =
      run.exitCode === 0 && !run.timedOut
        ? SubmissionStatus.PASSED
        : run.exitCode === 0
          ? SubmissionStatus.PARTIAL
          : SubmissionStatus.NEEDS_WORK;

    // Guarda el estado y el detalle del resultado (salidas recortadas a 64 KiB).
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
