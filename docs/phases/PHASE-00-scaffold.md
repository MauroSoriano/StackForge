# Doc — PHASE 00 / Scaffold Base

## QUÉ SE HIZO

Base del monorepo `stackforge`:

- **Monorepo npm workspaces**: `apps/web` (Next.js), `apps/api` (NestJS).
- **apps/api**: NestJS 12 + TypeScript + Prisma 7 con el schema completo de
  entidades del Prompt Maestro (§32), Swagger, healthcheck y ConfigModule.
- **apps/web**: Next.js 16 + React 19 + Tailwind CSS v4 con la landing del
  spec (§38) como home.
- **Infra local**: `docker-compose.yml` con PostgreSQL 17 y MinIO
  (storage S3-compatible para futuras entregas de proyectos).
- **CI**: `.github/workflows/ci.yml` (lint, typecheck, build, test).
- **Docs**: README, ARCHITECTURE, índice `docs/` según §42, esta fase.

## POR QUÉ

La arquitectura está alineada al "cambio fundamental" del Prompt Maestro:
sin IDE interno, con Git/GitHub y evaluación mixta IA + determinista. El
scaffold deja listas las piezas base para que cada fase (Auth, Learning
Engine, Submission, AI, etc.) se implemente sobre una estructura estable.

## CÓMO FUNCIONA

- **API** (`apps/api`): NestJS con prefijo `/api`, CORS, ValidationPipe y
  Swagger en `/api/docs`. `PrismaService` extiende el `PrismaClient` generado
  por Prisma 7 usando driver adapter `@prisma/adapter-pg`.
- **Prisma 7**: la URL no va en el schema; vive en `prisma.config.ts` (CLI)
  y en el adaptador al instanciar el cliente.
- **Web** (`apps/web`): App Router. La landing es una página Server Component
  sin dependencias de runtime; `src/lib/api.ts` centraliza la URL de la API.
- **TypeScript**: la API compila con `NodeNext` +
  `rewriteRelativeImportExtensions`; los imports relativos usan `.js` y el
  cliente generado (que usa extensiones `.ts`) se importa con `.ts`.

## ARCHIVOS MODIFICADOS/CREADOS

```
package.json  .gitignore  .editorconfig  .env.example  docker-compose.yml
README.md  ARCHITECTURE.md  .github/workflows/ci.yml
docs/README.md  docs/00-prompt-maestro.md  docs/phases/PHASE-00-scaffold.md  docs/phases/README.md
apps/api/package.json  tsconfig.json  tsconfig.build.json  nest-cli.json
  prisma.config.ts  prisma/schema.prisma  vitest.config.ts  eslint.config.mjs
  src/main.ts  src/app.module.ts
  src/prisma/{prisma.module.ts,prisma.service.ts}
  src/health/{health.module.ts,health.controller.ts}
  test/app.spec.ts  .env.example
apps/web/package.json  tsconfig.json  next-env.d.ts  next.config.ts
  postcss.config.mjs  eslint.config.mjs
  src/app/{layout.tsx,page.tsx,globals.css}  src/lib/api.ts
```

## CÓMO PROBARLO

```bash
npm install
npm run typecheck
npm run lint
npm run test          # Vitest en apps/api
npm run build
# infra local (con Docker):
npm run db:up
npm run db:migrate
npm run dev           # web http://localhost:3000 | api http://localhost:4000/api/docs
```

## QUÉ TESTS EXISTEN

- `apps/api/test/app.spec.ts`: el AppModule compila (smoke test con
  Nest Testing module).

## QUÉ FALTA / QUÉ SIGUE

Faltan las fases 2–15 (Auth, Learning Engine, Exercises, Project Submission,
AI Evaluation, Git Learning, Portfolio, Mentor, Admin, Testing E2E, Security,
Deployment, Docs completos). La siguiente fase recomendada es
**Phase 2 Authentication** (JWT + hashing + usuarios) sobre el schema ya
creado.