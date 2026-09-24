"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { api, ApiError } from "../../../lib/api";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.register({ email, password, name: name || undefined });
      const next = searchParams.get("next");
      router.replace(next && next.startsWith("/") ? next : "/dashboard");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        const next = searchParams.get("next");
        router.replace(`/login?next=${encodeURIComponent(next && next.startsWith("/") ? next : "/dashboard")}`);
        return;
      }
      setError(err instanceof ApiError ? err.message : "Error inesperado");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {error && <p className="auth-error" role="alert">{error}</p>}

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