import {
  CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator.js";
import type { AuthUser } from "../interfaces/auth-user.interface.js";

/**
 * Comprueba el rol del usuario autenticado contra @Roles().
 * Requiere JwtAuthGuard antes (para poblar request.user).
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles?.length) {
      return true;
    }

    const { user } = context
      .switchToHttp()
      .getRequest<{ user?: AuthUser }>();
    if (!user) {
      throw new UnauthorizedException("No autenticado");
    }
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException("No tienes permisos para realizar esta acción");
    }
    return true;
  }
}