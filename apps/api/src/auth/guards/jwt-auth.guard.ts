/**
 * Guard de autenticación JWT.
 * Comprueba el access token guardado en la cookie httpOnly y, si es válido,
 * adjunta el usuario a `request.user` para que lo usen los controladores.
 */

import {
  CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import {
  ACCESS_TOKEN_COOKIE,
  DEFAULT_ACCESS_SECRET,
} from "../auth.constants.js";
import type { AuthUser } from "../interfaces/auth-user.interface.js";
import type { JwtPayload } from "../interfaces/jwt-payload.interface.js";

// Request de Express enriquecido con el usuario autenticado
type AuthenticatedRequest = Request & { user?: AuthUser };

/**
 * Valida el access token (cookie httpOnly) y adjunta el usuario a `request.user`.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  // jwt: verifica tokens; config: obtiene el secret de access
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Decide si la petición puede continuar.
   * @param context Contexto de Nest (da acceso a la petición HTTP).
   * @returns true si el token es válido (deja el usuario en request.user).
   * @throws UnauthorizedException si no hay token o es inválido/expirado.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    // Lee el access token de la cookie
    const token = request.cookies?.[ACCESS_TOKEN_COOKIE];
    if (!token) {
      throw new UnauthorizedException("No autenticado");
    }

    try {
      const secret =
        this.config.get<string>("JWT_ACCESS_SECRET") ?? DEFAULT_ACCESS_SECRET;
      // Verifica firma y expiración del access token
      const payload = await this.jwt.verifyAsync<JwtPayload>(token, { secret });
      // Debe ser un access token (no un refresh) con sujeto válido
      if (payload.type !== "access" || !payload.sub) {
        throw new UnauthorizedException("Sesión inválida");
      }
      // Expone los datos mínimos del usuario al resto de la app
      request.user = {
        id: payload.sub,
        email: payload.email ?? "",
        role: payload.role ?? "STUDENT",
      };
      return true;
    } catch {
      throw new UnauthorizedException("Sesión inválida o expirada");
    }
  }
}