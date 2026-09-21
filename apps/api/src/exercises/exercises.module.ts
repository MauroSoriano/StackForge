import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { ExercisesController } from "./exercises.controller.js";
import { ExercisesService } from "./exercises.service.js";

@Module({
  imports: [PrismaModule],
  controllers: [ExercisesController],
  providers: [ExercisesService],
  exports: [ExercisesService],
})
export class ExercisesModule {}
