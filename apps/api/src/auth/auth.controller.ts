import type { CookieOptions, Request, Response } from "express";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "./auth.constants.js";
import { AuthService } from "./auth.service.js";
import { CurrentUser } from "./decorators/current-user.decorator.js";
import { LoginDto } from "./dto/login.dto.js";
import { RegisterDto } from "./dto/register.dto.js";
import { JwtAuthGuard } from "./guards/jwt-auth.guard.js";
import type { AuthSession, SafeUser } from "./interfaces/auth-session.interface.js";
import type { AuthUser } from "./interfaces/auth-user.interface.js";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post("register")
  @ApiOperation({ summary: "Crear cuenta" })
  @ApiResponse({ status: 201, description: "Usuario creado y sesión iniciada" })
  @ApiResponse({ status: 409, description: "El email ya está registrado" })
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SafeUser> {
    const session = await this.auth.register(dto);
    this.setCookies(res, session);
    return session.user;
  }

  @Post("login")
  @ApiOperation({ summary: "Iniciar sesión" })
  @ApiResponse({ status: 200, description: "Sesión iniciada" })
  @ApiResponse({ status: 401, description: "Credenciales incorrectas" })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SafeUser> {
    const session = await this.auth.login(dto);
    this.setCookies(res, session);
    return session.user;
  }

  @Post("refresh")
  @ApiOperation({ summary: "Renovar la sesión con el refresh token" })
  @ApiResponse({ status: 200, description: "Sesión renovada" })
  @ApiResponse({ status: 401, description: "Refresh token inválido o expirado" })
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SafeUser> {
    const session = await this.auth.refresh(req.cookies?.[REFRESH_TOKEN_COOKIE]);
    this.setCookies(res, session);
    return session.user;
  }

  @Post("logout")
  @ApiOperation({ summary: "Cerrar sesión" })
  @ApiResponse({ status: 204, description: "Cookies limpiadas" })
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    res.clearCookie(ACCESS_TOKEN_COOKIE, { path: "/" });
    res.clearCookie(REFRESH_TOKEN_COOKIE, { path: "/" });
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Usuario autenticado actual" })
  @ApiResponse({ status: 200, description: "Datos del usuario (sin passwordHash)" })
  @ApiResponse({ status: 401, description: "No autenticado" })
  me(@CurrentUser() currentUser: AuthUser): Promise<SafeUser> {
    return this.auth.me(currentUser.id);
  }

  private setCookies(res: Response, session: AuthSession): void {
    const secure = this.config.get<string>("COOKIE_SECURE") === "true";
    const base: CookieOptions = {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
    };
    res.cookie(ACCESS_TOKEN_COOKIE, session.accessToken, {
      ...base,
      maxAge: this.auth.accessTtlSeconds * 1000,
    });
    res.cookie(REFRESH_TOKEN_COOKIE, session.refreshToken, {
      ...base,
      maxAge: this.auth.refreshTtlSeconds * 1000,
    });
  }
}