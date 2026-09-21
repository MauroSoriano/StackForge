# Arquitectura — Visión por fases

## Visión de conjunto

```
┌─────────────────────────────┐      ┌──────────────────────────────┐
│  apps/web (Next.js 16)      │      │  apps/api (NestJS 12)        │
│  · Landing pública          │ HTTP │  · Auth                      │
│  · Dashboard de progreso    │─────▶│  · Learning Engine           │
│  · Estudio / ejercicios     │ /api │  · Submission + Sandbox      │
│  · AI Mentor                │      │  · AI Provider (multi)       │
│  · Portfolio                │      │  · Admin API                 │
└─────────────────────────────┘      └──────────────┬───────────────┘
                                                    │
                                     ┌──────────────▼───────────────┐
                                     │  PostgreSQL (Prisma 7)       │
                                     │  MinIO / S3 (proyectos)      │
                                     └──────────────────────────────┘
```

## Caminos de datos principales

1. **Contenido**: módulos → lecciones → ejercicios/proyectos (servidos por API,
   renderizados en la web).
2. **Entrega**: el estudiante sube carpeta/.zip → API valida → descomprime en
   sandbox aislado → checks deterministas/tests → revisión IA (solo la info
   necesaria) → feedback → historial de intentos.
3. **Git/GitHub**: tutoriales interactivos; el estudiante ejecuta git en su
   máquina y la web verifica evidencias de forma opcional.
4. **Progreso**: estado por track/módulo (LOCKED → AVAILABLE → IN_PROGRESS →
   COMPLETED) más habilidades, sesiones y logros.

## Decisiones futuras por fase

Cada fase nueva añade su ADR en `docs/decisions/` y actualiza esta vista.