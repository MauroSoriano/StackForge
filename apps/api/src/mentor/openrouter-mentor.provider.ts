/**
 * ARCHIVO: openrouter-mentor.provider.ts
 * --------------------------------------
 * Implementación de MentorProvider que llama a la API de OpenRouter. Lee el
 * modelo y la API key de la configuración y garantiza que SOLO se usen modelos
 * gratuitos ($0). No re-ejecuta Docker: solo envía JSON y parsea la respuesta.
 */

// OpenRouter Mentor Provider — Fase 08
//
// REGLA DURA CONFIRMADA (ago-2026): SOLO modelos 100% GRATUITOS ($0).
// - Unica ruta aceptada: el router oficial `openrouter/free` (OpenRouter lo
//   rota entre modelos GRATUITOS: $0 permanente) o sufijo ":free".
// - PROHIBIDO: modelos de pago, "baratos", de bajo costo, de cualquier costo.
//   `assertFreeModel` falla ante CUALQUIER modelo que no termine en free y no
//   sea exactamente openrouter/free. Costo obligatorio: USD 0. Sin excepciones.
//
// El mentor NO re-ejecuta Docker: la fase 06 ya evaluo y guardo el resultado
// real (result.exitCode/timedOut/stdout/stderr). Aqui solo se escribe JSON.
import { ConfigService } from "@nestjs/config";
import {
  MENTOR_PROVIDER,
  type MentorContext,
  type MentorFeedback,
  type MentorProvider,
} from "./mentor-provider.interface.js";
import type {
  AIProvider,
  MentorMode,
  SubmissionStatus,
} from "../generated/prisma/client.js";

// Router oficial de OpenRouter que rota entre modelos gratuitos.
const FREE_ROUTER = "openrouter/free";

/** Guard fail-fast: rechaza cualquier modelo que NO sea 100% gratuito. */
function assertFreeModel(model: string | undefined): string {
  const m = (model ?? "").trim() || FREE_ROUTER;
  const ok =
    m === FREE_ROUTER || m === "openrouter:free" || m.endsWith(":free");
  if (!ok) {
    throw new Error(
      'FASE 08 MENTOR: modelo "' +
        m +
        '" NO es gratuito. Solo se aceptan "openrouter/free" (router oficial ' +
        "$0) o variantes \":free\". Prohibido modelos de pago o \"baratos\". " +
        "Costo obligatorio: USD 0.",
    );
  }
  return m;
}

/** Normaliza la nota al rango 0-100 (redondeada) o null si no es válida. */
function clampScore(n: number | null | undefined): number | null {
  if (n == null || !Number.isFinite(n)) return null;
  return Math.round(Math.min(100, Math.max(0, n)));
}

/** Acepta solo veredictos válidos; cualquier otra cosa devuelve null. */
function verdictIfSupported(v: string | null | undefined): SubmissionStatus | null {
  return v === "PASSED" || v === "PARTIAL" || v === "NEEDS_WORK" || v === "ERROR"
    ? (v as SubmissionStatus)
    : null;
}

/**
 * Proveedor del mentor que usa la API de OpenRouter con modelos gratuitos.
 */
export class OpenRouterMentorProvider implements MentorProvider {
  // Identificador del proveedor (se guarda en el feedback).
  readonly name = "OPENROUTER";

  // API key de OpenRouter (puede faltar; entonces se devuelve error amable).
  private readonly apiKey: string | undefined;
  // Nombre del modelo, validado por assertFreeModel en el constructor.
  private readonly modelName: string;

  constructor(config: ConfigService) {
    // Valida (fail-fast) que el modelo configurado sea 100% gratuito.
    this.modelName = assertFreeModel(config.get<string>("MENTOR_MODEL"));
    this.apiKey = config.get<string>("OPENROUTER_API_KEY");
  }

  /**
   * Envía el contexto a OpenRouter y devuelve el feedback parseado.
   * Nunca lanza por errores de red/parseo: en su lugar devuelve un feedback
   * con verdict ERROR y el motivo (bad()).
   * @param context Contexto plano del envío (resultado real + código).
   * @param mode Modo de revisión (p. ej. REVIEW).
   * @returns MentorFeedback con la evaluación o con el error.
   */
  async review(context: MentorContext, mode: MentorMode): Promise<MentorFeedback> {
    // Marca de tiempo para calcular la latencia.
    const startedAt = Date.now();
    // Sin API key no se puede llamar; se devuelve error sin gastar nada.
    if (!this.apiKey) {
      return this.bad("Falta OPENROUTER_API_KEY en el entorno. No se pago nada.");
    }
    const systemPrompt = this.systemPrompt(mode);
    const userPrompt = this.buildPrompt(context);
    // Cuerpo JSON de la petición: modelo gratuito, temperatura 0 y JSON forzado.
    const body = JSON.stringify({
      model: this.modelName,
      temperature: 0,
      max_tokens: 2500,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });
    let res: Response;
    try {
      // Llamada HTTP a OpenRouter con timeout de 60 s.
      res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + this.apiKey,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://stackforge.dev",
          "X-Title": "StackForge Mentor",
        },
        body,
        signal: AbortSignal.timeout(60000),
      });
    } catch (err) {
      const meta =
        "Error de red OpenRouter (gratuito): " +
        (err instanceof Error ? err.message : String(err));
      return this.bad(meta);
    }
    if (!res.ok) {
      const rawText = await this.safeText(res);
      return this.bad(
        "OpenRouter respondio " +
          res.status +
          " " +
          res.statusText +
          ": " +
          rawText,
      );
    }
    let rawData: unknown;
    try {
      rawData = await res.json();
    } catch {
      return this.bad("OpenRouter devolvio JSON invalido. Nada se ejecuto.");
    }
    // Extrae el texto del primer "choice" de la respuesta.
    const content = this.pickContent(rawData);
    if (!content) {
      return this.bad("OpenRouter no devolvio contenido.");
    }
    // El modelo debe devolver JSON válido en el contenido.
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      return this.bad("La respuesta del mentor no era JSON valido.");
    }
    if (typeof parsed !== "object" || parsed == null || Array.isArray(parsed)) {
      return this.bad("La respuesta del mentor no era un objeto JSON.");
    }
    return this.toFeedback(parsed as Record<string, unknown>, Date.now() - startedAt);
  }

  /** Convierte el objeto JSON del modelo en un MentorFeedback saneado. */
  private toFeedback(p: Record<string, unknown>, latencyMs: number): MentorFeedback {
    return {
      provider: "OPENROUTER" as AIProvider,
      modelName: this.modelName,
      verdict: verdictIfSupported(p["verdict"] as string),
      overallScore: clampScore(p["overallScore"] as number),
      requirementResults:
        typeof p["requirementResults"] === "object" && p["requirementResults"] != null
          ? (p["requirementResults"] as Record<string, unknown>)
          : null,
      codeQuality:
        typeof p["codeQuality"] === "string" ? (p["codeQuality"] as string) : null,
      problemsFound: Array.isArray(p["problemsFound"]) ? p["problemsFound"] : null,
      recommendations: Array.isArray(p["recommendations"])
        ? p["recommendations"]
        : null,
      nextSteps:
        typeof p["nextSteps"] === "string" ? (p["nextSteps"] as string) : null,
      raw: p,
      latencyMs,
    };
  }

  /** Construye el "system prompt" con las reglas y el formato JSON exigido. */
  private systemPrompt(mode: MentorMode): string {
    return (
      "Eres el Mentor de StackForge (Fase 08). Evaluas una entrega YA " +
      "ejecutada por la Fase 06 (Docker): el resultado real (exitCode, " +
      "timedOut, stdout, stderr) ya esta guardado y NO debes re-ejecutar " +
      "nada. Debes responder SOLO JSON valido con esta forma:\n" +
      '{"verdict":"PASSED|PARTIAL|NEEDS_WORK|ERROR","overallScore":0-100,' +
      '"requirementResults":[{ "description","pass","notes" }],' +
      '"codeQuality":"...","problemsFound":[...],"recommendations":[...],' +
      '"nextSteps":"..."}\n' +
      "Reglas:\n" +
      "- Se estricto y objetivo: usa SOLO el resultado real guardado.\n" +
      "- Si exitCode != 0 o timedOut, el veredicto es NEEDS_WORK (o ERROR si " +
      "no hay resultado).\n" +
      "- Verdict y overallScore van acordes al resultado REAL; no inventes.\n" +
      "- Contesta en espanol.\n" +
      "- Mode actual: " +
      mode +
      "\n" +
      "- Costo de esta evaluacion: USD 0 (jamas pagar, jamas modelos caros)."
    );
  }

  /** Arma el "user prompt" con proyecto, requisitos, resultado real y código. */
  private buildPrompt(context: MentorContext): string {
    // Una línea por requisito (con su criterio de aceptación si lo hay).
    const requirementLines = (context.requirements ?? [])
      .map((r) => "- " + r.description + (r.acceptanceCriteria ? " (criterio: " + r.acceptanceCriteria + ")" : ""))
      .join("\n");
    // Bloque con todos los archivos entregados, separados por su ruta.
    const fileBlock = (context.files ?? [])
      .map((f) => "=== " + f.path + " ===\n" + f.content)
      .join("\n\n");
    // Texto del resultado real de la Fase 06 (o aviso si no lo hay).
    const result = context.result
      ? "exitCode=" +
        (context.result.exitCode == null ? "null" : String(context.result.exitCode)) +
        "\ntimedOut=" +
        (context.result.timedOut ? "true" : "false") +
        "\n--- stdout ---\n" +
        (context.result.stdout || "") +
        "\n--- stderr ---\n" +
        (context.result.stderr || "")
      : "SIN RESULTADO EJECUTADO";
    return [
      "Submision: " + context.submissionId,
      "Proyecto: " + context.projectTitle,
      "Descripcion: " + (context.projectDescription ?? "(sin descripcion)"),
      "",
      "REQUISITOS:",
      requirementLines,
      "",
      "RESULTADO REAL (fase 06, Docker):",
      result,
      "",
      "CODIGO ENTREGADO:",
      fileBlock,
    ].join("\n");
  }

  /** Extrae el contenido de texto de choices[0].message.content. */
  private pickContent(data: unknown): string | null {
    const d = data as { choices?: { message?: { content?: unknown } }[] };
    const content = d?.choices?.[0]?.message?.content;
    return typeof content === "string" ? content : null;
  }

  /** Lee el cuerpo de la respuesta como texto, sin lanzar si falla. */
  private async safeText(res: Response): Promise<string> {
    try {
      return await res.text();
    } catch {
      return "(cuerpo ilegible)";
    }
  }

  /** Construye un MentorFeedback de error (verdict ERROR) con el motivo. */
  private bad(reason: string): MentorFeedback {
    return {
      provider: "OPENROUTER" as AIProvider,
      modelName: this.modelName,
      verdict: "ERROR" as SubmissionStatus,
      overallScore: null,
      requirementResults: null,
      codeQuality: null,
      problemsFound: [{ message: reason }],
      recommendations: null,
      nextSteps: null,
      raw: { error: reason },
      latencyMs: null,
    };
  }
}

/** Factoría reutilizable del proveedor (alternativa a la del módulo). */
export const MENTOR_PROVIDER_FACTORY = {
  provide: MENTOR_PROVIDER,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => new OpenRouterMentorProvider(config),
};
