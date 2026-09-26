/**
 * Interface del payload de los JWT.
 * Describe los claims que viajan dentro de los tokens emitidos por auth.
 */

import type { UserRole } from "../../generated/prisma/client.ts";

/**
 * Payload de los JWT emitidos por StackForge.
 * - Access token: { sub, email, role, type: "access" }
 * - Refresh token: { sub, type: "refresh" }
 */
export interface JwtPayload {
  sub: string; // "subject": id del usuario dueño del token
  email?: string; // email (solo en el access token)
  role?: UserRole; // rol (solo en el access token)
  type: "access" | "refresh"; // distingue access de refresh
}