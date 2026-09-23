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

/** Contrato del proveedor de IA del mentor (inyectado vía token). */
export interface MentorProvider {
  readonly name: string;
  review(context: MentorContext, mode: MentorMode): Promise<MentorFeedback>;
}

export const MENTOR_PROVIDER = Symbol("MENTOR_PROVIDER");
