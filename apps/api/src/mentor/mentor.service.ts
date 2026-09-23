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

@Injectable()
export class MentorService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(MENTOR_PROVIDER) private readonly provider: MentorProvider,
  ) {}

  /** Evalua (gratis, $0) un envio ya ejecutado por la fase 06 y persiste el resultado. */
  async review(
    submissionId: string,
    userId: string,
    mode: MentorMode = "REVIEW",
  ): Promise<MentorFeedback> {
    const context = await this.buildContext(submissionId, userId);
    const feedback = await this.provider.review(context, mode);
    await this.persist(submissionId, feedback);
    return feedback;
  }

  /** Historial de feedbacks del mentor para un envio propio. */
  async history(submissionId: string, userId: string): Promise<AIFeedback[]> {
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
    const files = (submission.files ?? []).map((f) => ({
      path: f.path,
      content: f.content,
    }));
    const requirements = (submission.project?.requirements ?? []).map((r) => ({
      description: r.description,
      acceptanceCriteria: r.acceptanceCriteria ?? null,
    }));
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
