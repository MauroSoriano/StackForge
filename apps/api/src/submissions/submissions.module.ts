import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { SubmissionsController } from "./submissions.controller.js";
import { SubmissionsService } from "./submissions.service.js";
import { SANDBOX_RUNNER } from "./sandbox/sandbox-runner.interface.js";
import { DockerSandboxRunner } from "./sandbox/docker-sandbox.runner.js";

@Module({
  imports: [PrismaModule],
  controllers: [SubmissionsController],
  providers: [
    SubmissionsService,
    {
      provide: SANDBOX_RUNNER,
      useValue: new DockerSandboxRunner(),
    },
  ],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
