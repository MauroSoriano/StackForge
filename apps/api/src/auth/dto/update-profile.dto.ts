/**
 * DTO de actualización de perfil.
 * Todos los campos son opcionales: solo se valida/actualiza lo que se envíe
 * en PATCH /auth/profile.
 */

import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class UpdateProfileDto {
  // Nombre visible (opcional)
  @ApiPropertyOptional({ example: "Ana" })
  @IsOptional()
  @IsString({ message: "El nombre debe ser texto" })
  @MaxLength(100, { message: "El nombre es demasiado largo" })
  name?: string;

  // Foto de perfil como URL o data URL; se admite hasta ~2 MB de texto
  @ApiPropertyOptional({ description: "URL o data URL de la foto de perfil" })
  @IsOptional()
  @IsString({ message: "La foto debe ser una URL o data URL" })
  @MaxLength(2_000_000, { message: "La foto es demasiado grande" })
  avatarUrl?: string;

  // Nuevo email (debe ser válido y único; se comprueba en AuthService)
  @ApiPropertyOptional({ example: "ana@ejemplo.com" })
  @IsOptional()
  @IsEmail({}, { message: "El email no es válido" })
  @MaxLength(254, { message: "El email es demasiado largo" })
  email?: string;

  // Teléfono de contacto (opcional)
  @ApiPropertyOptional({ example: "+54 11 5555 1234" })
  @IsOptional()
  @IsString({ message: "El teléfono debe ser texto" })
  @MaxLength(40, { message: "El teléfono es demasiado largo" })
  phone?: string;

  // País de residencia (opcional)
  @ApiPropertyOptional({ example: "Argentina" })
  @IsOptional()
  @IsString({ message: "El país debe ser texto" })
  @MaxLength(90, { message: "El país es demasiado largo" })
  country?: string;
}