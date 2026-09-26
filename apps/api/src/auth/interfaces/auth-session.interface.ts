/**
 * Interfaces de sesión de autenticación.
 * Definen la forma de una sesión y del usuario que sí se puede exponer.
 */

import type { User } from "../../generated/prisma/client.ts";

/**
 * Resultado de crear/renovar una sesión: usuario seguro + tokens.
 */
export interface AuthSession {
  user: SafeUser; // datos del usuario sin datos sensibles
  accessToken: string; // JWT de corta duración para autorizar peticiones
  refreshToken: string; // JWT de larga duración para renovar la sesión
}

/**
 * Usuario sin el hash de contraseña (nunca se devuelve al cliente).
 * Se construye omitiendo "passwordHash" del modelo User de Prisma.
 */
export type SafeUser = Omit<User, "passwordHash">;