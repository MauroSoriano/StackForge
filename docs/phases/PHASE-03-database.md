# PHASE-03 — Database (schema Prisma)

Fecha: sesión 2026 (commit `cefe67b`).

## QUÉ HICISTE

Schema Prisma completo del dominio en `apps/api/prisma/schema.prisma`,
compatible **Prisma 7 + driver adapters (`PrismaPg`)**:

- **Identity**: `User`, `Profile`, `UserRole` (enum ADMIN/MENTOR/STUDENT).
- **Currículum**: `Track` (sin objetivos?, con `TrackType` JUNIOR/MID/SENIOR),
  `Module` (con `order`), `Lesson` (con `durationMinutes`, `markdown`),
  `Exercise` (con `difficulty`, `maxAttempts`), `ExerciseRequirement`
  (`isMandatory`), `ExerciseTest` (`command`, `description`).
- **Progreso**: `UserProgress` con **unique compuesto
  `userId_trackId_moduleId`** y enum `ModuleState`
  (LOCKED/AVAILABLE/IN_PROGRESS/COMPLETED).
- **Learning**: `StudySession`, `Skill`, `UserSkill`, `GitExercise`,
  `GitLesson`, `PortfolioProject`, `Achievement`, `UserAchievement`.
- **Proyecto/Submission**: `Project`, `ProjectRequirement`, `Submission`,
  `SubmissionStatus` (enum), `SubmissionFile`, `AIFeedback`.
- Fields temporales (`createdAt`, `updatedAt`) + índices en las claves foráneas.

## POR QUÉ

Cada fase posterior (learning engine, exercises, submissions, portfolio)
necesita un esquema estable y versionado. Prisma 7 con driver adapter hace el
client agnóstico al runtime de la BD (conectable a Postgres real más adelante),
y los **nombres exactos** de los unique compuestos y enums ya quedaron fijados
aquí para que el código los use literalmente.

## CÓMO FUNCIONA

- `PrismaModule`/`PrismaService` (`prisma.service.ts`) crea un `Prisma.Client`
  con el adaptador `PrismaPg` leyendo `DATABASE_URL`; usa lazy connect.
- La plataforma generada vive en `src/generated/prisma/` (client tipado) y el
  service se exporta globalmente (`@Global()`).

## CÓMO PROBARLO

```powershell
cd apps/api
npm run typecheck   # client generado + código
npm run build
```

## QUÉ FALTA

- Aplicar el schema a un Postgres real (conectado vía `prisma migrate` /
  `prisma db push`). Pendiente de Docker/WSL2 (BIOS) → ver README de fases.

## QUÉ SIGUE

Leer/escribir sobre este esquema: curriculum (listar tracks/módulos/lecciones),
learning engine (progreso + desbloqueo por secuencia), exercises.
