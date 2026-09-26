/**
 * Módulo de autenticación.
 * Registra el controlador y los servicios/guards de auth, y expone
 * AuthService y los guards globalmente (el módulo es @Global) para que
 * cualquier otro módulo pueda usar @UseGuards(JwtAuthGuard) o RolesGuard.
 */

import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "../users/users.module.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { JwtAuthGuard } from "./guards/jwt-auth.guard.js";
import { RolesGuard } from "./guards/roles.guard.js";

@Global()
@Module({
  // JwtModule global para firmar/verificar tokens; UsersModule para el CRUD de usuarios
  imports: [JwtModule.register({ global: true }), UsersModule],
  controllers: [AuthController], // Endpoints /api/auth/*
  providers: [AuthService, JwtAuthGuard, RolesGuard], // Servicios y guards
  exports: [AuthService, JwtAuthGuard, RolesGuard], // Disponibles en otros módulos
})
// Módulo que agrupa toda la autenticación
export class AuthModule {}