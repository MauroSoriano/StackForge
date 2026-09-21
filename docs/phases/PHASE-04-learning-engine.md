# PHASE-04 — Learning Engine (progreso y desbloqueo por secuencia)

Fecha: sesión 2026 (commit `163f7b5`).

## QUÉ HICISTE

Motor de progreso (`ProgressModule`) sobre el currículum:

- `GET /api/progress` → `getMyProgress(userId)`: tracks con su `_count` de
  módulos + lista `userProgress` del usuario (estado, %, fecha de completado).
- `POST /api/progress/tracks/:trackId/modules/:moduleId/start` →
  `startModule`: valida el módulo contra su track y lo crea/actualiza en
  `IN_PROGRESS` con `progress: 0`.
- `POST /api/progress/tracks/:trackId/modules/:moduleId/complete` →
  `completeAndUnlock`: en **una transacción** marca el módulo `COMPLETED`
  (100%, `completedAt`) y desbloquea el siguiente de la secuencia
  (`AVAILABLE`) usando el `order` del módulo.

Reglas de validación en `assertModule`:
- módulo inexistente → `NotFoundException(404)`.
- módulo que no pertenece a ese track → `BadRequestException(400)` con mensaje.

## POR QUÉ

Sin un estado persistente por usuario sobre el currículum no hay forma de medir
avance ni de encadenar el desbloqueo (cada track se cursa en orden). Con
`completeAndUnlock` en `$transaction` se garantiza que completar y desbloquear
queden atómicos: no puede quedar un módulo completado sin su sucesor habilitado.

## CÓMO FUNCIONA

- Uso del enum `ModuleState` (LOCKED/AVAILABLE/IN_PROGRESS/COMPLETED) y la unique
  compuesta `userId_trackId_moduleId` de `UserProgress` (upsert atómico).
- `assertModule(trackId, moduleId)` consulta `module.findUnique` y valida
  `trackId`; se usa tanto en `start` como en `complete`.
- `completeAndUnlock` corre dentro de `prisma.$transaction(tx => ...)`: upsert
  del módulo actual y `findFirst` del siguiente por `order > actual` para
  desbloquearlo. Devuelve `{ completed, unlocked }`.

## ARCHIVOS

```
apps/api/src/progress/progress.service.ts   (nuevo)
apps/api/src/progress/progress.controller.ts(nuevo)
apps/api/src/progress/progress.module.ts    (nuevo)
apps/api/src/app.module.ts                  (registro de ProgressModule)
```

## CÓMO PROBARLO

```powershell
cd apps/api
npm run typecheck
npm run test      # 20 tests en verde
npm run lint
npm run build
```

## QUÉ FALTA

- Los specs `progress.service.spec.ts` se descartaron durante la sesión por
  corruptelas del harness CLI (payloads multi-línea mezclados). El service,
  controller y módulo **quedan cubiertos por typecheck + build + lint** y por
  los 20 tests de los specs estables (auth, curriculum, app). Pendiente:
  reescribir el spec si se retoma, siempre con payload pequeño.

## QUÉ SIGUE

- Fase 5 — Exercises: API de ejercicios por lección (ve PHASE-05-exercises.md).
- Las fases que requieren Postgres real (E2E y ejecución de tests) siguen
  bloqueadas por Docker (WSL2/BIOS); documentado en la raíz.
