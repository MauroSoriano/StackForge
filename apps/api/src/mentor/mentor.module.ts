// MentorModule — Fase 08. Service + Controller, e inyeccion del proveedor
// gratuito ($0) MENTOR_PROVIDER via useFactory (ConfigService).
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PrismaModule } from "../prisma/prisma.module.js";
import { MENTOR_PROVIDER } from "./mentor-provider.interface.js";
import { MentorController } from "./mentor.controller.js";
import { MentorService } from "./mentor.service.js";
import { OpenRouterMentorProvider } from "./openrouter-mentor.provider.js";

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [MentorController],
  providers: [
    MentorService,
    {
      provide: MENTOR_PROVIDER,
      useFactory: (config: ConfigService) =>
        new OpenRouterMentorProvider(config),
      inject: [ConfigService],
    },
  ],
  exports: [MentorService],
})
export class MentorModule {}
