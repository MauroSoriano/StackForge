import { SetMetadata } from "@nestjs/common";
import type { UserRole } from "../../generated/prisma/client.ts";

export const ROLES_KEY = "roles";

/**
 * Restringe el acceso a usuarios con alguno de los roles indicados.
 * Combinar con JwtAuthGuard: @UseGuards(JwtAuthGuard, RolesGuard).
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);