/**
 * Decorador @Roles().
 * Marca un controlador o endpoint con los roles permitidos; RolesGuard lee
 * esa metadata para autorizar o denegar el acceso.
 */

import { SetMetadata } from "@nestjs/common";
import type { UserRole } from "../../generated/prisma/client.ts";

// Clave de metadata bajo la que se guardan los roles requeridos
export const ROLES_KEY = "roles";

/**
 * Restringe el acceso a usuarios con alguno de los roles indicados.
 * Combinar con JwtAuthGuard: @UseGuards(JwtAuthGuard, RolesGuard).
 * @param roles Lista de roles permitidos (p. ej. "ADMIN", "STUDENT").
 * @returns Decorador que adjunta la metadata de roles.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);