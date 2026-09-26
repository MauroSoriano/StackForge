/**
 * ARCHIVO: sandbox-runner.interface.ts
 * ------------------------------------
 * Contrato del "sandbox" que ejecuta código de forma aislada. Define las
 * formas de datos (entrada/salida) y el token de inyección para que el
 * servicio de entregas no dependa de una implementación concreta (Docker).
 */

/**
 * Un archivo de código dentro del sandbox.
 * - path: ruta relativa dentro del directorio de trabajo del contenedor.
 * - content: contenido de texto (no binario) del archivo.
 */
export interface SandboxFile {
  path: string;
  content: string;
}

/**
 * Resultado de ejecutar un comando en el sandbox.
 * - exitCode: código de salida del proceso (0 = éxito).
 * - stdout / stderr: salidas estándar y de error capturadas.
 * - timedOut: true si se agotó el tiempo límite y se mató el proceso.
 * - usedMs: milisegundos que tardó la ejecución.
 */
export interface SandboxRunResult {
  exitCode: number;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  usedMs: number;
}

/**
 * Interfaz que implementa cualquier ejecutor de sandbox (p. ej. Docker).
 * Recibe los archivos, el comando a correr y un timeout en milisegundos.
 */
export interface SandboxRunner {
  run(files: SandboxFile[], command: string, timeoutMs: number): Promise<SandboxRunResult>;
}

/**
 * Token de inyección de dependencias de NestJS. Se usa en los módulos para
 * asociar esta interfaz con una implementación concreta (DockerSandboxRunner).
 */
export const SANDBOX_RUNNER = Symbol("SANDBOX_RUNNER");
