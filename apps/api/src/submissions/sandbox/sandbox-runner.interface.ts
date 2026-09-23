export interface SandboxFile {
  path: string;
  content: string;
}

export interface SandboxRunResult {
  exitCode: number;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  usedMs: number;
}

export interface SandboxRunner {
  run(files: SandboxFile[], command: string, timeoutMs: number): Promise<SandboxRunResult>;
}

export const SANDBOX_RUNNER = Symbol("SANDBOX_RUNNER");
