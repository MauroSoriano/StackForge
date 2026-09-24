import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

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
}