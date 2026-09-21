import type { User } from "../../generated/prisma/client.ts";

/**
 * Resultado de crear/renovar una sesión: usuario seguro + tokens.
 */
export interface AuthSession {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}

/**
 * Usuario sin el hash de contraseña (nunca se devuelve al cliente).
 */
export type SafeUser = Omit<User, "passwordHash">;