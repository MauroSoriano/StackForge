/**
 * Módulo raíz de la API StackForge.
 * Agrupa e importa todos los módulos funcionales de la aplicación
 * (configuración, base de datos, autenticación, currículo, progreso,
 * ejercicios, entregas, mentor y health).
 */

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module.js";
import { HealthModule } from "./health/health.module.js";
import { CurriculumModule } from "./curriculum/curriculum.module.js";
import { ProgressModule } from "./progress/progress.module.js";
import { ExercisesModule } from "./exercises/exercises.module.js";
import { SubmissionsModule } from "./submissions/submissions.module.js";
import { MentorModule } from "./mentor/mentor.module.js";
import { PrismaModule } from "./prisma/prisma.module.js";

/**
 * Metadatos del módulo raíz: declara los módulos importados.
 * ConfigModule es global (lee .env); PrismaModule es global y provee
 * PrismaService a toda la app; el resto aportan sus controladores/servicios.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CurriculumModule,
    ProgressModule,
    ExercisesModule,
    SubmissionsModule,
    MentorModule,
    HealthModule,
  ],
})
// Clase marcadora que NestJS usa como raíz de la aplicación
export class AppModule {}
