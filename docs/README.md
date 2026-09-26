# Documentación — StackForge

La documentación se organiza siguiendo el §42 del Prompt Maestro. Marca cada
documento como ✅ (completo), 🟡 (parcial) o ⬜ (planeado) según avance.

## Indice

| Ruta                       | Contenido                                                    | Estado |
| -------------------------- | ------------------------------------------------------------ | ------ |
| `GUIA-DE-ESTUDIO.md`       | Guía para estudiar el código, la base de datos y las APIs    | ✅   |
| `00-prompt-maestro.md`     | Requisitos del proyecto (resumen estructurado del Prompt Maestro) | ✅   |
| `architecture/overview.md` | Visión de arquitectura por fases                             | 🟡     |
| `phases/`                  | Explicación de cada fase (PHASE-XX)                          | 🟡     |
| `frontend/`                | Diseño UI, rutas, estado, integración con API                | ⬜     |
| `backend/`                 | Módulos NestJS, REST, autenticación                          | ⬜     |
| `database/`                | Schema Prisma, migraciones, índices                          | 🟡     |
| `authentication/`          | JWT, hashing, sesiones, autorización                         | ⬜     |
| `ai/`                      | Provider abstracto, prompts, evaluación, privacidad          | ⬜     |
| `project-submission/`      | Subida, processamiento, sandbox, S3                          | ⬜     |
| `github-learning/`         | Educación Git/GitHub, ejercicios de commits                  | ⬜     |
| `git/`                     | Guías de Git, conventional commits, ejercicios              | ⬜     |
| `storage/`                 | Política de retención, cifrado, escaneo                      | ⬜     |
| `security/`                | Aislamiento, secretos, exclusions automáticas                | ⬜     |
| `testing/`                 | Unit / integration / E2E                                     | 🟡     |
| `deployment/`              | CI/CD, Docker, variables de entorno                          | ⬜     |
| `education/`               | Ruta lineal, desbloqueo, progreso, logs                      | ⬜     |
| `admin/`                   | Panel de administración                                      | ⬜     |
| `api/`                     | Endpoints, DTOs, validación                                  | ⬜     |
| `decisions/`               | ADRs (por qué existe cada decisión)                          | ⬜     |

## Fases

Ver [`phases/README.md`](phases/README.md) para el registro de fases
terminadas y pendientes.