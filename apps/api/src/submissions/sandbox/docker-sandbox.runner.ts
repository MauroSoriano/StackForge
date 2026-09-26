/**
 * ARCHIVO: docker-sandbox.runner.ts
 * ---------------------------------
 * Implementación del SandboxRunner basada en Docker. Ejecuta código no
 * confiable de los estudiantes dentro de un contenedor efímero y aislado
 * (sin red, con límites de CPU/memoria/PIDs y sin privilegios) para que un
 * envío no afecte al servidor. Limpia siempre el directorio temporal al final.
 */

import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { SandboxRunner, SandboxRunResult } from "./sandbox-runner.interface.js";

// Imagen Docker a usar (configurable por variable de entorno).
const RUN_IMAGE = process.env.STACKFORGE_SANDBOX_IMAGE ?? "node:22-alpine";
// Límite de CPU asignado al contenedor (configurable).
const CPU_QUOTA = process.env.STACKFORGE_SANDBOX_CPUS ?? "1.0";
// Límite de memoria del contenedor (configurable).
const MEM_LIMIT = process.env.STACKFORGE_SANDBOX_MEM ?? "256m";
// Tamaño máximo de stdout/stderr que se devuelve (64 KiB por flujo).
const STDOUT_LIMIT = 64 * 1024;

/**
 * Ejecuta el binario "docker" con los argumentos dados.
 * @param args Argumentos de docker (run ...).
 * @param signal AbortSignal opcional; al abortar se mata el proceso (SIGKILL).
 * @returns Código de salida (124 si expiró el tiempo), señal y salidas.
 */
function runDocker(
  args: string[],
  signal?: AbortSignal,
): Promise<{ code: number | null; signal: NodeJS.Signals | null; out: string; err: string }> {
  return new Promise((resolve) => {
    // Se lanza docker como proceso hijo capturando stdout/stderr como texto.
    const child = execFile("docker", args, { windowsHide: true, encoding: "utf8" }, (error, out, err) => {
      // Si no hubo error -> código 0. Si hubo timeout -> 124. Cualquier otro -> 1.
      resolve({ code: error ? (error as NodeJS.ErrnoException).code === "ETIMEDOUT" ? 124 : 1 : 0, signal: null, out, err });
    });
    // Si el timeout aborta, se fuerza la muerte del proceso docker.
    if (signal) signal.addEventListener("abort", () => child.kill("SIGKILL"));
  });
}

/**
 * Runner concreto que ejecuta el código del envío en un contenedor Docker.
 */
export class DockerSandboxRunner implements SandboxRunner {
  /**
   * Escribe los archivos en un directorio temporal, monta ese directorio en un
   * contenedor Docker aislado y ejecuta el comando. Siempre limpia el temporal.
   * @param files Archivos del envío (ruta relativa + contenido).
   * @param command Comando de shell a ejecutar dentro del contenedor.
   * @param timeoutMs Tiempo máximo antes de abortar la ejecución.
   * @returns Resultado con exitCode, salidas, timeout y duración.
   */
  async run(
    files: { path: string; content: string }[],
    command: string,
    timeoutMs: number,
  ): Promise<SandboxRunResult> {
    // Marca de tiempo inicial para medir la duración.
    const started = Date.now();
    // Directorio temporal único donde se escriben los archivos del envío.
    const work = await mkdtemp(join(tmpdir(), "stackforge-sandbox-"));
    // AbortController que matará el docker cuando venza el temporizador.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      // Crea cada archivo respetando subcarpetas de su ruta relativa.
      for (const file of files) {
        const target = join(work, file.path);
        // Extrae el directorio padre de la ruta destino (puede estar vacío).
        const parent = target.slice(0, target.lastIndexOf("\\"));
        // Crea subcarpetas intermedias si el archivo va en un directorio.
        if (parent) { await (await import("node:fs/promises")).mkdir(parent, { recursive: true }); }
        await writeFile(target, file.content, "utf8");
      }
      // Flags de aislamiento: sin red, límites de memoria/CPU/PIDs, FS de solo
      // lectura, /tmp efímero, sin capabilities y sin privilegios nuevos.
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
      // Ejecuta el contenedor; si se aborta (timeout) se mata el proceso.
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
      // Cancela el temporizador y borra el directorio temporal siempre.
      clearTimeout(timer);
      await rm(work, { recursive: true, force: true });
    }
  }
}
