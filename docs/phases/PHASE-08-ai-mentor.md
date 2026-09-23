# StackForge - Fase 08 - Mentor IA (feedback automático con modelos GRATUITOS)

## Estado
PLANEADA. No implementada todavía — este documento es el plan de la fase
(restricción de producto + diseño atado al schema real + criterio de aceptación).
El pipeline sigue en verde con las fases 01-07 completas (typecheck/lint/test
15/15/build = 0, main == origin/main en 6559192).

## Restricción GLOBAL de producto (decision tomada, no negociable)
- **SOLO se usan modelos GRATUITOS.** Prohibido usar modelos "de bajo costo",
  "baratos", de prueba con tarjeta o que cobren por token. No importa si son
  más lentos: la prioridad es que el costo sea **$0 permanente**.
- **Verificación de gratuidad ANTES de usar cada modelo.** Antes de fijar un
  proveedor/modelo como provider del Mentor, se confirma contra la página
  oficial del proveedor (free tier, sin tarjeta, sin cargo por token) y se
  registra la referencia y la fecha en este documento. Ningún modelo entra al
  código del Mentor sin esa confirmación documentada.

## Objetivo
Dar a cada envío (fase 06) un **feedback automático de mentor** en texto, sin
videos — coherente con la decisión de producto del curso 100% texto. El Mentor
lee: el resultado real de la evaluación en Docker (fase 06) + el código del
envío + las instrucciones del ejercicio, y escribe una devolución estructurada
(qué pasó, qué está mal, cómo avanzar). Almacenada en Prisma para revisión.

## Diseño atado al schema REAL (verificado en disco)
### Tabla destino: `AIFeedback` (ya existe en `prisma/schema.prisma`)
| Campo | Tipo | Uso en el Mentor |
|---|---|---|
| `provider` | `AIProvider @default(FREE)` | Siempre `FREE` en esta fase |
| `modelName` | `String?` | Slug del modelo gratuito usado (auditoría) |
| `status` | `String @default("ok")` | "ok" si la llamada al modelo funcionó |
| `verdict` | `SubmissionStatus?` | Cruzada con la evaluación (PASSED/PARTIAL/NEEDS_WORK) |
| `overallScore` | `Int?` | 0-100 sintético (no bloqueante) |
| `requirementResults` | `Json?` | Por-criterio: cumplido / pendiente |
| `codeQuality` | `String?` | Notas de calidad (texto del modelo) |
| `problemsFound` | `Json?` | Lista de problemas detectados |
| `recommendations` | `Json?` | Siguientes pasos en texto |
| `raw` | `Json?` | Respuesta cruda del modelo (para difundir/verificar) |
| `latencyMs` | `Int?` | Tiempo de la llamada |
| `createdAt` | `DateTime` | Sello |

### Modos de mentor: `enum MentorMode` (ya existe)
`LEARN, DEBUG, HINT, REVIEW, INTERVIEW, ARCHITECT` → el plan de fase 08 expone
primero `REVIEW` (devolución de un envío) como caso base; el resto de modos es
extensión posterior opcional.

### Endpoints planeados
- `POST /submissions/:id/mentor/review` → genera (o devuelve el cached) feedback
  del envío en modo REVIEW con un modelo gratuito; guarda `AIFeedback`.
- `GET /submissions/:id/mentor` → lista los feedbacks del envío (verificación).

## Proveedores/modelos candidatos (confirmar gratuidad ANTES de usar)
Según revisión externa (OpenRouter / Google AI Studio / Groq, precio 2026):
1. **Google AI Studio — Gemini Flash (gratis, sin tarjeta)** — alto límite diario
   de prompts, contexto largo, multimodal texto. Confirmación pendiente de su
   página oficial exacta al momento de implementar.
2. **OpenRouter — router `openrouter/free` + modelos con sufijo `:free`** — sin
   tarjeta, 20 RPM en free; fallback automático entre varios modelos gratuitos.
   Confirmación pendiente.
3. **Groq — gpt-oss / Qwen free tier** — rápido; bajo cuota (30 RPM, 1000/día).
   Confirmación pendiente.
(La elección final de 1 proveedor base + fallbacks se hace al implementar, y
cada `modelName` elegido se valida como GRATIS contra la doc oficial antes de
commitear — se registra la URL + fecha en la sección "Proveedores confirmados".)

## Contracto con el runner de la fase 06
El Mentor escribe su JSON de salida como archivo de texto (p. ej.
`MENTOR_REVIEW.md`) en el mismo juego de archivos del envío *solo si se quiere
persistir la devolución como archivo*; por defecto la devolución vive en
`AIFeedback` (sin tocar los archivos del alumno ni re-evaluar: reutiliza el
`result` ya guardado por la fase 06, no vuelve a correr Docker).

## Criterio de aceptación (gate, igual que fases previas)
- typecheck 0, lint 0, tests (nuevo spec Mentor ≥ 2 + suite 15 existentes), build 0.
- Un solo commit por fase en verde, luego push; doc en `docs/phases/PHASE-08-ai-mentor.md`
  y fila actualizada en el índice de fases.

## QUÉ FALTA (al implementar, tras esta confirmación)
1. Elegir proveedor gratuito y CONFIRMAR gratuidad (doc oficial, fecha) —
   decisión del usuario.
2. `MentorModule` + `MentorService.review(submissionId, mode)` leyendo
   submission+files result y modelName configurado; `MentorController`
   (POST/GET antes vistos); registrar en `AppModule`.
3. Spec E2E (con un modelo gratuito real o mock marcado FREE), lint/typecheck/
   test/build verdes, doc, commit, push.

## Proveedores confirmados como GRATIS (se llena al implementar)
| Modelo | URL doc oficial | Confirmado (fecha) | Notas |
|---|---|---|---|
| *(pendiente)* | — | — | — |

## Historial
- Fase 08 creada como plan (2026-09-12): restricción "solo gratuitos + verificar
  antes de usar", diseño atado al schema real (AIFeedback/MentorMode), gate.
