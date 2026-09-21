import type { UserRole } from "../../generated/prisma/client.ts";

/**
 * Usuario autenticado que se adjunta a `request.user` tras pasar JwtAuthGuard.
 */
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}