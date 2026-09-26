/**
 * Decorador de parámetro @CurrentUser().
 * Extrae el usuario autenticado que JwtAuthGuard dejó en `request.user`,
 * para inyectarlo directamente en los métodos de los controladores.
 */

import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { AuthUser } from "../interfaces/auth-user.interface.js";

/**
 * Crea el decorador que devuelve el usuario de la petición.
 * @param _data Dato opcional del decorador (no se usa).
 * @param context Contexto de ejecución de Nest (da acceso a la petición HTTP).
 * @returns El AuthUser adjuntado por el guard, o undefined si no hay.
 * Uso: `@CurrentUser() user: AuthUser`
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser | undefined => {
    // Obtiene el objeto Request de Express dentro del contexto HTTP
    const request = context.switchToHttp().getRequest<{ user?: AuthUser }>();
    return request.user;
  },
);