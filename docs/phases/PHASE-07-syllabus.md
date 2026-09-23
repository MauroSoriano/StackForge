# StackForge - Fase 07 - Syllabus completo del curso en texto

## Estado
COMPLETA. Pipeline verde íntegro: typecheck 0, lint 0, tests 15/15, build 0.

## Por qué
Decisión de producto del curso (entorno de aprendizaje, sin videos):
- Todo el contenido debe estar disponible y navegable en la app.
- **Sin videos de momento**: todo texto (tracks → módulos → lecciones en
  markdown → ejercicios), para que el curso sea un entorno 100% de lectura
  y práctica en código.

## Qué se agregó
- `apps/api/src/curriculum/curriculum.service.ts`: método `getSyllabus()` que
  devuelve el curso completo en un solo árbol de texto navegable:
  `tracks[].modules[].lessons[]` (con `markdown`/texto de cada lección) y sus
  ejercicios por lección — sin referencias a videos en ningún punto.
- `apps/api/src/curriculum/curriculum.controller.ts`: ruta pública de lectura
  `GET /curriculum/syllabus` con `@ApiOperation` documentando "todo el curso en
  texto, sin videos" (OpenAPI).
- No hay modelo de video en el schema Prisma ni dependencias de iframe/player:
  verificado con grep sobre el source (0 referencias a youtube/vimeo/.mp4/iframe
  en la app; únicamente aparecen en caché de build de herramientas, no en la app).

## Cómo lo verifiqué
- typecheck/lint/test/build en verde (EXIT 0 en los cuatro). Tests 15/15.
- Grep de `youtube|vimeo|\.mp4|iframe|<video` sobre `apps/*` source: 0 hits en
  la app (solo coincidencias en `.next` cache del build tooling, no en código).
- Lectura del controller en disco confirmando la ruta `@Get("syllabus")` real.

## Cómo probarlo
1. `npm run dev` en `apps/api` (o el comando del workspace).
2. `curl http://localhost:3000/api/curriculum/syllabus` (ruta pública) →
   árbol completo del curso como texto, sin videos.

## Archivos tocados
- `apps/api/src/curriculum/curriculum.service.ts`
- `apps/api/src/curriculum/curriculum.controller.ts`

## Estado del plan de fases
| Fase | Descripción | Estado |
|------|-------------|--------|
| 06 | Envíos + evaluación (DockerRunner) | ✅ Completa |
| 07 | Syllabus completo del curso en texto | ✅ Completa |
