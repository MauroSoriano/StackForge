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

type AuthenticatedRequest = Request & { user?: AuthUser };

/**
 * Valida el access token (cookie httpOnly) y adjunta el usuario a `request.user`.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.cookies?.[ACCESS_TOKEN_COOKIE];
    if (!token) {
      throw new UnauthorizedException("No autenticado");
    }

    try {
      const secret =
        this.config.get<string>("JWT_ACCESS_SECRET") ?? DEFAULT_ACCESS_SECRET;
      const payload = await this.jwt.verifyAsync<JwtPayload>(token, { secret });
      if (payload.type !== "access" || !payload.sub) {
        throw new UnauthorizedException("Sesión inválida");
      }
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