# PHASE-05 — Exercises (API de ejercicios)

Fecha: sesión 2026 (commit `563f101`).

## QUÉ HICISTE

API dedicada de ejercicios sobre el currículum (que ya embebía ejercicios en
cada lección). Nuevo feature module `Exercises` en `apps/api`:

- `ExercisesService`
  - `listForLesson(lessonId)` → valida la lección (404 si no existe) y lista
    sus ejercicios ordenados por `order`, con el **conteo de tests** de cada uno.
  - `getExercise(id)` → detalle con **requirements** y **tests** ordenados;
    `NotFoundException` si el ejercicio no existe.
- `ExercisesController` (`@Controller("exercises")`, público)
  - `GET /exercises/lesson/:lessonId`
  - `GET /exercises/:id`
  - anotado con Swagger (`@ApiTags("exercises")`, `@ApiOperation`, `@ApiParam`).
- `ExercisesModule` registrado en `app.module.ts`.

## POR QUÉ

La fase 4 (curriculum/learning engine) dejó los ejercicios solo embebidos dentro
de la lección. Esta fase los expone como **recurso propio y navegable**, de modo
que el front pueda listarlos y abrir cada uno como pantalla independiente con sus
requisitos y sus tests de validación. Es el prerrequisito de lectura para la
futura fase de resolución/ejecución (que requiere Docker/Postgres, pendiente).

## CÓMO FUNCIONA

Patrón idéntico a Curriculum/Progress: `ExercisesModule` importa `PrismaModule`,
expone `ExercisesController` + `ExercisesService` vía el contenedor Nest, y
`ExerciseService` inyecta `PrismaService` y delega en los modelos Prisma
(`lesson.findUnique`, `exercise.findMany/findUnique`) incluyendo las relaciones
`requirements` y `tests` ordenadas para el detalle.

## ARCHIVOS MODIFICADOS

```
apps/api/src/exercises/exercises.service.ts     (nuevo)
apps/api/src/exercises/exercises.controller.ts  (nuevo)
apps/api/src/exercises/exercises.module.ts      (nuevo)
apps/api/src/app.module.ts                      (wiring ExercisesModule)
```

## CÓMO PROBARLO

```powershell
cd apps/api
npm run typecheck
npm run test
npm run lint
npm run build
```

Todos en verde (pipeline completo).

## QUÉ TESTS EXISTEN

- `apps/api/test/exercises.service.spec.ts` (vitest):
  - lista los ejercicios de una lección
  - 404 si la lección no existe
  - devuelve el detalle con requisitos y tests
  - 404 si el ejercicio no existe
- Suite total: 15 tests en verde (auth + curriculum/app + exercises).

## QUÉ FALTA

- Capitulo Docker/Postgres para E2E real (mismo bloqueo de las fases previas:
  Docker Desktop requiere WSL2/BIOS; documentado). Hasta entonces todo se
  valida con mocks de `PrismaService` + typecheck/build/lint.

## QUÉ SIGUE

- Fase 6: resolución/envío de ejercicios (`Submission`/`SubmissionFile` ya están
  en el schema) y ejecución de los `ExerciseTest`. Requiere la BD real.
- Después: evaluación IA (7), git/github (8), portfolio (9), mentor AI (10),
  admin (11), testing (12), seguridad (13), despliegue (14).
