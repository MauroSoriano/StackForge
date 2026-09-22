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
