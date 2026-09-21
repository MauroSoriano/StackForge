/**
 * Cliente HTTP hacia la API de StackForge.
 * En dev/prod el proxy de Next (rewrites en next.config.ts) expone la API bajo
 * /api del mismo origen, por lo que las cookies httpOnly se envían sin fricción
 * de CORS. Definir NEXT_PUBLIC_API_URL para apuntar a otro host.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/** Nombre de la cookie httpOnly con el access token (coincide con la API). */
export const ACCESS_TOKEN_COOKIE = "stackforge_at";

export interface SafeUser {
  id: string;
  email: string;
  name: string | null;
  role: "STUDENT" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type Body = Record<string, unknown> | undefined;

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: Body;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    credentials: "include",
    cache: "no-store",
    headers: options.body
      ? { "Content-Type": "application/json" }
      : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

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

export const api = {
  register: (data: { email: string; password: string; name?: string }) =>
    request<SafeUser>("/auth/register", { method: "POST", body: data }),

  login: (data: { email: string; password: string }) =>
    request<SafeUser>("/auth/login", { method: "POST", body: data }),

  refresh: () => request<SafeUser>("/auth/refresh", { method: "POST" }),

  logout: () => request<void>("/auth/logout", { method: "POST" }),

  me: () => request<SafeUser>("/auth/me"),
};