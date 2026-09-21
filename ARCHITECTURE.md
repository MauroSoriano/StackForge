# StackForge — Architecture

Documento vivo de arquitectura. Actualizar tras cada fase.

## Principios (del Prompt Maestro)

1. **Sin IDE interno**: el estudiante usa VS Code, terminal, Git y GitHub.
   La plataforma solo da instrucciones, ejercicios, requisitos, tests,
   evaluación IA y feedback.
2. **Aprendizaje práctico**: aprender → practicar → desarrollar local →
   subir proyecto → recibir evaluación → corregir → siguiente proyecto.
3. **Git/GitHub honesto**: NO uploads, commits ni push automáticos.
   La plataforma enseña a hacerlo manualmente.
4. **Evaluación mixta**: determinista + tests + análisis estático + IA.
   La IA no es la única fuente de verdad.
5. **Seguridad por defecto**: los proyectos subidos son código arbitrario y
   se procesan en sandbox aislado. Nunca se ejecutan con privilegios del host.
6. **IA multi-provider**: interfaz abstracta `AIProvider` para no acoplarse a
   un único modelo; prioriza modelo gratuito con fallback.

## Stack

| Capa      | Tecnología                                      | Cartera     |
| --------- | ----------------------------------------------- | ----------- |
| Frontend  | Next.js 16 + React 19 + TypeScript + Tailwind 4 |          |
| Backend   | NestJS 12 + TypeScript                          |          |
| Database  | PostgreSQL (Prisma 7 + @prisma/adapter-pg)      |          |
| Storage   | S3-compatible (MinIO local)                     |          |
| Testing   | Vitest (unit/integration), Playwright (E2E, futuro) |          |
| Infra     | Docker + docker compose                          |          |
| AI        | Interfaz `AIProvider` multi-provider (fase 7)   |          |

## Monorepo

- npm workspaces con `apps/web` y `apps/api`.
- NodeNext + `rewriteRelativeImportExtensions` en la API: los imports relativos
  usan extensión `.js` y el cliente Prisma generado (que usa extensiones `.ts`)
  se importa con `.ts` explícito.
- Prisma 7: la URL de conexión NO va en el schema; vive en `prisma.config.ts`
  (Migrate/CLI) y se inyecta como driver adapter (`PrismaPg`) en el
  `PrismaClient` en runtime.

## Vistas por fase

Ver [`docs/README.md`](docs/README.md) — se rellenan los documentos por fase
a medida que se implementa.