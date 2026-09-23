# StackForge - Fase 08 - Mentor IA (feedback automático, OpenRouter GRATIS)

## Estado
**PLANEADA → IMPLEMENTÁNDOSE (confirmada la gratuidad).** El usuario eligió
**OpenRouter con SOLO modelos gratuitos** (`openrouter/free` router o modelos
`:free`); costo **$0 permanente**, verificado gratis contra la doc oficial de
OpenRouter (ago-2026). No se implementó ningún modelo "barato" ni de pago.

## Restricción GLOBAL (decidida, no negociable)
- **Solo modelos GRATUITOS.** Prohibido modelos "baratos"/"de bajo costo"/con
  tarjeta o que cobren por token. La latencia no importa; el costo DEBE ser $0.
- **Verificación de gratuidad ANTES de usar cada modelo.** Ya hecho para
  OpenRouter free (ago-2026, doc oficial): el router `openrouter/free` y los
  modelos con sufijo `:free` no cuestan nada. Antes de fijar cualquier otro
  proveedor como fallback, se confirma su gratuidad contra su doc oficial y se
  registra fecha+URL en este documento.
- Decisión actual: **UN solo proveedor (OpenRouter free) como default**; el code
  no incluye tags de "pay-as-you-go".

## Objetivo
Dar a cada envío (fase 06) un **feedback automático de mentor** en texto
(structurado en `AIFeedback`), coherente con el curso 100% texto. El Mentor:
1. Lee el `submission` + sus `files` + las `requirements` del `project` (fase 06
   ya guardó `result` real del sandbox — **no se re-evalúa en Docker**).
2. Arma un prompt de REVISIÓN en texto.
3. Llama a **OpenRouter `openrouter/free`** con `fetch` (sin dep nuevas).
4. Guarda el feedback estructurado en `AIFeedback` (provider=FREE, modelName,
   verdict, overallScore, requirementResults, codeQuality, problemsFound,
   recommendations, nextSteps, raw, latencyMs).

## Diseño atado al schema REAL (verificado en disco)
### Tabla destino: `AIFeedback` (existe en schema) + enums `AIProvider`/`MentorMode`
Campos que se escriben:
| Campo | Valor |
|---|---|
| `provider` | `AIProvider.FREE` (router gratuito) |
| `modelName` | `String?` — slug del modelo gratis usado p. ej. "openrouter/free" |
| `status` | `"ok"` o `"error"` |
| `verdict` | `SubmissionStatus?` cruzado con la fase 06 |
| `overallScore` | `Int?` 0-100 |
| `requirementResults` | `Json?` — por-criterio |
| `codeQuality` | `String?` |
| `problemsFound` | `Json?` |
| `recommendations` | `Json?` |
| `nextSteps` | `String?` |
| `raw` | `Json?` |
| `latencyMs` | `Int?` |

### Fixture de datos para el prompt (evita N+1)
```ts
const submission = await prisma.submission.findUnique({
  where: { id },
  include: {
    files: { select: { path: true, content: true } },
    project: {
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        requirements: {
          select: { id: true, description: true, acceptanceCriteria: true, kind: true, order: true },
          orderBy: [{ order: "asc" }, { id: "asc" }],
        },
      },
    },
  },
});
```

### Endpoint (fase 08)
- `POST /submissions/:id/mentor/review` → genera/guarda feedback en modo REVIEW.

### Prompt al modelo (resumen, 100% texto)
"Eres mentor de un curso 100% texto. Proyecto: {title}. Requisitos: {list}.
Código del alumno: {files}. Resultado de tu evaluación (Docker, fase 06):
exitCode={}, timedOut={}. Devuelve JSON: {verdict, overallScore,
requirementResults[], codeQuality, problemsFound[], recommendations[],
nextSteps}."

## Criterio de aceptación (gate, mismo de fases previas)
- typecheck 0, lint 0, tests (suite 15 existentes + nuevo spec Mentor ≥ 2), build 0.
- Un solo commit por fase en verde, luego push. Doc en
  `docs/phases/PHASE-08-ai-mentor.md` + fila actualizada en el índice.

## Proveedores CONFIRMADOS GRATIS (verificado ago-2026)
| Proveedor | Cómo consumirlo gratis | URL doc | Confirmado |
|---|---|---|---|
| OpenRouter | router `openrouter/free` + modelos `:free` — costo $0, sin pago | https://openrouter.ai/docs/guides/routing/routers/free-router | ✅ 2026-08 |

## QUÉ FALTA (pendiente de implementación)
1. `MentorModule` + `MentorService.review(submissionId)` leyendo submission+files+
   requirements y modelName configurado; `MentorController` (POST antes visto);
   registrar en `AppModule`.
2. Spec E2E (mock del runner/provider), lint/typecheck/test/build verdes, doc,
   commit, push.

## Historial
- 2026-09-12: fase 08 creada como plan con restricción "solo gratuitos"; tras
  confirmación del usuario se fijó **OpenRouter free** como único proveedor.
