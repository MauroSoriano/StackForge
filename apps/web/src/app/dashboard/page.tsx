"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, type SafeUser } from "../../lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    api
      .me()
      .then(setUser)
      .catch(() => {
        router.replace("/auth/login");
      });
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await api.logout();
    } finally {
      router.replace("/");
    }
  }

  return (
    <main className="container" style={{ paddingTop: "8vh" }}>
      <nav>
        <Link className="logo" href="/">
          Stack<span>Forge</span>
        </Link>
        <button className="navbtn" type="button" onClick={handleLogout} disabled={loggingOut}>
          {loggingOut ? "Saliendo…" : "Salir"}
        </button>
      </nav>

      <section className="hero">
        <div className="badge">
          <span className="dot" /> Sesión iniciada
        </div>
        <h1 style={{ fontSize: "clamp(30px, 5vw, 52px)" }}>
          Hola, {user?.name || user?.email}
        </h1>
        {user && (
          <span className="dash-role">{user.role === "ADMIN" ? "Administrador" : "Estudiante"}</span>
        )}
        <p>
          La ruta completa de 12 semanas empieza a construirse en la siguiente
          fase (catálogo de tracks). Esta área es privada.
        </p>
        <div className="actions">
          <Link className="btn primary" href="/#ruta">
            Ver la ruta →
          </Link>
        </div>
      </section>
    </main>
  );
}