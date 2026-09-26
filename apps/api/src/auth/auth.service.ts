/**
 * Servicio de autenticación.
 * Contiene la lógica de negocio: hash de contraseñas con bcrypt, creación y
 * login de usuarios, firma/verificación de JWT (access y refresh) y el mapeo
 * de un usuario de base de datos a un "usuario seguro" sin passwordHash.
 */

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import type { User } from "../generated/prisma/client.ts";
import { UsersService } from "../users/users.service.js";
import {
  DEFAULT_ACCESS_SECRET,
  DEFAULT_REFRESH_SECRET,
} from "./auth.constants.js";
import type { LoginDto } from "./dto/login.dto.js";
import type { RegisterDto } from "./dto/register.dto.js";
import type { AuthSession, SafeUser } from "./interfaces/auth-session.interface.js";
import type { JwtPayload } from "./interfaces/jwt-payload.interface.js";

// Coste del hash bcrypt (más alto = más seguro pero más lento)
const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  // Secret para firmar/verificar access tokens (env o valor por defecto de dev)
  private readonly accessSecret =
    this.config.get<string>("JWT_ACCESS_SECRET") ?? DEFAULT_ACCESS_SECRET;
  // Secret para firmar/verificar refresh tokens
  private readonly refreshSecret =
    this.config.get<string>("JWT_REFRESH_SECRET") ?? DEFAULT_REFRESH_SECRET;
  // Vida del access token en segundos (por defecto 900 = 15 min)
  readonly accessTtlSeconds = Number(
    this.config.get<string>("JWT_ACCESS_TTL_SECONDS") ?? 900,
  );
  // Vida del refresh token en segundos (por defecto 2.592.000 = 30 días)
  readonly refreshTtlSeconds = Number(
    this.config.get<string>("JWT_REFRESH_TTL_SECONDS") ?? 2_592_000,
  );

  // users: acceso a datos; jwt: firma/verificación; config: variables de entorno
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Registra un usuario nuevo.
   * Normaliza el email, hashea la contraseña y crea el usuario. Si el email
   * ya existe (error de unicidad P2002 de Prisma) responde 409 Conflict.
   * @param dto Datos de registro validados.
   * @returns Sesión con el usuario y los tokens generados.
   */
  async register(dto: RegisterDto): Promise<AuthSession> {
    // Email normalizado para evitar duplicados por mayúsculas/espacios
    const email = dto.email.trim().toLowerCase();
    // Nunca se guarda la contraseña en claro: se guarda su hash
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    try {
      const user = await this.users.create({
        email,
        passwordHash,
        name: dto.name?.trim() || null,
      });
      return this.buildSession(user);
    } catch (error) {
      // P2002 = violación de unicidad (email ya registrado)
      if ((error as { code?: string }).code === "P2002") {
        throw new ConflictException("Ese email ya está registrado");
      }
      throw error;
    }
  }

  /**
   * Inicia sesión validando email y contraseña.
   * @param dto Credenciales validadas.
   * @returns Sesión con el usuario y los tokens, o 401 si algo no coincide.
   */
  async login(dto: LoginDto): Promise<AuthSession> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.users.findByEmail(email);
    if (!user) {
      // Mismo mensaje que si falla la contraseña, para no filtrar si el email existe
      throw new UnauthorizedException("Email o contraseña incorrectos");
    }

    // Compara la contraseña en claro contra el hash almacenado
    const passwordOk = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordOk) {
      throw new UnauthorizedException("Email o contraseña incorrectos");
    }
    return this.buildSession(user);
  }

  /**
   * Renueva la sesión a partir de un refresh token.
   * Verifica la firma y vigencia del token, comprueba que sea de tipo
   * "refresh" y que el usuario siga existiendo, y emite tokens nuevos.
   * @param refreshToken Token leído de la cookie (puede venir vacío).
   * @returns Nueva sesión con tokens frescos.
   */
  async refresh(refreshToken?: string): Promise<AuthSession> {
    if (!refreshToken) {
      throw new UnauthorizedException("Sesión expirada");
    }

    let payload: JwtPayload;
    try {
      // Verifica firma y expiración con el secret de refresh
      payload = await this.jwt.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException("Sesión expirada");
    }

    // Solo sirven tokens de tipo refresh con sujeto (id) válido
    if (payload.type !== "refresh" || !payload.sub) {
      throw new UnauthorizedException("Sesión inválida");
    }

    const user = await this.users.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException("Usuario no encontrado");
    }
    return this.buildSession(user);
  }

  /**
   * Obtiene los datos públicos de un usuario por su id.
   * @param userId Id del usuario autenticado.
   * @returns Usuario sin passwordHash, o 401 si no existe.
   */
  async me(userId: string): Promise<SafeUser> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedException("Usuario no encontrado");
    }
    return this.toSafeUser(user);
  }

  /**
   * Actualiza el perfil del usuario.
   * Si se cambia el email, lo normaliza y comprueba que no lo use otro
   * usuario (409 Conflict en ese caso).
   * @param userId Id del usuario a actualizar.
   * @param data Campos opcionales del perfil a modificar.
   * @returns El usuario actualizado sin passwordHash.
   */
  async updateProfile(
    userId: string,
    data: { name?: string; avatarUrl?: string; email?: string; phone?: string; country?: string },
  ): Promise<SafeUser> {
    if (data.email !== undefined) {
      const normalized = data.email.trim().toLowerCase();
      const existing = await this.users.findByEmail(normalized);
      // Solo es conflicto si el email pertenece a OTRO usuario
      if (existing && existing.id !== userId) {
        throw new ConflictException("Ese email ya está registrado");
      }
      data = { ...data, email: normalized };
    }
    const user = await this.users.updateProfile(userId, data);
    return this.toSafeUser(user);
  }

  /**
   * Firma los JWT de una sesión.
   * El access token incluye { sub, email, role, type: "access" }; el refresh
   * solo { sub, type: "refresh" } para minimizar la información expuesta.
   * @param user Usuario de base de datos.
   * @returns Sesión con usuario seguro + tokens.
   */
  private async buildSession(user: User): Promise<AuthSession> {
    // Access token: corto, incluye datos para autorizar peticiones
    const accessToken = await this.jwt.signAsync(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        type: "access",
      },
      { secret: this.accessSecret, expiresIn: this.accessTtlSeconds },
    );
    // Refresh token: largo, solo identifica al usuario y su tipo
    const refreshToken = await this.jwt.signAsync(
      { sub: user.id, type: "refresh" },
      { secret: this.refreshSecret, expiresIn: this.refreshTtlSeconds },
    );
    return { user: this.toSafeUser(user), accessToken, refreshToken };
  }

  /**
   * Convierte un usuario de la BD en uno "seguro" para enviar al cliente,
   * eliminando el passwordHash.
   * @param user Usuario completo de Prisma.
   * @returns Objeto SafeUser sin passwordHash.
   */
  private toSafeUser(user: User): SafeUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      phone: user.phone,
      country: user.country,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}