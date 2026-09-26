/**
 * Guard de autorización por roles.
 * Lee la metadata que deja el decorador @Roles() y comprueba que el usuario
 * autenticado tenga uno de los roles permitidos.
 */

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
  // Reflector permite leer la metadata de @Roles() del handler/clase
  constructor(private readonly reflector: Reflector) {}

  /**
   * Decide si el usuario tiene permiso.
   * @param context Contexto de Nest (handler y clase actuales).
   * @returns true si no se exigen roles o si el usuario tiene alguno.
   * @throws UnauthorizedException si no hay usuario; ForbiddenException si no tiene rol.
   */
  canActivate(context: ExecutionContext): boolean {
    // Lee los roles requeridos (del método o, si no, de la clase)
    const requiredRoles = this.reflector.getAllAndOverride(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    // Sin roles declarados, la ruta no está restringida
    if (!requiredRoles?.length) {
      return true;
    }

    const { user } = context
      .switchToHttp()
      .getRequest<{ user?: AuthUser }>();
    // Sin usuario en la petición no se puede autorizar (falta JwtAuthGuard)
    if (!user) {
      throw new UnauthorizedException("No autenticado");
    }
    // El rol del usuario debe estar entre los permitidos
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException("No tienes permisos para realizar esta acción");
    }
    return true;
  }
}