# Guía de estudio — StackForge

Esta guía explica **cómo está armado el proyecto**, **cómo inspeccionar la base de
datos**, **cómo explorar y probar las APIs** y **en qué orden leer el código**.
Está pensada para que puedas entender de punta a punta qué hace cada pieza.

> Todo el código fuente tiene comentarios explicativos (cabecera del archivo,
> JSDoc sobre clases/funciones y `//` en lo no obvio). Esta guía es el mapa; los
> comentarios en el código son el detalle.

---

## 1. Mapa del proyecto

Monorepo con **npm workspaces**. Toda la app vive en `apps/`:

```
stackforge/
  apps/
    api/     -> Backend: NestJS + Prisma + PostgreSQL   (puerto 4000)
    web/     -> Frontend: Next.js (App Router) + React  (puerto 3000)
  docs/      -> Documentación (incluida esta guía)
  docker-compose.yml   -> Postgres + MinIO para desarrollo local
  package.json         -> scripts que orquestan ambos workspaces
```

### Qué usa cada app

- **api** (`apps/api`): NestJS, Prisma 7 con adapter `@prisma/adapter-pg`,
  JWT en cookies httpOnly, bcrypt para contraseñas, Swagger para documentar.
- **web** (`apps/web`): Next.js App Router, React, `lib/api.ts` como cliente
  HTTP. No usa una librería de estado global: cada página maneja su estado con
  `useState`/`useEffect`.

### Comandos base (desde la raíz `stackforge/`)

```
npm run db:up        # levanta Postgres (y MinIO) con Docker
npm run dev          # levanta api (:4000) y web (:3000) juntos
npm run build        # build de producción de ambos workspaces
npm run lint         # lint de ambos
npm run typecheck    # tipos de ambos
npm run db:migrate   # migraciones de Prisma (workspace api)
npm run db:generate  # genera el cliente Prisma
```

---

## 2. La base de datos

### 2.1. ¿Dónde vive y cómo se conecta?

- El motor es **PostgreSQL 17** levantado por Docker Compose
  (`docker-compose.yml`). Por defecto: usuario `stackforge`, contraseña
  `stackforge`, base `stackforge`, puerto `5432`, contenedor
  `stackforge-postgres`.
- La API se conecta usando **Prisma**. La URL de conexión **no** está en
  `schema.prisma`: vive en `apps/api/.env` como `DATABASE_URL` y la lee
  `apps/api/prisma.config.ts` (con `dotenv`) y el adapter en tiempo de ejecución.
- El cliente Prisma NO es `@prisma/client` clásico: se genera en
  `apps/api/src/generated/prisma` (config del bloque `generator` del schema).
  Por eso el código importa `../../generated/prisma/client.ts`.

### 2.2. El esquema (`apps/api/prisma/schema.prisma`)

Es el **contrato de los datos**. Está comentado modelo por modelo. Los
principales:

| Modelo | Representa |
| --- | --- |
| `User` | La persona. Login, rol, datos de perfil accesibles (teléfono, país, avatar). |
| `Profile` | Datos ampliados del usuario (GitHub, portafolio, bio, timezone). |
| `Track` → `Module` → `Lesson` | La jerarquía del curso (curso → sección → clase). |
| `Exercise` (+ `ExerciseRequirement`, `ExerciseTest`) | La actividad de una clase, sus requisitos y sus tests. |
| `Project` (+ `ProjectRequirement`) | Proyectos entregables (más grandes que un ejercicio). |
| `Submission` (+ `SubmissionFile`) | Una **entrega**: puede ser de un `Project` o de un `Exercise`. Estado, archivo, intentos. |
| `AIFeedback` | Resultado de la revisión por IA (feature pausada). |
| `UserProgress` | Estado del usuario por sección (BLOQUEADA, EN CURSO, COMPLETADA) y %. |
| `LessonProgress` | Qué clases empezó/completó el usuario. |
| `Skill`, `UserSkill`, `StudySession` | Habilidades, niveles y sesiones de estudio. |
| `GitLesson`, `GitExercise` | Contenido específico de Git. |
| `PortfolioProject`, `Achievement`, `UserAchievement` | Portafolio y logros. |

Detalle importante de `Submission`: `projectId` y `exerciseId` son **opcionales**
(uno u otro). Una entrega de actividad usa `exerciseId`; una de proyecto usa
`projectId`. Verás dos índices únicos (`@@unique([projectId, userId, attemptNumber])`
y `@@unique([exerciseId, userId, attemptNumber])`).

### 2.3. Comandos de Prisma (desde `apps/api`)

```
npx prisma validate            # valida el schema sin tocar la base
npx prisma generate            # (re)genera el cliente tipado
npx prisma db push             # aplica el schema a la base (sin migración)
npx prisma migrate dev --name nombre   # crea y aplica una migración
npx prisma migrate deploy      # aplica migraciones pendientes (producción)
npx prisma studio              # ABRE UNA UI WEB PARA VER/EDITAR DATOS
npx prisma format              # formatea el schema
```

> ⚠️ Cuidado con `db push` cuando avisa "data loss" (por ejemplo al agregar un
> índice único). Requiere `--accept-data-loss` y conviene entender qué cambia.

### 2.4. Ver la base de datos en detalle — tres formas

**A. Prisma Studio (la más cómoda para empezar).** Desde `apps/api`:

```
npx prisma studio
```

Abre `http://localhost:5555`. Ahí navegas cada tabla, ves filas, filtras y
editas. Ideal para responder "¿qué hay guardado?".

**B. `psql` dentro del contenedor** (SQL directo):

```
docker exec -it stackforge-postgres psql -U stackforge -d stackforge
```

Dentro de psql, comandos útiles:

```sql
\dt                                   -- lista las tablas
\d "Submission"                       -- describe la tabla (columnas, tipos, índices)
SELECT id, email, role FROM "User";   -- consulta simple
SELECT count(*) FROM "Lesson";        -- cuántas clases hay
SELECT t.title, count(l.id)
FROM "Track" t
JOIN "Module" m ON m."trackId" = t.id
JOIN "Lesson" l ON l."moduleId" = m.id
GROUP BY t.title;                     -- lecciones por curso
\q                                    -- salir
```

> Nota: Prisma nombra las tablas con el nombre del modelo, entre comillas dobles
> porque en Postgres las mayúsculas se respetan (`"User"`, `"Lesson"`).

**C. Una consulta desde Node (sin psql).** Útil para scripts. El proyecto ya trae
ejemplos en `apps/api/prisma/seed-curriculum.cjs`; la idea es:

```js
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("./dist/generated/prisma/client.js");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const filas = await prisma.lesson.findMany({ select: { slug: true, title: true } });
```

### 2.5. Cómo se carga el contenido (seed)

- El contenido educativo vive en `apps/api/prisma/content/*.cjs` (un archivo por
  curso). El loader `apps/api/prisma/seed-curriculum.cjs` lo recorre y hace
  *upsert* (crea si no existe, actualiza si existe).
- Se ejecuta con:

```
node prisma/seed-curriculum.cjs
```

- **Importante (aprendizaje clave):** el seed NO borra todos los ejercicios. Los
  sincroniza por `(lección + título)`. Así, las **entregas** de los usuarios
  (`Submission` que apuntan a un `Exercise` por su `id`) **sobreviven** a un
  re-seed. Si borrara y recreara ejercicios, las entregas se perderían por el
  borrado en cascada.

### 2.6. Migraciones

Mira `apps/api/prisma/migrations/`: cada carpeta es una migración con su
`migration.sql`. Son el **historial del esquema**, igual que los commits lo son
del código. Se versionan en Git.

---

## 3. Las APIs

### 3.1. Cómo está montado un módulo NestJS

Cada feature sigue el mismo patrón de 3 capas:

```
Controller  ->  Service  ->  PrismaService  ->  PostgreSQL
 (HTTP)         (lógica)      (acceso a datos)
```

- **Controller**: define rutas y códigos HTTP; lee `req` (params/body) y delega.
- **Service**: la lógica de negocio; no conoce HTTP.
- **PrismaService**: el cliente de base de datos inyectado.

Lee `apps/api/src/submissions/*` como ejemplo completo (tiene subida de archivos,
reemplazo, borrado y evaluación con sandbox).

### 3.2. Documentación interactiva: Swagger

La API expone Swagger en:

```
http://localhost:4000/api/docs
```

Ahí ves todos los endpoints, sus parámetros y respuestas, y puedes **probarlos**.
Es la forma más rápida de explorar la API.

### 3.3. Lista de endpoints

> Prefijo global: **todos** empiezan con `/api` (por `setGlobalPrefix("api")` en `main.ts`).

| Método | Ruta | Auth | Qué hace |
| --- | --- | --- | --- |
| GET | `/api/health` | No | Estado del servicio (chequea la base). |
| POST | `/api/auth/register` | No | Crea usuario e inicia sesión (setea cookies). |
| POST | `/api/auth/login` | No | Inicia sesión. |
| POST | `/api/auth/refresh` | Cookie | Renueva el access token con el refresh. |
| POST | `/api/auth/logout` | No | Limpia las cookies de sesión. |
| GET | `/api/auth/me` | Cookie | Devuelve el usuario actual (401 si no hay sesión). |
| PATCH | `/api/auth/profile` | Cookie | Actualiza nombre, email, avatar, teléfono, país. |
| GET | `/api/curriculum/tracks` | No | Lista los cursos (con conteo de módulos). |
| GET | `/api/curriculum/tracks/:slug` | No | Curso con módulos, clases y ejercicios. |
| GET | `/api/curriculum/lessons/:id` | No | Detalle de una clase. |
| GET | `/api/curriculum/syllabus` | No | Todo el curso en texto (tracks→módulos→clases→ejercicios). |
| GET | `/api/exercises/lesson/:lessonId` | No | Ejercicios de una clase. |
| GET | `/api/exercises/:id` | No | Ejercicio con requisitos, tests y contexto de la clase. |
| GET | `/api/progress` | Cookie | Progreso del usuario (tracks, módulos, clases). |
| POST | `/api/progress/lessons/:lessonId/start` | Cookie | Marca una clase como iniciada. |
| POST | `/api/progress/lessons/:lessonId/complete` | Cookie | Marca una clase como completada. |
| POST | `/api/progress/tracks/:trackId/modules/:moduleId/start` | Cookie | Inicia un módulo. |
| POST | `/api/progress/tracks/:trackId/modules/:moduleId/complete` | Cookie | Completa un módulo. |
| GET | `/api/submissions/mine` | Cookie | Mis entregas. |
| POST | `/api/submissions/exercises/:exerciseId` | Cookie | Sube un archivo para una actividad (multipart, campo `file`). |
| GET | `/api/submissions/exercises/:exerciseId` | Cookie | Mis entregas de esa actividad. |
| PUT | `/api/submissions/:id/file` | Cookie | Reemplaza el archivo de una entrega. |
| DELETE | `/api/submissions/:id` | Cookie | Elimina una entrega (y su archivo del disco). |
| POST | `/api/submissions/:id/evaluate` | Cookie | Evalúa una entrega en el sandbox. |
| POST | `/api/submissions/:submissionId/mentor/review` | Cookie | Revisión del mentor IA (pausada). |

### 3.4. Autenticación (cómo funciona de verdad)

1. `register`/`login` devuelven los datos del usuario **y** setean dos cookies
   httpOnly: `stackforge_at` (access, corta vida) y el refresh token.
2. El navegador manda esas cookies automáticamente (mismo origen vía proxy).
3. `JwtAuthGuard` protege las rutas que lo usan: lee la cookie, verifica el JWT y
   deja el usuario en `req.user`.
4. `GET /auth/me` responde `401` si no hay sesión válida.
5. `logout` limpia las cookies.

### 3.5. Probar la API por tu cuenta

**Con Swagger**: `http://localhost:4000/api/docs`, botón "Try it out".

**Con curl** (guardando cookies en un archivo para simular sesión):

```bash
# 1) Registrarse (guarda las cookies en cookies.txt)
curl -c cookies.txt -H "Content-Type: application/json" \
  -d '{"email":"ana@test.com","password":"Passw0rd!234","name":"Ana"}' \
  http://localhost:4000/api/auth/register

# 2) Usar la sesión guardada
curl -b cookies.txt http://localhost:4000/api/auth/me

# 3) Subir un archivo a una actividad
curl -b cookies.txt -F "file=@mi-entrega.zip" \
  http://localhost:4000/api/submissions/exercises/<exerciseId>

# 4) Mis entregas de esa actividad
curl -b cookies.txt http://localhost:4000/api/submissions/exercises/<exerciseId>
```

**Desde el navegador** (DevTools → Network): con la app abierta, mirás las
llamadas a `/api/...`. O en la consola:

```js
fetch("/api/auth/me", { credentials: "include" }).then((r) => r.json()).then(console.log);
```

### 3.6. Validación

`main.ts` habilita un `ValidationPipe` global (`whitelist`, `transform`,
`forbidNonWhitelisted`). Los **DTO** (`apps/api/src/auth/dto/*`) usan
`class-validator` (`@IsEmail`, `@MinLength`…). Si el body no cumple, la API
responde `400` con la lista de errores. Es el ejemplo perfecto de "validar en el
servidor".

---

## 4. El frontend

### 4.1. Rutas (App Router de Next.js)

Cada carpeta dentro de `apps/web/src/app` es una ruta:

| Ruta | Archivo | Auth | Qué muestra |
| --- | --- | --- | --- |
| `/` | `app/page.tsx` | No | Landing. |
| `/cursos` | `app/cursos/page.tsx` | No | Catálogo de cursos. |
| `/tracks/[slug]` | `app/tracks/[slug]/page.tsx` | No | Curso por secciones: clases + actividades. |
| `/lessons/[id]` | `app/lessons/[id]/page.tsx` | Sí | Clase (markdown) + ejercicios con "Ver la actividad". |
| `/actividad/[id]` | `app/actividad/[id]/page.tsx` | Sí | Detalle de una actividad y subida/reemplazo/borrado de entregas. |
| `/dashboard` | `app/dashboard/page.tsx` | Sí | Panel: cursos en desplegables, progreso, avatar. |
| `/ajustes` | `app/ajustes/page.tsx` | — | Preferencias (tema claro/oscuro, idioma, notificaciones). |
| `/tu-perfil` | `app/tu-perfil/page.tsx` | Sí | Editar nombre, email, teléfono, país y foto. |
| `/login`, `/register` | `app/(auth)/...` | No | Autenticación. |

### 4.2. Cómo habla con la API

- `next.config.ts` reescribe `/api/:path*` hacia `http://localhost:4000/api/:path*`
  (proxy). Así el navegador cree que la API es del mismo origen y las cookies
  httpOnly viajan solas.
- `src/proxy.ts` (middleware) protege rutas privadas: si no hay cookie de sesión,
  redirige a `/login?next=...`.
- `src/lib/api.ts` es el **cliente**: centraliza la URL base, el manejo de errores
  (`ApiError`), el timeout, y expone funciones (`api.register`, `api.getLesson`,
  `api.uploadExerciseFile`, …). Léelo con sus comentarios: es la pieza que une
  frontend y backend.

### 4.3. Componentes y tema

- `src/components/global-nav.tsx`: barra superior con el **dropdown de usuario**
  (Tu perfil, Ajustes, Dashboard, Cerrar sesión) y el **toggle de tema**. El tema
  se guarda en `localStorage` (`sf-theme`) y se aplica con el atributo
  `data-theme` en `<html>`.
- `src/app/layout.tsx`: incluye un script que aplica el tema **antes** de pintar
  (evita el "flash" al cargar).
- `src/app/globals.css`: todas las variables de tema y los estilos. Los
  comentarios marcan las secciones (tema, nav, tarjetas, dashboard, actividad…).

---

## 5. Flujos clave, paso a paso

### Registro e inicio de sesión
`login-form.tsx` → `api.login()` → `POST /api/auth/login` → `auth.service` valida
y firma JWT → cookies → `router.push("/dashboard")`.

### Ver una clase
`tracks/[slug]` lista las clases → `/lessons/[id]` → carga `GET /curriculum/lessons/:id`
y renderiza el markdown + los ejercicios.

### Entregar una actividad
`/lessons/[id]` → botón **"Ver la actividad"** → `/actividad/[id]` → carga el
ejercicio (`GET /exercises/:id`) y las entregas (`GET /submissions/exercises/:id`)
→ sube el archivo (`POST /submissions/exercises/:id`, multipart). Se guarda en
disco (`apps/api/uploads/activities/`) y queda como `Submission` en estado
`RECEIVED`. Se puede **reemplazar** (`PUT /submissions/:id/file`) o **eliminar**
(`DELETE /submissions/:id`).

### Progreso
En el track, "Marcar completada" llama `POST /progress/lessons/:id/complete`. El
dashboard lee `GET /progress` y muestra el avance por curso/sección.

---

## 6. Orden sugerido para estudiar el código

1. **Datos**: `apps/api/prisma/schema.prisma` (el modelo). Entiende primero esto.
2. **Arranque API**: `apps/api/src/main.ts` y `app.module.ts`.
3. **Auth**: `auth.controller.ts` → `auth.service.ts` → guards/decorators/DTO.
4. **Prisma service**: `prisma/prisma.service.ts`.
5. **Un dominio completo**: `curriculum` (simple) y luego `submissions` (complejo:
   subida de archivos).
6. **Frontend base**: `lib/api.ts` y `components/global-nav.tsx`.
7. **Páginas**: `lessons/[id]` → `actividad/[id]` → `dashboard`.
8. **Estilos**: `globals.css` (por secciones).

Usa los **comentarios del código** como guía mientras lees cada archivo.

---

## 7. Notas y decisiones conocidas

- **Mentor IA / calificador**: pausado por decisión del usuario. El código existe
  (`mentor/`, `AIFeedback`, `POST /submissions/:id/evaluate`) pero no se usa en el
  flujo de la actividad todavía.
- **Archivos de actividad**: se guardan en el disco del servidor
  (`apps/api/uploads/`, ignorado por Git), con `sha256` calculado, para una futura
  revisión.
- **`db push` vs `migrate dev`**: en este entorno se usó `db push` para cambios
  aditivos. Para cambios serios, preferí `migrate dev` (deja historial).
- **No se versionan** `node_modules/`, `dist/`, `.next/`, `uploads/` ni `.env`.

---

## 8. Chuleta de comandos

```bash
# Infraestructura
docker compose up -d postgres           # solo Postgres
docker exec -it stackforge-postgres psql -U stackforge -d stackforge

# Prisma (desde apps/api)
npx prisma studio                       # UI de datos en :5555
npx prisma validate
npx prisma generate
node prisma/seed-curriculum.cjs         # recarga el contenido (no borra entregas)

# Ver la API
start http://localhost:4000/api/docs    # (o abrir en el navegador)

# App
npm run dev                             # api + web
```

Con esto puedes inspeccionar datos, probar la API y leer el código con contexto.
¡Buen estudio!
