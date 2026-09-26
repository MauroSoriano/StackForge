/**
 * Módulo de usuarios.
 * Provee y exporta UsersService para que AuthModule (u otros) puedan
 * consultar y modificar usuarios.
 */

import { Module } from "@nestjs/common";
import { UsersService } from "./users.service.js";

@Module({
  providers: [UsersService], // Registra el servicio de usuarios
  exports: [UsersService], // Permite inyectarlo en otros módulos
})
// Módulo que agrupa el acceso a datos de usuario
export class UsersModule {}