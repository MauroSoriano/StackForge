/**
 * DTO de login.
 * Define y valida los datos que el cliente envía al endpoint POST /auth/login.
 * Los decoradores de class-validator se ejecutan gracias al ValidationPipe global.
 */

import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  // Email del usuario; debe tener formato de email
  @ApiProperty({ example: "ana@ejemplo.com" })
  @IsEmail({}, { message: "El email no es válido" })
  email!: string;

  // Contraseña en claro; debe ser texto y no vacía
  @ApiProperty({ example: "contraseña-segura" })
  @IsString()
  @IsNotEmpty({ message: "La contraseña es obligatoria" })
  password!: string;
}