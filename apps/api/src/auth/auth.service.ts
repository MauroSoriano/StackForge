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

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  private readonly accessSecret =
    this.config.get<string>("JWT_ACCESS_SECRET") ?? DEFAULT_ACCESS_SECRET;
  private readonly refreshSecret =
    this.config.get<string>("JWT_REFRESH_SECRET") ?? DEFAULT_REFRESH_SECRET;
  readonly accessTtlSeconds = Number(
    this.config.get<string>("JWT_ACCESS_TTL_SECONDS") ?? 900,
  );
  readonly refreshTtlSeconds = Number(
    this.config.get<string>("JWT_REFRESH_TTL_SECONDS") ?? 2_592_000,
  );

  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthSession> {
    const email = dto.email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    try {
      const user = await this.users.create({
        email,
        passwordHash,
        name: dto.name?.trim() || null,
      });
      return this.buildSession(user);
    } catch (error) {
      if ((error as { code?: string }).code === "P2002") {
        throw new ConflictException("Ese email ya está registrado");
      }
      throw error;
    }
  }

  async login(dto: LoginDto): Promise<AuthSession> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Email o contraseña incorrectos");
    }

    const passwordOk = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordOk) {
      throw new UnauthorizedException("Email o contraseña incorrectos");
    }
    return this.buildSession(user);
  }

  async refresh(refreshToken?: string): Promise<AuthSession> {
    if (!refreshToken) {
      throw new UnauthorizedException("Sesión expirada");
    }

    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException("Sesión expirada");
    }

    if (payload.type !== "refresh" || !payload.sub) {
      throw new UnauthorizedException("Sesión inválida");
    }

    const user = await this.users.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException("Usuario no encontrado");
    }
    return this.buildSession(user);
  }

  async me(userId: string): Promise<SafeUser> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedException("Usuario no encontrado");
    }
    return this.toSafeUser(user);
  }

  async updateProfile(
    userId: string,
    data: { name?: string; avatarUrl?: string; email?: string; phone?: string; country?: string },
  ): Promise<SafeUser> {
    if (data.email !== undefined) {
      const normalized = data.email.trim().toLowerCase();
      const existing = await this.users.findByEmail(normalized);
      if (existing && existing.id !== userId) {
        throw new ConflictException("Ese email ya está registrado");
      }
      data = { ...data, email: normalized };
    }
    const user = await this.users.updateProfile(userId, data);
    return this.toSafeUser(user);
  }

  private async buildSession(user: User): Promise<AuthSession> {
    const accessToken = await this.jwt.signAsync(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        type: "access",
      },
      { secret: this.accessSecret, expiresIn: this.accessTtlSeconds },
    );
    const refreshToken = await this.jwt.signAsync(
      { sub: user.id, type: "refresh" },
      { secret: this.refreshSecret, expiresIn: this.refreshTtlSeconds },
    );
    return { user: this.toSafeUser(user), accessToken, refreshToken };
  }

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