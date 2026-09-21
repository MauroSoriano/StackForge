# Prompt Maestro — Plataforma Fullstack Learning

Resumen estructurado y fiel de los requisitos del proyecto original. Es la
fuente de verdad de producto; las fases lo implementan gradualmente.

## Visión

Aplicación web educativa que funciona como: plataforma educativa, roadmap
Fullstack lineal, sistema de ejercicios prácticos, proyectos progresivos,
evaluador automático mediante IA, mentor de aprendizaje, sistema de progreso,
entrenador de Git/GitHub, portfolio educativo y sistema de documentación.

### Cambio fundamental

NO hay IDE interno. El estudiante usa VS Code, terminal, Git y GitHub. La
plataforma solo proporciona instrucciones, ejercicios, proyectos, requisitos,
tests/criterios, revisión IA, feedback, progreso, documentación y guía de
Git/GitHub.

## Objetivo principal

Una persona que no sabe programar entra, sigue una ruta lineal y pasa de
"no sé programar" a "puedo desarrollar y explicar una app Fullstack", y luego
a "puedo diseñar sistemas y tomar decisiones de arquitectura".

- Ruta intensiva de ~12 semanas → base sólida para competir por puestos Junior.
- NO afirmar que 12 semanas garantizan empleo.

## Filosofía de aprendizaje

Aprender → practicar → desarrollar localmente → subir proyecto →
recibir evaluación → corregir → aprender Git → commit → GitHub → siguiente.

## Entrega de ejercicios

- `SUBMIT PROJECT`: carpeta (si el navegador lo permite) o archivo comprimido
  (ZIP principal; RAR opcional si el backend lo procesa con seguridad).
- Acepta proyectos completos (src, package.json, README, tests).

## Procesamiento

Recibir → validar tamaño/extensión → analizar estructura → descomprimir en
sandbox → detectar tecnología/package.json → analizar código → comparar contra
requisitos → ejecutar validaciones permitidas → enviar lo necesario a IA →
obtener evaluación → feedback. NUNCA ejecutar proyectos en el servidor
principal (sandbox/container aislado).

## Seguridad de proyectos subidos

Aislamiento con containers/filesystem aislado, límites de CPU/memoria/timeout/
tamaño, restricciones de red, borrado automático del entorno temporal. Sin
privilegios del servidor, sin acceso al host. Documentar la arquitectura.

## Evaluación IA

- Funcionalidad central, abstracta: interfaz `AIProvider` con implementaciones
  `FreeProvider`, `OpenAIProvider`, `GeminiProvider`, `LocalProvider`,
  `OpenRouterProvider`. Configurable por variables de entorno.
- Priorizar modelo gratuito: comprobar disponibilidad, límites, cuota,
  rate limits; si cae, mensaje apropiado. No asumir gratuidad permanente.
- Qué evalúa: requisitos funcionales y técnicos, estructura, código
  (legibilidad, organización, nombres, duplicación, complejidad), errores,
  seguridad básica, git readiness, documentación.

## Evaluación NO solo con IA

Combinar: DETERMINISTIC CHECKS + TESTS + STATIC ANALYSIS + AI REVIEW.
Cada ejercicio genera: REQUIREMENTS (checklist), CODE QUALITY, PROBLEMS
DETECTED, RECOMMENDATIONS, NEXT STEP. Resultado PASS / PARTIAL / NEEDS WORK.

## Anti-IA-permisiva

Criterios explícitos por ejercicio: requirements, acceptance criteria,
forbidden shortcuts, expected technologies, optional improvements.
Distinguir OBLIGATORIO vs OPCIONAL.

## Feedback educativo

Explicar qué está bien/mal, por qué, cómo investigarlo, qué concepto repasar.
No dar soluciones completas inmediatamente.

## Iteraciones

Submission #1 → feedback → correcciones → Submission #2 → … → PASS.
Guardar historial con intentos (Attempt 1/2/3).

## Progresión lineal

Module 1 → Module 2 → Module 3 (CURRENT) → Module 4 (LOCKED). Desbloquear
requiere requisitos; se puede revisitar contenido anterior.

## Junior Track (12 semanas)

- **Semanas 1–2**: fundamentos, computadora, internet, HTTP, terminal, VS Code,
  Git, GitHub, lógica, JS básico, debugging. Proyectos: portfolio personal,
  landing responsive, calculadora, to-do, quiz. HTML/CSS/JS/Git.
- **Semanas 3–4**: JS avanzado + TypeScript (ES6+, modules, async, fetch, APIs,
  JSON, NPM, TS types/generics). Proyecto: API Dashboard.
- **Semanas 5–6**: React + TypeScript + Next.js (components, props, state,
  hooks, forms, validation, routing, consumo de APIs, accesibilidad,
  responsive). Proyecto: Task Management App.
- **Semanas 7–9**: Backend Node.js + TypeScript + NestJS (HTTP, REST,
  controllers, services, middleware, validation, auth/authz, JWT, hashing,
  cookies, CORS, seguridad, documentación de API), con fundamentos de Express.
  Proyecto: REST API profesional.
- **Base de datos**: PostgreSQL, SQL, Prisma. Enseñar SQL directamente;
  no depender solo del ORM.
- **Semanas 10–12**: proyecto Fullstack completo (Next.js + NestJS +
  PostgreSQL) con auth, CRUD, relaciones, validación, testing, Docker,
  documentación. Todo local + subida para evaluación.

## Rutas avanzadas

- **Mid**: clean architecture, SOLID, design patterns, TS/React/Node avanzado,
  PostgreSQL avanzado, Redis, caching, queues, WebSockets, testing avanzado,
  Docker, CI/CD, cloud, observabilidad, performance, security.
- **Senior**: arquitectura de software, sistemas distribuidos, escalabilidad,
  microservicios, event-driven, message brokers, sharding/replicación,
  observabilidad, cloud architecture, reliability, security, system design,
  liderazgo técnico, code review, decisiones de arquitectura.

## Git como centro

Enseñar `git init/status/add/commit/log/branch/switch/merge/remote/push/pull/
clone` de forma progresiva, pidiendo ejecutarlos. GitHub: tutoriales
interactivos para crear repos, conectar remoto, commits y push — SIN
automatizarlo. Guía de commits: Conventional Commits, commits pequeños y
descriptivos (`feat:`, `fix:`, `docs:`). Ejercicios especiales de branch,
merge, conflictos y push (evidencias o análisis de proyecto exportado).

## Portfolio

Sección MY PORTFOLIO manejada por el usuario: GitHub URL, live demo,
descripción, tecnologías. Verificación opcional de que el repo existe.

## AI Mentor

Modos: LEARN, DEBUG, HINT, REVIEW, INTERVIEW, ARCHITECT. Evita resolver los
ejercicios; prioriza pregunta → análisis → pista → explicación → solución solo
si es pedagógicamente apropiado.

## Progreso y dashboard

- Progreso total, por track, módulos, ejercicios, proyectos, intentos,
  habilidades, horas, streak, proyectos aprobados, GitHub skills, siguiente objetivo.
- Dashboard: WELCOME BACK, current track/module/lesson, next exercise, latest
  submission, AI feedback, git progress, portfolio progress.

## Base de datos (entidades mínimas)

User, Profile, Track, Module, Lesson, Exercise, ExerciseRequirement,
ExerciseTest, Project, ProjectRequirement, Submission, SubmissionFile,
AIFeedback, UserProgress, Skill, UserSkill, StudySession, GitLesson,
GitExercise, PortfolioProject, Achievement. (Ver `apps/api/prisma/schema.prisma`.)

## Storage y privacidad

- Storage seguro: object storage, escaneo malware, límites de tamaño,
  expiración, cifrado, control de acceso, política de retención.
- No enviar todo el proyecto a la IA: detectar secretos, ignorar node_modules,
  .git, binarios, .env. Nunca enviar API keys, passwords, tokens, private keys.
- Exclusiones automáticas: `node_modules/`, `.git/`, `.env`, `.env.local`,
  `dist/`, `build/`, `coverage/`, binarios; configurables.

## Admin

Usuarios, tracks, módulos, lecciones, ejercicios, requisitos, proyectos,
tests, criterios de evaluación, estadísticas, proveedores de IA.

## UI

Dark mode como diseño principal; estética profesional, minimalista y
developer-focused (inspiración: GitHub, Linear, Vercel, VS Code). No infantil.

## Landing

Hero: "Learn Fullstack. Build Real Projects. Become a Developer."
Subtítulo: "Aprende desarrollando proyectos reales en tu propio entorno y
recibe feedback automático de IA mientras construyes tu portfolio."
Secciones: learning by building, 12-week Junior Track, AI project review,
Git/GitHub learning, real projects, portfolio, mid/senior roadmap, FAQ, CTA.

## Stack recomendado

Frontend: Next.js + React + TypeScript + Tailwind CSS · Backend: Node.js +
NestJS + TypeScript · DB: PostgreSQL + Prisma · Storage: S3-compatible ·
Testing: Vitest/Jest + React Testing Library + Playwright · Infra: Docker ·
AI: multi-provider. Cambios con razón técnica deben explicarse.

## Testing / CI-CD / Docs

- Unit + Integration + E2E reales.
- CI/CD: lint, typecheck, tests, build, pipeline documentado.
- Documentación completa en `/docs` (architecture, frontend, backend, database,
  authentication, ai, project-submission, github-learning, git, storage,
  security, testing, deployment, education, admin, api, decisions) más
  README/CONTRIBUTING/SECURITY/ARCHITECTURE/CHANGELOG.
- Documentar el sistema de IA: selección de modelo, prompt de evaluación,
  procesamiento de archivos, protección de secretos, interpretación, fallbacks,
  rate limits.

## Fases

Phase 0 Requirements + Architecture · 1 Project Setup · 2 Authentication ·
3 Database · 4 Learning Engine · 5 Exercises · 6 Project Submission ·
7 AI Evaluation · 8 Git/GitHub Learning · 9 Portfolio · 10 AI Mentor ·
11 Admin · 12 Testing · 13 Security · 14 Deployment · 15 Documentation.

## Criterio de terminado

Una funcionalidad termina solo cuando tiene: backend, frontend, database (si
aplica), validation, error handling, security, tests, documentation, UI responsive.

## Reglas NO

No crear IDE interno · no subir/commitear/pushear automáticamente a GitHub ·
no ejecutar código del usuario sin sandbox · no guardar secrets · no confiar
solo en IA · no resolver ejercicios automáticamente · no botones falsos · no
funcionalidades críticas como TODO.

## Principio final

La plataforma es el "mentor + roadmap + evaluador", pero NO sustituye las
herramientas profesionales que el desarrollador debe aprender. Objetivo:
al terminar el Junior Track el estudiante construyó proyectos, domina
Git/GitHub práctico y demuestra su trabajo públicamente.