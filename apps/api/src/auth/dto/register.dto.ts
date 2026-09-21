import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "ana@ejemplo.com" })
  @IsEmail({}, { message: "El email no es válido" })
  @MaxLength(254, { message: "El email es demasiado largo" })
  email!: string;

  @ApiProperty({ example: "contraseña-segura", minLength: 8, maxLength: 72 })
  @IsString()
  @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres" })
  @MaxLength(72, { message: "La contraseña es demasiado larga" })
  password!: string;

  @ApiPropertyOptional({ example: "Ana" })
  @IsString()
  @MaxLength(100, { message: "El nombre es demasiado largo" })
  name?: string;
}