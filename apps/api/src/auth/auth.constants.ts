/**
 * Constantes compartidas de autenticación (cookies y valores por defecto).
 * Los secretos reales vienen de las variables JWT_*_SECRET (ver .env.example).
 */

export const ACCESS_TOKEN_COOKIE = "stackforge_at";
export const REFRESH_TOKEN_COOKIE = "stackforge_rt";

export const DEFAULT_ACCESS_SECRET = "dev-access-secret-change-me";
export const DEFAULT_REFRESH_SECRET = "dev-refresh-secret-change-me";