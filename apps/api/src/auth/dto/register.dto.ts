/**
 * DTO de registro.
 * Valida los datos de POST /auth/register: email, contraseña y nombre opcional.
 * El límite de 72 caracteres en la contraseña viene de bcrypt.
 */

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
  // Email único de la cuenta; debe ser válido y no superar 254 caracteres
  @ApiProperty({ example: "ana@ejemplo.com" })
  @IsEmail({}, { message: "El email no es válido" })
  @MaxLength(254, { message: "El email es demasiado largo" })
  email!: string;

  // Contraseña en claro; mínimo 8 caracteres (máximo 72 por bcrypt)
  @ApiProperty({ example: "contraseña-segura", minLength: 8, maxLength: 72 })
  @IsString()
  @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres" })
  @MaxLength(72, { message: "La contraseña es demasiado larga" })
  password!: string;

  // Nombre visible opcional
  @ApiPropertyOptional({ example: "Ana" })
  @IsString()
  @MaxLength(100, { message: "El nombre es demasiado largo" })
  name?: string;
}