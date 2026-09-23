import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { SandboxRunner, SandboxRunResult } from "./sandbox-runner.interface.js";

const RUN_IMAGE = process.env.STACKFORGE_SANDBOX_IMAGE ?? "node:22-alpine";
const CPU_QUOTA = process.env.STACKFORGE_SANDBOX_CPUS ?? "1.0";
const MEM_LIMIT = process.env.STACKFORGE_SANDBOX_MEM ?? "256m";
const STDOUT_LIMIT = 64 * 1024;

function runDocker(
  args: string[],
  signal?: AbortSignal,
): Promise<{ code: number | null; signal: NodeJS.Signals | null; out: string; err: string }> {
  return new Promise((resolve) => {
    const child = execFile("docker", args, { windowsHide: true, encoding: "utf8" }, (error, out, err) => {
      resolve({ code: error ? (error as NodeJS.ErrnoException).code === "ETIMEDOUT" ? 124 : 1 : 0, signal: null, out, err });
    });
    if (signal) signal.addEventListener("abort", () => child.kill("SIGKILL"));
  });
}

export class DockerSandboxRunner implements SandboxRunner {
  async run(
    files: { path: string; content: string }[],
    command: string,
    timeoutMs: number,
  ): Promise<SandboxRunResult> {
    const started = Date.now();
    const work = await mkdtemp(join(tmpdir(), "stackforge-sandbox-"));
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      for (const file of files) {
        const target = join(work, file.path);
        const parent = target.slice(0, target.lastIndexOf("\\"));
        if (parent) { await (await import("node:fs/promises")).mkdir(parent, { recursive: true }); }
        await writeFile(target, file.content, "utf8");
      }
      const dockerArgs = [
        "run", "--rm",
        "--network", "none",
        "--memory", MEM_LIMIT,
        "--cpus", CPU_QUOTA,
        "--pids-limit", "64",
        "--read-only",
        "--tmpfs", "/tmp",
        "--cap-drop", "ALL",
        "--security-opt", "no-new-privileges",
        "-v", `${work}:/work:ro`,
        "-w", "/work",
        RUN_IMAGE,
        "sh", "-c", command,
      ];
      const { code, out, err } = await runDocker(dockerArgs, controller.signal);
      const useMs = Date.now() - started;
      return {
        exitCode: code ?? 1,
        stdout: out.slice(0, STDOUT_LIMIT),
        stderr: err.slice(0, STDOUT_LIMIT),
        timedOut: controller.signal.aborted,
        usedMs: useMs,
      };
    } finally {
      clearTimeout(timer);
      await rm(work, { recursive: true, force: true });
    }
  }
}
