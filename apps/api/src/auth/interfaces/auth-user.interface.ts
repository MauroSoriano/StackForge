/**
 * Interface del usuario autenticado.
 * Es la versión mínima que los guards adjuntan a `request.user`.
 */

import type { UserRole } from "../../generated/prisma/client.ts";

/**
 * Usuario autenticado que se adjunta a `request.user` tras pasar JwtAuthGuard.
 */
export interface AuthUser {
  id: string; // id del usuario (claim "sub" del token)
  email: string; // email del usuario
  role: UserRole; // rol para la autorización (p. ej. STUDENT, ADMIN)
}