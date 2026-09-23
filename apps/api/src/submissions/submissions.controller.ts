import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import type { AuthUser } from "../auth/interfaces/auth-user.interface.js";
import { SubmissionsService } from "./submissions.service.js";
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

  @Post()
  submit(@CurrentUser() user: AuthUser, @Body() dto: SubmitSubmissionDto) {
    return this.submissions.submit(user.id, dto.projectId, dto.files);
  }

  @Post(":id/evaluate")
  evaluate(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: EvaluateSubmissionDto) {
    return this.submissions.evaluate(id, dto.command);
  }
}
