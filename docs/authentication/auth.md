# Autenticación — StackForge

Detalle de decisión e implementación. Ver también
[`docs/phases/PHASE-02-authentication.md`](../phases/PHASE-02-authentication.md)
para el registro de fase y las instrucciones de prueba.

## Resumen

StackForge usa **JWT + cookies httpOnly**. Al iniciar sesión se emiten dos cookies
httpOnly (`stackforge_at` y `stackforge_rt`), rotadas en cada `/refresh`, y se limpian
en `/logout`. No hay sesiones en el servidor ni almacenamiento de tokens: el único dato
persistente relevante para auth es el `passwordHash` (bcrypt) en la tabla `User`.

## Por qué cookies httpOnly y no bearer puro

- El spec exige sesiones durables y seguras en el navegador.
- Las cookies `httpOnly` no son legibles por JavaScript (mitiga XSS).
- `sameSite: lax` evita CSRF por cross-site; los endpoints usan verbos/métodos
  (POST) y el frontend defiende la ruta, así que el riesgo CSRF es bajo.
- Alternativa evaluada (y descartada para la v1): bearer token en `Authorization`.
  Habría requerido gestionar el token en el cliente (memoria/localStorage), lo que
  choca contra el requisito de sesión durable sin exponer secretos al JS.

## Flujo

| Paso | Cliente → API                        | Respuesta |
| ---- | ------------------------------------ | --------- |
| 1    | `POST /auth/register` `{email,password}` | 201 + cookies |
| 2    | `POST /auth/login`                  | 200 + cookies |
| 3    | `GET  /auth/me` (guarde)            | 200 SafeUser |
| 4    | `POST /auth/refresh`                | 200, rota cookies |
| 5    | `POST /auth/logout`                 | 204, limpia cookies |
| 6    | `GET  /auth/me` (sin cookie)        | 401 |

## Seguridad aplicada

- **bcrypt** (12 rondas) para `passwordHash`; nunca se expone (`SafeUser`).
- **Dos secretos JWT** (access/refresh) separados; el payload distingue `type`.
- **Rotación** de refresh token en cada `/refresh`.
- **DTOs** con `class-validator` (email válido, password ≥ 8), `ValidationPipe`
  global con `whitelist` + `forbidNonWhitelisted`.
- **`JwtAuthGuard`** para proteger rutas; **`@Roles`** + `RolesGuard` reservados para
  STUDENT/ADMIN.

## Variables de entorno

```
JWT_ACCESS_SECRET          # firma del access token
JWT_REFRESH_SECRET         # firma del refresh token
JWT_ACCESS_TTL / JWT_REFRESH_TTL
COOKIE_SECURE=true         # en producción (https)
```

## Pendiente

- Rate limiting sobre `/auth/login` y `/auth/register` (seguridad/hardening).
- Distinción completa de `ADMIN` con el panel de administración (PHASE 11).
