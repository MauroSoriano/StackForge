import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "ana@ejemplo.com" })
  @IsEmail({}, { message: "El email no es válido" })
  email!: string;

  @ApiProperty({ example: "contraseña-segura" })
  @IsString()
  @IsNotEmpty({ message: "La contraseña es obligatoria" })
  password!: string;
}