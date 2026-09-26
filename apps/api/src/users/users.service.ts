/**
 * Servicio de usuarios.
 * Encapsula el acceso a la tabla User mediante Prisma. No contiene lógica de
 * contraseñas ni sesiones (eso vive en AuthService).
 */

import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

/**
 * Acceso a los datos de usuario (sin lógica de contraseñas/sesiones, que
 * vive en AuthService).
 */
@Injectable()
export class UsersService {
  // PrismaService es global, por eso puede inyectarse sin importar su módulo
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crea un usuario nuevo.
   * @param data Email, hash de contraseña y nombre opcional.
   * @returns El usuario creado (incluye passwordHash).
   */
  create(data: { email: string; passwordHash: string; name?: string | null }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        name: data.name ?? null, // normaliza undefined a null
      },
    });
  }

  /**
   * Busca un usuario por email (usado en login/registro).
   * @param email Email exacto a buscar.
   * @returns El usuario o null si no existe.
   */
  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  /**
   * Busca un usuario por id.
   * @param id Id del usuario.
   * @returns El usuario o null si no existe.
   */
  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  /**
   * Cambia el hash de contraseña de un usuario.
   * @param id Id del usuario.
   * @param passwordHash Nuevo hash (nunca la contraseña en claro).
   * @returns El usuario actualizado.
   */
  updatePasswordHash(id: string, passwordHash: string) {
    return this.prisma.user.update({ where: { id }, data: { passwordHash } });
  }

  /**
   * Actualiza campos de perfil, incluyendo solo los que se envían.
   * @param id Id del usuario.
   * @param data Campos opcionales a modificar.
   * @returns El usuario actualizado.
   */
  updateProfile(
    id: string,
    data: { name?: string; avatarUrl?: string; email?: string; phone?: string; country?: string },
  ) {
    return this.prisma.user.update({
      where: { id },
      // Cada spread añade el campo SOLO si llegó definido (no lo pisa con undefined)
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.avatarUrl !== undefined ? { avatarUrl: data.avatarUrl } : {}),
        ...(data.email !== undefined ? { email: data.email } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(data.country !== undefined ? { country: data.country } : {}),
      },
    });
  }
}