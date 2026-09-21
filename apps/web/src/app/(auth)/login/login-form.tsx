"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { api, ApiError } from "../../../lib/api";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.login({ email, password });
      const next = searchParams.get("next");
      router.replace(next && next.startsWith("/") ? next : "/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error inesperado");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {error && <p className="auth-error" role="alert">{error}</p>}

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
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
        />
      </div>

      <div className="auth-actions">
        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </div>

      <p className="auth-alt">
        ¿No tienes cuenta?{" "}
        <Link href="/auth/register">Crea una gratis</Link>
      </p>
    </form>
  );
}