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

## Proveedores/modelos candidatos (gratuidad VERIFICADA — ver tabla arriba)
1. **OpenRouter — router `openrouter/free` + sufijo `:free`** → ✅ CONFIRMADO
   gratis (ago 2026). Default propuesto por robustez (rota modelos, sin elección
   manual, $0). Es el único en latencia variable de verdad, que a esta app no
   le importa.
2. **Gemini API (Google AI Studio) free tier** → ✅ CONFIRMADO gratis (ago 2026);
   input/output sin cargo. Fallback.
3. **Groq free tier** → ✅ CONFIRMADO gratis (ago 2026); 30 RPM + techos diarios.
   Fallback (rápido, pero techos bajos).

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

## Proveedores CONFIRMADOS como GRATIS (verificado agosto 2026)
| Proveedor | Cómo consumirlo gratis | URL doc oficial | Confirmado (fecha) | Notas |
|---|---|---|---|---|
| **OpenRouter** | Router `openrouter/free` o modelo `:free` (p. ej. `meta-llama/llama-3.2-3b-instruct:free`) — costo **$0**, sin tarjeta | https://openrouter.ai/docs/guides/routing/routers/free-router y https://openrouter.ai/docs/guides/routing/model-variants/free | ✅ 2026-08 | El router rota a modelos gratuitos automáticamente según capacidades (tooling, struct output). Límites de tasa más bajos y latencia variable (no importa: la prioridad sigue siendo $0). Opcional `:free` por modelo para no depender del azar. |
| **Gemini API** | Free tier de Google: input/output **gratis de cargo** (no cobra por token) hasta límites de tasa del modelo gratis | https://ai.google.dev/gemini-api/docs/pricing (Free Tier: "Free of charge") | ✅ 2026-08 | La página de pricing oficial lista input/output gratis (Gemini 3.x free tier). Caveats: empieza en Free Tier (no te pide tarjeta); tasa limitada por día; si vinculas una key de pago NO lo hagas (mantener gratis puro). |
| **Groq** | Free tier: API key gratis sin pago; 30 RPM y techos diarios (~1.000 RPD, tokens/día según modelo) | https://console.groq.com/docs/rate-limits | ✅ 2026-08 | Confirmado gratis (sin tarjeta). Ojo: límites por organización, no por key; vigilar headers `x-ratelimit-remaining-*` y manejar 429. Tier free = sin SLA. |

### Decisión de default (propuesta — falta confirmación del usuario)
- **Proveedor principal**: **OpenRouter `openrouter/free`** — un solo punto de
  integración, costo $0, rota automáticamente entre modelos gratuitos (el más
  robusto para no quedar atado a un solo modelo que se caiga).
- **Fallbacks gratuitos**: **Gemini free tier** y **Groq free tier**.
- Regla que se mantiene: cada `modelName` que entre al código sigue estando
  *confirmado gratis* contra la doc oficial (ya hecho: agosto 2026, URLs arriba).
- (Necesito "tu confirmación" para fijar one proveedor base + fallbacks antes de
  escribir el `MentorService`. No implemento ninguno sin decir cuál se usa.)

## Historial modificado
- Fase 08: proveedores verificados gratis (OpenRouter/Gemini/Groq, ago-2026) y
  default propuesto `openrouter/free` + fallbacks, sin tocar código (sigue ⏳ Plan).

## Historial
- Fase 08 creada como plan (2026-09-12): restricción "solo gratuitos + verificar
  antes de usar", diseño atado al schema real (AIFeedback/MentorMode), gate.
