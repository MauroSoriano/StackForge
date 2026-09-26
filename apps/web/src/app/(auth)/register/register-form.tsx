"use client";

/*
 * register-form.tsx
 * -----------------------------------------------------------------------------
 * Formulario de creación de cuenta (Client Component).
 * Registra al usuario, lo deja logueado y redirige; si el email ya existe
 * (HTTP 409) lo lleva al login conservando el ?next=.
 * -----------------------------------------------------------------------------
 */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { api, ApiError } from "../../../lib/api";

/** Formulario de registro con estado controlado para nombre, email, contraseña y error. */
export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); // para leer ?next= de la URL
  // Estados del formulario.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /** Maneja el envío: crea la cuenta y redirige, o muestra/deriva el error. */
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // `name` se manda solo si el usuario escribió algo.
      await api.register({ email, password, name: name || undefined });
      const next = searchParams.get("next");
      router.replace(next && next.startsWith("/") ? next : "/dashboard");
    } catch (err) {
      // 409 = el email ya está registrado: mandamos a login con el mismo ?next=.
      if (err instanceof ApiError && err.status === 409) {
        const next = searchParams.get("next");
        router.replace(`/login?next=${encodeURIComponent(next && next.startsWith("/") ? next : "/dashboard")}`);
        return;
      }
      setError(err instanceof ApiError ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* Mensaje de error accesible cuando el registro falla */}
      {error && <p className="auth-error" role="alert">{error}</p>}

      {/* Nombre (opcional) */}
      <div className="auth-field">
        <label htmlFor="name">Nombre</label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ana"
        />
      </div>

      {/* Email obligatorio */}
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

      {/* Contraseña obligatoria de al menos 8 caracteres */}
      <div className="auth-field">
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Mínimo 8 caracteres"
        />
      </div>

      <div className="auth-actions">
        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? "Creando cuenta…" : "Crear cuenta"}
        </button>
      </div>

      <p className="auth-alt">
        ¿Ya tienes cuenta? <Link href="/login">Entra aquí</Link>
      </p>
    </form>
  );
}