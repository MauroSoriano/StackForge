/**
 * ARCHIVO: mentor-provider.interface.ts
 * -------------------------------------
 * Contrato y tipos del MENTOR: qué datos recibe y qué devuelve una revisión
 * automática. El mentor trabaja sobre lo que ya se evaluó en la Fase 06
 * (submission + files): NO vuelve a ejecutar Docker, solo analiza texto/JSON.
 */

import type { MentorMode, SubmissionStatus, AIProvider } from "../generated/prisma/client.js";

/**
 * Archivo plano sin re-evaluar: se construye desde lo ya guardado por la
 * fase 06 (submission + files) — el Mentor NO vuelve a correr Docker.
 */
export interface MentorFile {
  path: string;
  content: string;
}

/** Requisito del proyecto, tal como existe en `ProjectRequirement`. */
export interface MentorRequirement {
  description: string;
  acceptanceCriteria: string | null;
}

/** Todo lo que el mentor necesita: resultado REAL ya ejecutado + el código. */
export interface MentorContext {
  submissionId: string;
  projectTitle: string;
  projectDescription: string | null;
  requirements: MentorRequirement[];
  files: MentorFile[];
  result: {
    exitCode: number | null;
    timedOut: boolean;
    stdout: string;
    stderr: string;
  } | null;
}

/** Devolución estructurada del mentor, mapeada al modelo `AIFeedback`. */
export interface MentorFeedback {
  provider: AIProvider;
  modelName: string;
  verdict: SubmissionStatus | null;
  overallScore: number | null;
  requirementResults: Record<string, unknown> | null;
  codeQuality?: string | null;
  problemsFound?: unknown[] | null;
  recommendations?: unknown[] | null;
  nextSteps?: string | null;
  raw?: unknown;
  latencyMs?: number | null;
}

/**
 * Contrato que debe cumplir cualquier proveedor de IA del mentor.
 * - name: identificador del proveedor (p. ej. "OPENROUTER").
 * - review: analiza el contexto y el modo, y devuelve un MentorFeedback.
 */
export interface MentorProvider {
  readonly name: string;
  review(context: MentorContext, mode: MentorMode): Promise<MentorFeedback>;
}

/**
 * Token de inyección de NestJS. El módulo del mentor lo asocia con la
 * implementación concreta (OpenRouterMentorProvider).
 */
export const MENTOR_PROVIDER = Symbol("MENTOR_PROVIDER");
