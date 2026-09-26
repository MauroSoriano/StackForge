/**
 * Constantes compartidas de autenticación (cookies y valores por defecto).
 * Los secretos reales vienen de las variables JWT_*_SECRET (ver .env.example).
 */

// Nombre de la cookie httpOnly que guarda el access token (corta duración)
export const ACCESS_TOKEN_COOKIE = "stackforge_at";
// Nombre de la cookie httpOnly que guarda el refresh token (larga duración)
export const REFRESH_TOKEN_COOKIE = "stackforge_rt";

// Secret de desarrollo para firmar/verificar access tokens (si no hay JWT_ACCESS_SECRET)
export const DEFAULT_ACCESS_SECRET = "dev-access-secret-change-me";
// Secret de desarrollo para firmar/verificar refresh tokens (si no hay JWT_REFRESH_SECRET)
export const DEFAULT_REFRESH_SECRET = "dev-refresh-secret-change-me";