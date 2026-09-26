/**
 * Cliente HTTP hacia la API de StackForge.
 * El API mountea bajo el prefijo global "api" (setGlobalPrefix en main.ts) y el
 * proxy de Next reescribe /api/:path* -> :4000/api/:path*, por lo que el cliente
 * debe pedir /api/... del mismo origen. Definir NEXT_PUBLIC_API_URL para apuntar
 * a otro host (que incluya el prefijo, p. ej. https://api.x.com/api).
 */
/** URL base del cliente: por defecto "/api" (mismo origen; el proxy de Next la reenvía al backend). */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

/** Nombre de la cookie httpOnly con el access token (coincide con la API). */
export const ACCESS_TOKEN_COOKIE = "stackforge_at";

/** Tiempo máximo de espera de una petición (evita el botón cargando eterno). */
const REQUEST_TIMEOUT_MS = 15000;

/** Datos públicos del usuario que devuelve la API (nunca incluye la contraseña). */
export interface SafeUser {
  id: string;
  email: string;
  name: string | null;
  role: "STUDENT" | "ADMIN";
  avatarUrl: string | null;
  phone: string | null;
  country: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Error personalizado para respuestas de la API.
 * Guarda el código HTTP (`status`) para que la UI pueda reaccionar,
 * por ejemplo redirigir a /login cuando status === 401.
 */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Cuerpo de una petición: objeto JSON genérico o nada (GET/DELETE).
type Body = Record<string, unknown> | undefined;

// Opciones aceptadas por el helper `request`.
interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: Body;
}

/** Detalle completo de un ejercicio (instrucciones, requisitos y tests). */
export interface ExerciseDetail {
  id: string;
  title: string;
  description: string | null;
  instructions: string;
  order: number | null;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  maxAttempts: number | null;
  lesson: {
    id: string;
    slug: string;
    title: string;
    module: {
      id: string;
      slug: string;
      title: string;
      track: { slug: string; title: string };
    };
  } | null;
  requirements: Array<{
    id: string;
    description: string;
    isMandatory: boolean;
    order: number | null;
  }>;
  tests: Array<{ id: string; name: string; description: string | null; order: number | null }>;
}

/** Una entrega (submission) de un ejercicio: intento, estado y archivos enviados. */
export interface ExerciseSubmission {
  id: string;
  attemptNumber: number;
  status: "RECEIVED" | "PROCESSING" | "PASSED" | "PARTIAL" | "NEEDS_WORK" | "ERROR";
  archiveSizeBytes: number | null;
  fileCount: number | null;
  submittedAt: string;
  files: Array<{ path: string; sizeBytes: number | null }>;
}

/**
 * Helper para SUBIR ARCHIVOS a la API usando `FormData` (multipart/form-data).
 * A diferencia de `request`, aquí no se envía JSON sino el archivo binario.
 *
 * - Crea un `AbortController` con un timeout de 30s (las subidas pueden tardar más
 *   que una petición normal) para evitar que el botón quede cargando eternamente.
 * - Usa `credentials: "include"` para que viaje la cookie httpOnly de sesión.
 * - Convierte respuestas de error de la API en `ApiError`.
 *
 * @param path Ruta relativa, p. ej. `/submissions/exercises/123`.
 * @param file Archivo que se enviará en el campo "file".
 * @param method Verbo HTTP: POST para crear, PUT para reemplazar.
 * @returns El JSON de respuesta tipado como `T`.
 */
async function requestUpload<T>(path: string, file: File, method: "POST" | "PUT" = "POST"): Promise<T> {
  // Controla la cancelación de la petición por timeout
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  let res: Response;
  try {
    // FormData empaqueta el archivo para subirlo como multipart/form-data
    const body = new FormData();
    body.append("file", file);
    res = await fetch(`${API_URL}${path}`, {
      method,
      credentials: "include", // envía cookies de sesión (access token)
      cache: "no-store", // nunca cachear respuestas
      body,
      signal: controller.signal,
    });
  } catch {
    // Fallo de red / timeout: status 0 indica que no hubo respuesta del servidor
    throw new ApiError(0, "No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.");
  } finally {
    clearTimeout(timer);
  }

  // Intenta parsear el JSON; si el cuerpo no es JSON, queda null
  const json = (await res.json().catch(() => null)) as
    | { message?: string | string[] }
    | null;

  if (!res.ok) {
    // El backend puede devolver `message` como string o como arreglo de errores
    const message = Array.isArray(json?.message)
      ? json.message.join(". ")
      : json?.message ?? `Error ${res.status}`;
    throw new ApiError(res.status, message);
  }
  return json as T;
}

/**
 * Helper central para peticiones JSON a la API.
 *
 * - Timeout configurable vía `REQUEST_TIMEOUT_MS` (evita el "cargando…" infinito).
 * - Añade `Content-Type: application/json` y serializa el body solo si lo hay.
 * - `credentials: "include"` para mandar la cookie de sesión.
 * - Convierte errores HTTP en `ApiError` con el `status` y el mensaje del backend.
 * - Si la respuesta es 204 (sin contenido), devuelve `undefined`.
 *
 * @param path Ruta relativa (se concatena a `API_URL`).
 * @param options Método HTTP y body opcional.
 * @returns El JSON de respuesta tipado como `T`.
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: options.method ?? "GET", // GET por defecto
      credentials: "include", // envía cookies de sesión
      cache: "no-store", // sin caché del navegador
      headers: options.body
        ? { "Content-Type": "application/json" }
        : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
  } catch {
    // Error de conexión o timeout
    throw new ApiError(0, "No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.");
  } finally {
    clearTimeout(timer);
  }

  // 204 = respuesta sin cuerpo (p. ej. un DELETE correcto)
  if (res.status === 204) {
    return undefined as T;
  }

  const json = (await res.json().catch(() => null)) as
    | { message?: string | string[] }
    | null;

  if (!res.ok) {
    const message = Array.isArray(json?.message)
      ? json.message.join(". ")
      : json?.message ?? `Error ${res.status}`;
    throw new ApiError(res.status, message);
  }
  return json as T;
}

/**
 * Objeto con todos los métodos del API agrupados por recurso.
 * Cada método llama a `request` (JSON) o `requestUpload` (archivos) y devuelve
 * el tipo de dato que corresponde, para tener autocompletado y tipado en la UI.
 */
export const api = {
  // --- Autenticación ---

  /** Crea una cuenta nueva y devuelve el usuario creado. */
  register: (data: { email: string; password: string; name?: string }) =>
    request<SafeUser>("/auth/register", { method: "POST", body: data }),

  /** Inicia sesión; el backend responde y setea la cookie httpOnly de sesión. */
  login: (data: { email: string; password: string }) =>
    request<SafeUser>("/auth/login", { method: "POST", body: data }),

  /** Renueva el access token usando la cookie de sesión actual. */
  refresh: () => request<SafeUser>("/auth/refresh", { method: "POST" }),

  /** Cierra la sesión y borra la cookie en el servidor. */
  logout: () => request<void>("/auth/logout", { method: "POST" }),

  /** Devuelve el usuario autenticado (lanza 401 si no hay sesión válida). */
  me: () => request<SafeUser>("/auth/me"),

  /** Actualiza los datos del perfil (nombre, email, avatar, teléfono, país). */
  updateProfile: (data: { name?: string; email?: string; avatarUrl?: string; phone?: string; country?: string }) =>
    request<SafeUser>("/auth/profile", { method: "PATCH", body: data }),

  // --- Progreso del estudiante ---

  /** Cursos con sus módulos/lecciones y el progreso del usuario. */
  getMyProgress: () =>
    request<{
      tracks: Array<{
        id: string;
        slug: string;
        title: string;
        description: string | null;
        type: "JUNIOR" | "MID" | "SENIOR";
        order: number;
        modules: Array<{
          id: string;
          slug: string;
          title: string;
          order: number;
          lessons: Array<{ id: string; title: string; order: number }>;
        }>;
        _count: { modules: number };
      }>;
      progress: Array<{
        id: string;
        trackId: string;
        moduleId: string | null;
        state: "LOCKED" | "AVAILABLE" | "IN_PROGRESS" | "COMPLETED";
        progress: number;
        completedAt: string | null;
      }>;
      lessonProgress: Array<{
        id: string;
        lessonId: string;
        startedAt: string;
        completedAt: string | null;
      }>;
    }>("/progress"),

  /** Marca una lección como iniciada (registra startedAt). */
  startLesson: (lessonId: string) =>
    request<{ id: string; lessonId: string; startedAt: string }>(
      `/progress/lessons/${lessonId}/start`,
      { method: "POST" },
    ),

  /** Marca una lección como completada y recalcula el progreso del módulo. */
  completeLesson: (lessonId: string) =>
    request<{ completed: string; moduleId: string; progress: number }>(
      `/progress/lessons/${lessonId}/complete`,
      { method: "POST" },
    ),

  // --- Currículum (cursos, tracks y lecciones) ---

  /** Lista todos los cursos (tracks) disponibles. */
  listTracks: () =>
    request<
      Array<{
        id: string;
        slug: string;
        title: string;
        description: string | null;
        type: "JUNIOR" | "MID" | "SENIOR";
        order: number;
        _count: { modules: number };
      }>
    >("/curriculum/tracks"),

  /** Devuelve un curso completo por su slug, con módulos y lecciones. */
  getTrack: (slug: string) =>
    request<{
      id: string;
      slug: string;
      title: string;
      description: string | null;
      type: "JUNIOR" | "MID" | "SENIOR";
      order: number;
      modules: Array<{
        id: string;
        slug: string;
        title: string;
        description: string | null;
        order: number;
        estimatedHours: number | null;
        lockedByDefault: boolean;
        lessons: Array<{
          id: string;
          slug: string;
          title: string;
          markdown: string;
          order: number;
          durationMinutes: number | null;
          exercises: Array<{
            id: string;
            title: string;
            description: string | null;
            instructions: string;
            order: number | null;
            difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
            maxAttempts: number | null;
            _count: { tests: number };
          }>;
        }>;
      }>;
    }>(`/curriculum/tracks/${slug}`),

  /** Devuelve una lección por id, con su markdown y sus ejercicios. */
  getLesson: (id: string) =>
    request<{
      id: string;
      slug: string;
      title: string;
      markdown: string;
      order: number;
      durationMinutes: number | null;
      module: {
        id: string;
        title: string;
        slug: string;
        track: { slug: string; title: string };
      };
      exercises: Array<{
        id: string;
        title: string;
        description: string | null;
        instructions: string;
        order: number | null;
        difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
        maxAttempts: number | null;
        _count: { tests: number };
      }>;
    }>(`/curriculum/lessons/${id}`),

  /** Devuelve el temario (syllabus) completo del programa. */
  getSyllabus: () =>
    request<{
      id: string;
      slug: string;
      title: string;
      description: string | null;
      type: "JUNIOR" | "MID" | "SENIOR";
      order: number;
      modules: Array<{
        id: string;
        slug: string;
        title: string;
        description: string | null;
        order: number;
        estimatedHours: number | null;
        lessons: Array<{
          id: string;
          slug: string;
          title: string;
          markdown: string;
          order: number;
          durationMinutes: number | null;
          exercises: Array<{
            id: string;
            title: string;
            instructions: string;
            difficulty: string;
            order: number | null;
          }>;
        }>;
      }>;
    }>("/curriculum/syllabus"),

  // --- Ejercicios y entregas ---

  /** Detalle de un ejercicio (instrucciones, requisitos y tests). */
  getExercise: (id: string) => request<ExerciseDetail>(`/exercises/${id}`),

  /** Historial de entregas del usuario para un ejercicio. */
  getExerciseSubmissions: (exerciseId: string) =>
    request<ExerciseSubmission[]>(`/submissions/exercises/${exerciseId}`),

  /** Sube un archivo como nueva entrega (intento) de un ejercicio. */
  uploadExerciseFile: (exerciseId: string, file: File) =>
    requestUpload<{
      id: string;
      exerciseId: string;
      attemptNumber: number;
      status: string;
      archiveSizeBytes: number | null;
      fileCount: number | null;
      submittedAt: string;
    }>(`/submissions/exercises/${exerciseId}`, file),

  /** Reemplaza el archivo de una entrega existente (cuenta como nuevo intento). */
  replaceExerciseSubmission: (submissionId: string, file: File) =>
    requestUpload<{
      id: string;
      attemptNumber: number;
      status: string;
      archiveSizeBytes: number | null;
      fileCount: number | null;
      submittedAt: string;
    }>(`/submissions/${submissionId}/file`, file, "PUT"),

  /** Elimina una entrega del usuario. */
  deleteExerciseSubmission: (submissionId: string) =>
    request<void>(`/submissions/${submissionId}`, { method: "DELETE" }),
};