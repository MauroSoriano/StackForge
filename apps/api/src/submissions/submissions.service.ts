import { Injectable, NotFoundException } from "@nestjs/common";

import { Inject } from "@nestjs/common";
import { SANDBOX_RUNNER } from "./sandbox/sandbox-runner.interface.js";

import type {
  SandboxFile,
  SandboxRunner,
  SandboxRunResult,
} from "./sandbox/sandbox-runner.interface.js";

import { PrismaService } from "../prisma/prisma.service.js";
import { SubmissionStatus } from "../generated/prisma/client.js";

const EVAL_TIMEOUT_MS = 30_000;
const EVAL_COMMAND = "node --test";

@Injectable()
export class SubmissionsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SANDBOX_RUNNER) private readonly runner: SandboxRunner,
  ) {}

  async getMySubmissions(userId: string) {
    return this.prisma.submission.findMany({
      where: { userId },
      select: {
        id: true,
        projectId: true,
        attemptNumber: true,
        status: true,
        result: true,
        submittedAt: true,
      },
      orderBy: { submittedAt: "desc" },
    });
  }

  async submit(userId: string, projectId: string, files: SandboxFile[]) {
    const attemptNumber =
      (await this.prisma.submission.count({ where: { userId, projectId } })) +
      1;

    return this.prisma.submission.create({
      data: {
        userId,
        projectId,
        attemptNumber,
        status: SubmissionStatus.RECEIVED,
        files: {
          create: files.map((f) => ({ path: f.path, content: f.content })),
        },
        submittedAt: new Date(),
      },
      select: {
        id: true,
        projectId: true,
        attemptNumber: true,
        status: true,
        submittedAt: true,
      },
    });
  }

  async evaluate(id: string, command: string = EVAL_COMMAND) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: {
        files: { select: { path: true, content: true } },
      },
    });
    if (!submission) {
      throw new NotFoundException(`No existe el envío "${id}"`);
    }

    const run: SandboxRunResult = await this.runner.run(
      submission.files.map((f) => ({ path: f.path, content: f.content })),
      command,
      EVAL_TIMEOUT_MS,
    );

    const status =
      run.exitCode === 0 && !run.timedOut
        ? SubmissionStatus.PASSED
        : run.exitCode === 0
          ? SubmissionStatus.PARTIAL
          : SubmissionStatus.NEEDS_WORK;

    return this.prisma.submission.update({
      where: { id },
      data: {
        status,
        result: {
          exitCode: run.exitCode,
          timedOut: run.timedOut,
          usedMs: run.usedMs,
          stdout: run.stdout.slice(0, 64 * 1024),
          stderr: run.stderr.slice(0, 64 * 1024),
        },
        processedAt: new Date(),
      },
      select: { id: true, status: true, result: true },
    });
  }
}
