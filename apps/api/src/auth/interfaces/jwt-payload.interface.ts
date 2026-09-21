import type { UserRole } from "../../generated/prisma/client.ts";

/**
 * Payload de los JWT emitidos por StackForge.
 * - Access token: { sub, email, role, type: "access" }
 * - Refresh token: { sub, type: "refresh" }
 */
export interface JwtPayload {
  sub: string;
  email?: string;
  role?: UserRole;
  type: "access" | "refresh";
}