/**
 * ARCHIVO: mentor.module.ts
 * -------------------------
 * Módulo de NestJS del dominio MENTOR (Fase 08). Registra el controlador y el
 * servicio, e inyecta el proveedor gratuito ($0) bajo el token MENTOR_PROVIDER
 * usando una factoría que recibe ConfigService.
 */

// MentorModule — Fase 08. Service + Controller, e inyeccion del proveedor
// gratuito ($0) MENTOR_PROVIDER via useFactory (ConfigService).
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PrismaModule } from "../prisma/prisma.module.js";
import { MENTOR_PROVIDER } from "./mentor-provider.interface.js";
import { MentorController } from "./mentor.controller.js";
import { MentorService } from "./mentor.service.js";
import { OpenRouterMentorProvider } from "./openrouter-mentor.provider.js";

/**
 * Módulo raíz del dominio mentor.
 * - imports: ConfigModule (variables de entorno) y PrismaModule (AIFeedback).
 * - controllers: MentorController (rutas "/submissions/:submissionId/mentor").
 * - providers: MentorService y el proveedor de IA.
 *   MENTOR_PROVIDER se construye con useFactory para poder leer la config
 *   (modelo y API key) en tiempo de arranque; inject declara la dependencia.
 * - exports: MentorService.
 */
@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [MentorController],
  providers: [
    MentorService,
    {
      // Crea el proveedor concreto (OpenRouter) pasándole la configuración.
      provide: MENTOR_PROVIDER,
      useFactory: (config: ConfigService) =>
        new OpenRouterMentorProvider(config),
      // ConfigService se inyecta como argumento de la factoría.
      inject: [ConfigService],
    },
  ],
  exports: [MentorService],
})
export class MentorModule {}
