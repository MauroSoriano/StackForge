import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module.js";
import { HealthModule } from "./health/health.module.js";
import { CurriculumModule } from "./curriculum/curriculum.module.js";
import { ProgressModule } from "./progress/progress.module.js";
import { ExercisesModule } from "./exercises/exercises.module.js";
import { PrismaModule } from "./prisma/prisma.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CurriculumModule,
    ProgressModule,
    ExercisesModule,
    HealthModule,
  ],
})
export class AppModule {}