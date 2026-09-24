import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: "Ana" })
  @IsOptional()
  @IsString({ message: "El nombre debe ser texto" })
  @MaxLength(100, { message: "El nombre es demasiado largo" })
  name?: string;

  @ApiPropertyOptional({ description: "URL o data URL de la foto de perfil" })
  @IsOptional()
  @IsString({ message: "La foto debe ser una URL o data URL" })
  @MaxLength(2_000_000, { message: "La foto es demasiado grande" })
  avatarUrl?: string;

  @ApiPropertyOptional({ example: "ana@ejemplo.com" })
  @IsOptional()
  @IsEmail({}, { message: "El email no es válido" })
  @MaxLength(254, { message: "El email es demasiado largo" })
  email?: string;

  @ApiPropertyOptional({ example: "+54 11 5555 1234" })
  @IsOptional()
  @IsString({ message: "El teléfono debe ser texto" })
  @MaxLength(40, { message: "El teléfono es demasiado largo" })
  phone?: string;

  @ApiPropertyOptional({ example: "Argentina" })
  @IsOptional()
  @IsString({ message: "El país debe ser texto" })
  @MaxLength(90, { message: "El país es demasiado largo" })
  country?: string;
}