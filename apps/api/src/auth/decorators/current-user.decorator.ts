import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { AuthUser } from "../interfaces/auth-user.interface.js";

/**
 * Expone el usuario autenticado (seteado por JwtAuthGuard) como parámetro.
 * @CurrentUser() user: AuthUser
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser | undefined => {
    const request = context.switchToHttp().getRequest<{ user?: AuthUser }>();
    return request.user;
  },
);