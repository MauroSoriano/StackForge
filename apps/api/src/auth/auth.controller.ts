/**
 * Controlador de autenticación.
 * Expone los endpoints de registro, login, refresco de sesión, logout,
 * consulta del usuario actual y actualización de perfil. En register/login/
 * refresh emite los JWT como cookies httpOnly mediante setCookies().
 */

import type { CookieOptions, Request, Response } from "express";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
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
import { UpdateProfileDto } from "./dto/update-profile.dto.js";

@ApiTags("auth") // Agrupa estos endpoints bajo "auth" en Swagger
@Controller("auth") // Ruta base: /api/auth
export class AuthController {
  // auth: lógica de usuarios/sesiones; config: lee variables (p. ej. COOKIE_SECURE)
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Crea una cuenta e inicia sesión.
   * @param dto Email, contraseña y nombre opcional (validado por RegisterDto).
   * @param res Respuesta de Express para escribir las cookies de sesión.
   * @returns El usuario creado sin el hash de contraseña.
   */
  @Post("register")
  @ApiOperation({ summary: "Crear cuenta" })
  @ApiResponse({ status: 201, description: "Usuario creado y sesión iniciada" })
  @ApiResponse({ status: 409, description: "El email ya está registrado" })
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SafeUser> {
    // Crea el usuario y genera los tokens; luego los deja en cookies
    const session = await this.auth.register(dto);
    this.setCookies(res, session);
    return session.user;
  }

  /**
   * Inicia sesión con email y contraseña.
   * @param dto Credenciales (validado por LoginDto).
   * @param res Respuesta de Express para escribir las cookies de sesión.
   * @returns El usuario autenticado sin el hash de contraseña.
   */
  @Post("login")
  @ApiOperation({ summary: "Iniciar sesión" })
  @ApiResponse({ status: 200, description: "Sesión iniciada" })
  @ApiResponse({ status: 401, description: "Credenciales incorrectas" })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SafeUser> {
    // Verifica credenciales y genera una nueva sesión (tokens)
    const session = await this.auth.login(dto);
    this.setCookies(res, session);
    return session.user;
  }

  /**
   * Renueva la sesión a partir del refresh token guardado en cookie.
   * @param req Petición para leer la cookie del refresh token.
   * @param res Respuesta para reescribir las cookies con los nuevos tokens.
   * @returns El usuario de la sesión renovada.
   */
  @Post("refresh")
  @ApiOperation({ summary: "Renovar la sesión con el refresh token" })
  @ApiResponse({ status: 200, description: "Sesión renovada" })
  @ApiResponse({ status: 401, description: "Refresh token inválido o expirado" })
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SafeUser> {
    // Verifica el refresh token, recarga el usuario y emite tokens nuevos
    const session = await this.auth.refresh(req.cookies?.[REFRESH_TOKEN_COOKIE]);
    this.setCookies(res, session);
    return session.user;
  }

  /**
   * Cierra la sesión borrando las cookies de access y refresh token.
   * @param res Respuesta para limpiar ambas cookies.
   */
  @Post("logout")
  @ApiOperation({ summary: "Cerrar sesión" })
  @ApiResponse({ status: 204, description: "Cookies limpiadas" })
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    // Borra las cookies en la misma ruta en que se crearon
    res.clearCookie(ACCESS_TOKEN_COOKIE, { path: "/" });
    res.clearCookie(REFRESH_TOKEN_COOKIE, { path: "/" });
  }

  /**
   * Devuelve el usuario autenticado actual.
   * JwtAuthGuard rellena currentUser desde la cookie del access token.
   * @param currentUser Usuario inyectado por el decorador @CurrentUser().
   * @returns Datos públicos del usuario (sin passwordHash).
   */
  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Usuario autenticado actual" })
  @ApiResponse({ status: 200, description: "Datos del usuario (sin passwordHash)" })
  @ApiResponse({ status: 401, description: "No autenticado" })
  me(@CurrentUser() currentUser: AuthUser): Promise<SafeUser> {
    return this.auth.me(currentUser.id);
  }

  /**
   * Actualiza campos del perfil del usuario autenticado.
   * @param currentUser Usuario inyectado por @CurrentUser().
   * @param dto Campos opcionales a modificar (validados por UpdateProfileDto).
   * @returns El usuario actualizado (sin passwordHash).
   */
  @Patch("profile")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Actualizar nombre y foto de perfil" })
  @ApiResponse({ status: 200, description: "Perfil actualizado" })
  @ApiResponse({ status: 401, description: "No autenticado" })
  updateProfile(
    @CurrentUser() currentUser: AuthUser,
    @Body() dto: UpdateProfileDto,
  ): Promise<SafeUser> {
    return this.auth.updateProfile(currentUser.id, dto);
  }

  /**
   * Escribe las cookies httpOnly con el access y el refresh token.
   * @param res Respuesta de Express donde se fijan las cookies.
   * @param session Sesión con los tokens y sus tiempos de vida.
   */
  private setCookies(res: Response, session: AuthSession): void {
    // Secure=true (solo HTTPS) cuando COOKIE_SECURE="true" en el entorno
    const secure = this.config.get<string>("COOKIE_SECURE") === "true";
    // Opciones comunes: no accesible desde JS, anti-CSRF básico, ruta raíz
    const base: CookieOptions = {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
    };
    // Cookie del access token (maxAge en milisegundos)
    res.cookie(ACCESS_TOKEN_COOKIE, session.accessToken, {
      ...base,
      maxAge: this.auth.accessTtlSeconds * 1000,
    });
    // Cookie del refresh token (vive mucho más que el access)
    res.cookie(REFRESH_TOKEN_COOKIE, session.refreshToken, {
      ...base,
      maxAge: this.auth.refreshTtlSeconds * 1000,
    });
  }
}