/*
 * page.tsx (ruta "/register")
 * -----------------------------------------------------------------------------
 * Página que muestra la tarjeta de creación de cuenta.
 * El formulario real vive en register-form.tsx y se envuelve en <Suspense>
 * porque usa useSearchParams().
 * -----------------------------------------------------------------------------
 */
import Link from "next/link";
import { Suspense } from "react";
import { RegisterForm } from "./register-form";

/** Contenedor visual (tarjeta) de la pantalla de registro. */
export default function RegisterPage() {
  return (
    <div className="auth-card">
      {/* Logo que enlaza a la portada */}
      <Link className="logo" href="/">
        Stack<span>Forge</span>
      </Link>
      <h1>Crear cuenta</h1>
      <p className="auth-sub">Empieza a construir tu portfolio.</p>
      {/* Suspense necesario para useSearchParams dentro de RegisterForm */}
      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}