import type { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { describe, expect, it, vi } from "vitest";
import { AuthController } from "../src/auth/auth.controller.js";
import { AuthService } from "../src/auth/auth.service.js";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "../src/auth/auth.constants.js";
import type { PrismaService } from "../src/prisma/prisma.service.js";
import { UsersService } from "../src/users/users.service.js";

const ENV: Record<string, string> = {
  JWT_ACCESS_SECRET: "test-access-secret",
  JWT_REFRESH_SECRET: "test-refresh-secret",
  JWT_ACCESS_TTL_SECONDS: "900",
  JWT_REFRESH_TTL_SECONDS: "2592000",
  COOKIE_SECURE: "false",
};

function makeEnv() {
  return { get: (key: string) => ENV[key] ?? undefined } as unknown as ConfigService;
}

interface PrismaMock {
  user: {
    create: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
  };
}

function makeAuth() {
  const prisma: PrismaMock = { user: { create: vi.fn(), findUnique: vi.fn() } };
  const users = new UsersService(prisma as unknown as PrismaService);
  const jwt = new JwtService();
  const auth = new AuthService(users, jwt, makeEnv());
  return { prisma, users, auth };
}

function fakeUser() {
  return {
    id: "user-1",
    email: "ana@ejemplo.com",
    passwordHash: "not-used",
    name: "Ana",
    role: "STUDENT",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function sessionUserWithRealHash(password: string) {
  return {
    ...fakeUser(),
    passwordHash: await bcrypt.hash(password, 4),
  };
}

describe("AuthService", () => {
  it("registra, normaliza el email y hashea la contraseña", async () => {
    const { prisma, auth } = makeAuth();
    prisma.user.create.mockResolvedValue(fakeUser());

    const session = await auth.register({
      email: " ANA@Ejemplo.COM ",
      password: "secret-password",
      name: "Ana",
    });

    const createArgs = prisma.user.create.mock.calls[0]?.[0] as {
      data: { email: string; passwordHash: string; name: string };
    };
    expect(createArgs.data.email).toBe("ana@ejemplo.com");
    expect(createArgs.data.passwordHash).not.toBe("secret-password");
    expect(createArgs.data.passwordHash).toHaveLength(60);
    expect(session.user.email).toBe("ana@ejemplo.com");
    expect(session.accessToken).toBeTruthy();
    expect(session.refreshToken).toBeTruthy();
    expect(session.user).not.toHaveProperty("passwordHash");
  });

  it("emite access tokens verificables con el payload correcto", async () => {
    const { prisma, auth } = makeAuth();
    prisma.user.create.mockResolvedValue(fakeUser());

    const session = await auth.register({
      email: "ana@ejemplo.com",
      password: "secret-password",
    });

    const jwt = new JwtService();
    const payload = await jwt.verifyAsync(session.accessToken, {
      secret: ENV.JWT_ACCESS_SECRET,
    });
    expect(payload).toMatchObject({
      sub: "user-1",
      email: "ana@ejemplo.com",
      role: "STUDENT",
      type: "access",
    });
  });

  it("inicia sesión con credenciales válidas", async () => {
    const { prisma, auth } = makeAuth();
    prisma.user.findUnique.mockResolvedValue(
      await sessionUserWithRealHash("correct-password"),
    );

    const session = await auth.login({
      email: "ana@ejemplo.com",
      password: "correct-password",
    });
    expect(session.user.id).toBe("user-1");
  });

  it("rechaza una contraseña incorrecta", async () => {
    const { prisma, auth } = makeAuth();
    prisma.user.findUnique.mockResolvedValue(
      await sessionUserWithRealHash("correct-password"),
    );

    await expect(
      auth.login({ email: "ana@ejemplo.com", password: "wrong-password" }),
    ).rejects.toThrow("Email o contraseña incorrectos");
  });

  it("rechaza un usuario inexistente", async () => {
    const { prisma, auth } = makeAuth();
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      auth.login({ email: "sin-cuenta@ejemplo.com", password: "12345678" }),
    ).rejects.toThrow("Email o contraseña incorrectos");
  });

  it("renueva la sesión con un refresh token válido", async () => {
    const { prisma, auth } = makeAuth();
    prisma.user.findUnique.mockResolvedValue(fakeUser());

    const jwt = new JwtService();
    const refreshToken = await jwt.signAsync(
      { sub: "user-1", type: "refresh" },
      { secret: ENV.JWT_REFRESH_SECRET, expiresIn: "1h" },
    );

    const session = await auth.refresh(refreshToken);
    expect(session.user.id).toBe("user-1");
    expect(session.accessToken).toBeTruthy();
    expect(session.refreshToken).toBeTruthy();
  });

  it("rechaza un refresh token inválido o ausente", async () => {
    const { auth } = makeAuth();
    await expect(auth.refresh(undefined)).rejects.toThrow("Sesión expirada");
    await expect(auth.refresh("no-es-un-token")).rejects.toThrow("Sesión expirada");
  });

  it("rechaza un access token usado como refresh", async () => {
    const { prisma, auth } = makeAuth();
    prisma.user.create.mockResolvedValue(fakeUser());

    const session = await auth.register({
      email: "ana@ejemplo.com",
      password: "secret-password",
    });
    await expect(auth.refresh(session.accessToken)).rejects.toThrow(
      "Sesión expirada",
    );
  });
});

describe("AuthController", () => {
  it("registra y fija las dos cookies httpOnly", async () => {
    const { prisma, auth } = makeAuth();
    prisma.user.create.mockResolvedValue(fakeUser());

    const controller = new AuthController(auth, makeEnv());
    const res = { cookie: vi.fn(), clearCookie: vi.fn() };
    const cookieNames: string[] = [];

    res.cookie.mockImplementation(
      (name: string) => {
        cookieNames.push(name);
      },
    );

    await controller.register(
      { email: "ana@ejemplo.com", password: "secret-password", name: "Ana" },
      res as never,
    );

    expect(cookieNames).toEqual([ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE]);
    expect(res.cookie).toHaveBeenCalledTimes(2);
  });

  it("cierra sesión limpiando ambas cookies", async () => {
    const { auth } = makeAuth();
    const controller = new AuthController(auth, makeEnv());
    const res = { cookie: vi.fn(), clearCookie: vi.fn() };

    await controller.logout(res as never);

    expect(res.clearCookie).toHaveBeenCalledWith(ACCESS_TOKEN_COOKIE, {
      path: "/",
    });
    expect(res.clearCookie).toHaveBeenCalledWith(REFRESH_TOKEN_COOKIE, {
      path: "/",
    });
  });
});