/**
 * ARCHIVO: mentor.service.ts
 * --------------------------
 * Orquesta el MENTOR: reúne el contexto de un envío (resultado real de la
 * Fase 06, código, proyecto y requisitos), se lo pasa a un MentorProvider
 * gratuito ($0) y persiste el feedback en AIFeedback. No ejecuta Docker.
 */

// MentorService — Fase 08
//
// Orquesta el mentor: lee lo que la Fase 06 YA guardo (result real:
// exitCode/timedOut/stdout/stderr), el codigo entregado, el proyecto y sus
// requisitos; arma un MentorContext PLANO y se lo pasa al proveedor gratuito
// (MENTOR_PROVIDER -> OpenRouter, SOLO $0) SIN volver a ejecutar Docker.
// Luego persiste el resultado en AIFeedback y lo devuelve.
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { MENTOR_PROVIDER } from "./mentor-provider.interface.js";
import type {
  MentorContext,
  MentorFeedback,
  MentorProvider,
} from "./mentor-provider.interface.js";
import type {
  AIFeedback,
  AIProvider,
  MentorMode,
  SubmissionStatus,
} from "../generated/prisma/client.js";

/**
 * Servicio del mentor: construye el contexto, pide la revisión y la guarda.
 */
@Injectable()
export class MentorService {
  constructor(
    // Cliente Prisma para leer el envío y escribir el AIFeedback.
    private readonly prisma: PrismaService,
    // Proveedor de IA inyectado por el token MENTOR_PROVIDER.
    @Inject(MENTOR_PROVIDER) private readonly provider: MentorProvider,
  ) {}

  /** Evalua (gratis, $0) un envio ya ejecutado por la fase 06 y persiste el resultado. */
  async review(
    submissionId: string,
    userId: string,
    mode: MentorMode = "REVIEW",
  ): Promise<MentorFeedback> {
    // 1) Arma el contexto desde lo ya guardado (valida propiedad).
    const context = await this.buildContext(submissionId, userId);
    // 2) Pide la revisión al proveedor (gratuito, sin tocar Docker).
    const feedback = await this.provider.review(context, mode);
    // 3) Persiste el feedback y lo devuelve.
    await this.persist(submissionId, feedback);
    return feedback;
  }

  /** Historial de feedbacks del mentor para un envio propio. */
  async history(submissionId: string, userId: string): Promise<AIFeedback[]> {
    // buildContext lanza 404 si el envío no existe o no es del usuario (valida propiedad).
    await this.buildContext(submissionId, userId); // valida propiedad
    return this.prisma.aIFeedback.findMany({
      where: { submissionId },
      orderBy: { createdAt: "desc" },
    });
  }

  /** Arma el contexto plano desde lo que la fase 06 dejo guardado. */
  private async buildContext(
    submissionId: string,
    userId: string,
  ): Promise<MentorContext> {
    // Filtra por id + userId: si no pertenece al usuario, no se encuentra.
    const submission = await this.prisma.submission.findFirst({
      where: { id: submissionId, userId },
      include: {
        project: {
          select: {
            title: true,
            description: true,
            requirements: {
              select: {
                description: true,
                acceptanceCriteria: true,
              },
              orderBy: { order: "asc" },
            },
          },
        },
        files: {
          select: { path: true, content: true },
        },
      },
    });
    if (!submission) {
      throw new NotFoundException('No existe tu envio "' + submissionId + '"');
    }
    // Normaliza los archivos al formato plano esperado por el proveedor.
    const files = (submission.files ?? []).map((f) => ({
      path: f.path,
      content: f.content,
    }));
    // Normaliza los requisitos del proyecto (criterio opcional -> null).
    const requirements = (submission.project?.requirements ?? []).map((r) => ({
      description: r.description,
      acceptanceCriteria: r.acceptanceCriteria ?? null,
    }));
    // El resultado de la Fase 06 se guarda como JSON; se castea y valida aparte.
    const result = (submission.result as {
      exitCode: number | null;
      timedOut: boolean;
      stdout: string;
      stderr: string;
    } | null) ?? null;
    return {
      submissionId: submission.id,
      projectTitle: submission.project?.title ?? "(sin titulo)",
      projectDescription: submission.project?.description ?? null,
      requirements,
      files,
      result: result
        ? {
            exitCode: typeof result.exitCode === "number" ? result.exitCode : null,
            timedOut: result.timedOut === true,
            stdout: typeof result.stdout === "string" ? result.stdout : "",
            stderr: typeof result.stderr === "string" ? result.stderr : "",
          }
        : null,
    };
  }

  /** Persiste el AIFeedback devuelto por el proveedor. */
  private async persist(
    submissionId: string,
    feedback: MentorFeedback,
  ): Promise<void> {
    // Crea el registro de feedback con defaults seguros (provider FREE, etc.).
    await this.prisma.aIFeedback.create({
      data: {
        submissionId,
        provider: (feedback.provider as AIProvider) ?? "FREE",
        modelName: feedback.modelName ?? null,
        status: "ok",
        verdict: (feedback.verdict as SubmissionStatus | null) ?? null,
        overallScore: feedback.overallScore ?? null,
        requirementResults:
          (feedback.requirementResults as object) ?? undefined,
        codeQuality: feedback.codeQuality ?? null,
        problemsFound: (feedback.problemsFound as object) ?? undefined,
        recommendations: (feedback.recommendations as object) ?? undefined,
        nextSteps: feedback.nextSteps ?? null,
        raw: (feedback.raw as object) ?? undefined,
        latencyMs: feedback.latencyMs ?? null,
      },
    });
  }
}
