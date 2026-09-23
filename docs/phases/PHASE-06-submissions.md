# StackForge - Fase 06 - Sistema de envíos (pendiente de Docker)

## Estado
PENDIENTE. Pipeline verde con fases 1-5: 15 tests (3 files), typecheck 0, lint 0, build 0.
Fases 1-5 commiteadas y pusheadas en origin/main.

## Por qué esta pendiente
La fase 06 es el sistema de envíos y evaluación automática: recibe los archivos que el
alumno sube a un proyecto, ejecuta la suite de tests del ejercicio y clasifica el
resultado (PASSED / PARTIAL / NEEDS_WORK).

El bloqueo es real: ejecutar código arbitrario del alumno exige aislamiento (contenedor
Docker con límites de time/CPU/red y disco de solo-lectura). Sin Docker no hay forma
segura de correr esa evaluación, y montar un host-runner sin aislamiento sería inseguro y
falsamente "aprobado". Por eso no se commitearon stubs que no typecheckeaban.

## Plan de implementación cuando haya Docker (WSL2 + Docker Desktop)
1. SandboxRunner interface: run(files, command, timeoutMs) → { exitCode, stdout, stderr, timedOut, usedMs }.
2. HostSandboxRunner: implementación de desarrollo con timeout (NO aislada).
3. DockerSandboxRunner: producción; corre el comando del ExerciseTest en un contenedor
   desechable con límites (mount de archivos, ulimits, red off).
4. SubmissionsService.evaluate: carga archivos del envío, ejecuta el comando del ejercicio,
   guarda status + resultado y marca processedAt.
5. POST /submissions/:id/evaluate → valida propiedad del envío y dispara la evaluación.
6. Correr typecheck + tests + lint + build y commitear una sola vez en verde.

## Hoja de ruta completa
| Fase | Área | Estado |
|------|------|--------|
| 1 | Scaffolding del repo | ✅ |
| 2 | Prisma + schema | ✅ |
| 3 | Auth + usuarios | ✅ |
| 4 | Currículo (mocks) | ✅ |
| 5 | Ejercicios (motores v1/v2, mocks) | ✅ |
| 6 | Envíos + evaluación sandbox | ⏳ pendiente (requiere Docker) |

## ACTUALIZACION (docker disponible) - runner implementado y verificado

Se ha implementado y validado la pieza que faltaba por Docker: la ejecucion
aislada de codigo del alumno.

Nuevos archivos (commit siguiente):
- `apps/api/src/submissions/sandbox/sandbox-runner.interface.ts`: contrato
  `SandboxRunner.run(files, command, timeoutMs) -> SandboxRunResult`
  que devuelve `{ exitCode, stdout, stderr, timedOut, usedMs }` + token SANDBOX_RUNNER.
- `apps/api/src/submissions/sandbox/docker-sandbox.runner.ts`: DockerSandboxRunner
  real. Ejecuta el codigo montado con `docker run --rm`:
  `--network none`, `--read-only`, `--memory`, `--cpus`, `--pids-limit 64`,
  `--cap-drop ALL`, `--security-opt no-new-privileges`, tempdir efimero con
  bind-mount de solo lectura, timeout por AbortController con `SIGKILL`,
  y salida truncada a 64 KiB.

Verificacion en vivo (docker real, no mock):
- `docker run --rm -v <tmp>:/sandbox:ro -w /sandbox --network none
  node:22-alpine node --test hello.test.js` -> `# pass 1  # fail 0`, stdout OK.
- El runner devuelve exitCode/stdout/stderr/usedMs correctos contra ese patan.

Estado del pipeline: typecheck 0, tests 15/15 (3 files), lint y build por confirmar
tras el commit de esta pieza.

QUE FALTA para completar la Fase 06 (queda a tu confirmacion):
1. Registrar SubmissionsModule en AppModule y crear controller/rutas
   (POST /submissions, GET /submissions/mine, POST /submissions/:id/evaluate).
2. SubmissionsService.evaluate usando DockerSandboxRunner con el comando de
   tests del ejercicio y timeoutMs en segundos.
3. Spec E2E del sandbox (se puede correr con docker activo).
4. Commit de la fase completa en verde y push.
