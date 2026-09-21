# PHASE-02 — Authentication (JWT + cookies httpOnly)

**Estado:** implementada ✅ · **Branch:** `feat/auth` · **Depende de:** PHASE-00 (scaffold) + Prisma `User`.

## Objetivo de la fase

Convertir a StackForge en un producto con identidad real: registrarse, iniciar sesión,
mantener la sesión y proteger rutas. Se implementa con **JWT + cookies httpOnly** (no
session en servidor, según el spec) y **bcrypt** para contraseñas.

El spec establece (resumen §20 - Seguridad/Auth):
- Autenticación con JWT y cookies httpOnly.
- Contraseñas hasheadas (bcrypt), nunca en texto plano.
- Login, logout, refresh de sesión y roles (STUDENT / ADMIN).
- Protección de rutas en frontend y backend.

## Qué se construyó

### Backend (`apps/api`)

| Archivo | Propósito |
| --- | --- |
| `src/auth/auth.module.ts` | Módulo global (JwtModule global, UsersModule) |
| `src/auth/auth.service.ts` | Lógica: register, login, refresh, logout, me + cookies |
| `src/auth/auth.controller.ts` | Endpoints + Swagger + decoradores de cookies |
| `src/auth/guards/` | `jwt-auth.guard.ts` (verifica access), `roles.guard.ts` (roles) |
| `src/auth/decorators/` | `@CurrentUser`, `@Roles`, `@Public` |
| `src/auth/dto/` | `register.dto.ts`, `login.dto.ts` (class-validator) |
| `src/auth/interfaces/` | `auth-user`, `jwt-payload`, `auth-session` |
| `src/auth/auth.constants.ts` | Nombres de cookies + secretos por defecto (dev) |
| `src/users/` | `users.service.ts`, `users.module.ts` (muestra usuario) |
| `test/auth.service.spec.ts` | Tests unitarios de AuthService |

**Endpoints** (`http://localhost:4000/api/auth`)

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/register` | Crea usuario + emite cookies (httpOnly) `201` |
| POST | `/login` | Verifica credenciales + emite cookies `200`/`401` |
| POST | `/refresh` | Rota refresh → nuevo par de tokens `200`/`401` |
| POST | `/logout` | Borra las cookies `204` |
| GET | `/me` | Usuario actual (requiere guard) `200`/`401` |

**Decisiones técnicas**
- **bcryptjs** con 12 rondas; `passwordHash` nunca se expone (DTO seguro `SafeUser`).
- **Cookies httpOnly** (`stackforge_at` / `stackforge_rt`) en lugar de bearer puro:
  `httpOnly`, `sameSite: lax`, `path: /`, `secure` vía `COOKIE_SECURE`.
- **Rotación de refresh**: cada refresh firma un nuevo par y renueva la cookie (reduce
  ventanas de reuso).
- **Roles**: `RolesGuard` + `@Public()` (este último para cuando exista módulo público).
- **DTOs/validación**: `ValidationPipe` global ya con `whitelist + forbidNonWhitelisted`;
  `class-validator` + `class-transformer`; mensajes en español vía `transform`.

**Variables de entorno** (`.env.example` ya documentadas)
```
JWT_ACCESS_SECRET / JWT_REFRESH_SECRET      # secretos JWT
JWT_ACCESS_TTL / JWT_REFRESH_TTL            # vencimiento
COOKIE_SECURE                               # true en producción (https)
```

### Frontend (`apps/web`)

| Archivo | Propósito |
| --- | --- |
| `src/middleware.ts` | Protege `/dashboard` (redirige a login si no hay cookie) |
| `src/lib/api.ts` | Cliente HTTP `api.get/post` con `credentials: include` |
| `src/app/(auth)/login/page.tsx` | Formulario de login (cliente) |
| `src/app/(auth)/register/page.tsx` | Formulario de registro |
| `src/app/dashboard/page.tsx` | Panel protegido (muestra usuario + logout) |

- De momento `/dashboard` solo muestra los datos del usuario y un botón de logout; en
  fases siguientes contendrá el rastro de progreso (UserProgress/Módulos).

## Cómo probar

**Requisito:** Postgres levantado (Docker) y `npm run db:migrate` aplicado.

```bash
cd apps/api
npm run dev  # arranca API en :4000
```

Con un cliente HTTP (o Swagger en http://localhost:4000/api/docs):

1. `POST /api/auth/register` `{ email, password }` → 201, cookies seteadas.
2. `GET /api/auth/me` con cookie → 200, devuelve el usuario.
3. `POST /api/auth/logout` → 204, cookies eliminadas.
4. `GET /api/auth/me` sin cookie → 401.

Frontend: `cd apps/web && npm run dev`, abrir http://localhost:3000, register → dashboard.

## Criterios de aceptación (spec §47-48)

- [x] Registro de usuario con email + password (hash bcrypt).
- [x] Login/logout reales (+ refresh de sesión).
- [x] JWT firmado y verificado; never expone password.
- [x] Guard de autenticación en `/dashboard`.
- [x] Roles (STUDENT/ADMIN) con `@Roles` preparado.
- [x] Pruebas: `npm run test` (unit de AuthService) ✅
- [x] `npm run lint`, `typecheck`, `build` ✅

## Pendientes / siguiente fase

- **Phase 3 — Currículum**: Track → Modulo → Lección → Ejercicio (+ seed). La auth queda
  lista para corresponder cada usuario a su progreso.
- Hook de AI/feedback y almacenamiento de entregas (S3) quedan para fases posteriores.

## Notas

- El cliente web usa el propio proxy de desarrollo de Next (`rewrites` en next.config)
  para reenviar `/api` a la API en `:4000`, evitando CORS en la ruta de auth.
