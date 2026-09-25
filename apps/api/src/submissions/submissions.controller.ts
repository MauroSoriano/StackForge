import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { memoryStorage } from "multer";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import type { AuthUser } from "../auth/interfaces/auth-user.interface.js";
import {
  SubmissionsService,
  type UploadedActivityFile,
} from "./submissions.service.js";
import type { SandboxFile } from "./sandbox/sandbox-runner.interface.js";

interface SubmitSubmissionDto {
  projectId: string;
  files: SandboxFile[];
}

interface EvaluateSubmissionDto {
  command?: string;
}

@ApiTags("submissions")
@UseGuards(JwtAuthGuard)
@Controller("submissions")
export class SubmissionsController {
  constructor(private readonly submissions: SubmissionsService) {}

  @Get("mine")
  getMine(@CurrentUser() user: AuthUser) {
    return this.submissions.getMySubmissions(user.id);
  }

  @Post("exercises/:exerciseId")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: 32 * 1024 * 1024 },
    }),
  )
  uploadForExercise(
    @CurrentUser() user: AuthUser,
    @Param("exerciseId") exerciseId: string,
    @UploadedFile() file: UploadedActivityFile | undefined,
  ) {
    if (!file) {
      throw new BadRequestException("Envía el archivo en el campo \"file\".");
    }
    return this.submissions.uploadForExercise(user.id, exerciseId, file);
  }

  @Get("exercises/:exerciseId")
  getForExercise(
    @CurrentUser() user: AuthUser,
    @Param("exerciseId") exerciseId: string,
  ) {
    return this.submissions.getMyExerciseSubmissions(user.id, exerciseId);
  }

  @Post()
  submit(@CurrentUser() user: AuthUser, @Body() dto: SubmitSubmissionDto) {
    return this.submissions.submit(user.id, dto.projectId, dto.files);
  }

  @Post(":id/evaluate")
  evaluate(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: EvaluateSubmissionDto) {
    return this.submissions.evaluate(id, dto.command);
  }
}