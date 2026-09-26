/*
 * proxy.ts
 * -----------------------------------------------------------------------------
 * "Proxy" de Next.js (equivalente a un middleware de peticiones): se ejecuta
 * ANTES de renderizar las rutas que coinciden con el matcher de abajo y decide
 * si la petición puede continuar o si hay que redirigir al usuario.
 *
 * Aquí actúa como guardián de sesión: si el usuario no tiene la cookie con el
 * access token, se le manda a /login guardando la ruta original en ?next=...
 * para devolverlo ahí después de iniciar sesión.
 * -----------------------------------------------------------------------------
 */
import { NextResponse, type NextRequest } from "next/server";

// Coincide con ACCESS_TOKEN_COOKIE de apps/api (httpOnly, sameSite)
const ACCESS_TOKEN_COOKIE = "stackforge_at";

/**
 * Se ejecuta ante cada petición que haga match con `config.matcher`.
 * Comprueba la cookie de sesión y, si falta, redirige a /login.
 *
 * @param request Petición entrante de Next (incluye cookies y URL).
 * @returns Una redirección a /login, o el paso a la siguiente capa.
 */
export function proxy(request: NextRequest) {
  // Busca la cookie httpOnly que guarda el access token
  const session = request.cookies.get(ACCESS_TOKEN_COOKIE);
  if (!session) {
    // Sin sesión: clonamos la URL para construir la ruta de /login
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    // Guardamos la ruta original para volver a ella tras iniciar sesión
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  // Hay sesión: dejamos pasar la petición normalmente
  return NextResponse.next();
}

// Rutas protegidas por este proxy (por ahora solo el panel /dashboard)
export const config = {
  matcher: ["/dashboard"],
};