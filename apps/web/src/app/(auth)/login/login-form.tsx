"use client";

/*
 * login-form.tsx
 * -----------------------------------------------------------------------------
 * Formulario de inicio de sesión (Client Component).
 * Valida campos mínimos, llama al API y redirige a /dashboard o a la ruta
 * indicada en ?next=. También enlaza al registro.
 * -----------------------------------------------------------------------------
 */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { api, ApiError } from "../../../lib/api";

/** Formulario de login con estado controlado para email, contraseña y errores. */
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); // para leer ?next= de la URL
  // Estados del formulario: valores de los campos, error y carga.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /** Maneja el envío: autentica y redirige, o muestra el mensaje de error. */
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // evita el envío nativo del formulario
    setError(null);
    setLoading(true);
    try {
      await api.login({ email, password });
      // Tras loguear, vuelve a ?next= (si es una ruta interna) o al dashboard.
      const next = searchParams.get("next");
      router.replace(next && next.startsWith("/") ? next : "/dashboard");
    } catch (err) {
      // ApiError trae el mensaje del backend; cualquier otro se muestra genérico.
      setError(err instanceof ApiError ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* Mensaje de error accesible (role="alert") cuando el login falla */}
      {error && <p className="auth-error" role="alert">{error}</p>}

      {/* Campo de email controlado por el estado `email` */}
      <div className="auth-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="ana@ejemplo.com"
        />
      </div>

      {/* Campo de contraseña controlado por el estado `password` */}
      <div className="auth-field">
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
        />
      </div>

      {/* Botón de envío: se deshabilita y cambia el texto mientras carga */}
      <div className="auth-actions">
        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </div>

      {/* Enlace al registro para quienes no tienen cuenta */}
      <p className="auth-alt">
        ¿No tienes cuenta?{" "}
        <Link href="/register">Crea una gratis</Link>
      </p>
    </form>
  );
}