# StackForge - Fase 06 - Sistema de envíos (evaluación con Docker)

## Estado
COMPLETA. Fase 06 terminada y verificada con Docker real. Pipeline verde íntegro:
typecheck 0, lint 0, tests 15/15 (3 files), build 0. Commits pusheados a origin/main.

## Qué se implementó en esta fase (fases 1-5 ya estaban verdes)
- Módulo de envíos (NestJS):
  - `apps/api/src/submissions/submissions.module.ts`: registra `SubmissionsService`,
    `SubmissionsController` y el provider del sandbox (`SANDBOX_RUNNER` →
    `DockerSandboxRunner`).
  - `apps/api/src/submissions/submissions.controller.ts`: rutas
    `GET /submissions/mine`, `POST /submissions` y `POST /submissions/:id/evaluate`
    (autenticadas con JWT).
  - `apps/api/src/submissions/submissions.service.ts`: mis envíos, `submit` (crea
    submission + archivos con attemptNumber autoincremental) y `evaluate` (ejecuta
    los archivos del alumno con el runner del sandbox, clasifica el resultado y
    guarda status + result en Prisma).
- Sandbox (aislamiento real con Docker):
  - `apps/api/src/submissions/sandbox/sandbox-runner.interface.ts`: contrato
    `SandboxRunner.run(files, command, timeoutMs)` → `SandboxRunResult` con
    `{ exitCode, stdout, stderr, timedOut, usedMs }` + token `SANDBOX_RUNNER`.
  - `apps/api/src/submissions/sandbox/docker-sandbox.runner.ts`: `DockerSandboxRunner`
    real. Ejecuta el código del alumno con `docker run` aislado:
    `--network none`, `--read-only`, `--memory`, `--cpus`, `--pids-limit`,
    `--cap-drop ALL`, `--security-opt no-new-privileges`; tmpdir efímero con
    bind-mount de solo-lectura, timeout con `AbortController` + SIGKILL, y salida
    truncada a 64 KiB.
- Wiring en `apps/api/src/app.module.ts`: `SubmissionsModule` importado y registrado.

## Verificación (Docker real, no mock)
Pipeline tras el wiring: typecheck 0 errores, lint 0, tests 15/15 (3 files), build 0.
El runner fue probado en vivo contra el motor Docker local (docker run real con
node:22-alpine, red apagada, read-only y bind-mount ro) devolviendo exit code y
salida correctos.

## Prueba rápida (E2E manual)
1. Levantar la api: `docker compose up` o `npm run start:dev` en `apps/api`.
2. `POST /auth/login` con un usuario alumno para obtener el token JWT.
3. `POST /submissions` (header `Authorization: Bearer <token>`) con
   `{ projectId, files: [{ path, content }] }`.
4. `POST /submissions/:id/evaluate` → la api monta los archivos en un contenedor
   Docker aislado y responde `{ status, result: { exitCode, ... } }`.

## Notas de producto
- **Curso 100% en texto, sin videos (por ahora)**: toda la oferta del curso debe
  estar disponible dentro de la app como textos y ejercicios (el entorno de
  aprendizaje ejecuta código real en el sandbox). No se requieren videos en esta
  etapa; se prioriza el contenido escrito interactivo.
- La documentación de las fases 01-06 está en `docs/phases/` (índice en
  `docs/phases/README.md`).

## Hoja de ruta completada
| Fase | Área | Estado |
|------|------|--------|
| 1 | Scaffolding monorepo | ✅ |
| 2 | Autenticación JWT | ✅ |
| 3 | Currículo (tracks/módulos/lecciones) | ✅ |
| 4 | Motor de aprendizaje (progreso) | ✅ |
| 5 | Ejercicios + tests | ✅ |
| 6 | Envíos + evaluación con sandbox Docker | ✅ |
