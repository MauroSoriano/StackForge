/*
 * page.tsx (ruta "/login")
 * -----------------------------------------------------------------------------
 * Página que muestra la tarjeta de inicio de sesión.
 * El formulario real vive en login-form.tsx y se envuelve en <Suspense> porque
 * usa useSearchParams(), que requiere suspenso en el App Router.
 * -----------------------------------------------------------------------------
 */
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

/** Contenedor visual (tarjeta) de la pantalla de login. */
export default function LoginPage() {
  return (
    <div className="auth-card">
      {/* Logo que enlaza a la portada */}
      <Link className="logo" href="/">
        Stack<span>Forge</span>
      </Link>
      <h1>Entrar</h1>
      <p className="auth-sub">Continúa donde lo dejaste.</p>
      {/* Suspense es necesario para useSearchParams dentro de LoginForm */}
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}