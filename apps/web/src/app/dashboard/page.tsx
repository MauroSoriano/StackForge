"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, type SafeUser } from "../../lib/api";

interface LessonBrief {
  id: string;
  slug: string;
  title: string;
  order: number;
  durationMinutes: number | null;
}

interface ModuleBrief {
  id: string;
  slug: string;
  title: string;
  order: number;
  lessons: LessonBrief[];
}

interface SyllabusTrack {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  type: "JUNIOR" | "MID" | "SENIOR";
  order: number;
  modules: ModuleBrief[];
}

const TYPE_LABEL: Record<SyllabusTrack["type"], string> = {
  JUNIOR: "Junior",
  MID: "Mid",
  SENIOR: "Senior",
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [tracks, setTracks] = useState<SyllabusTrack[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    api
      .me()
      .then((u) => {
        setUser(u);
        return api.getSyllabus();
      })
      .then((data) => setTracks(Array.isArray(data) ? data : [data]))
      .catch((err) => {
        if (err instanceof Error && "status" in err && (err as { status: number }).status === 401) {
          router.replace("/login");
        } else {
          setError(err instanceof Error ? err.message : "Error inesperado");
        }
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
    <main className="container" style={{ paddingTop: "6vh" }}>
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
          <span className="dash-role">
            {user.role === "ADMIN" ? "Administrador" : "Estudiante"}
          </span>
        )}
        <p>
          Elige una lección y estudia el tema. Cada lección tiene su contenido
          y ejercicios.
        </p>
      </section>

      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}

      {tracks === null && !error && <p>Cargando la ruta…</p>}

      {tracks?.map((track) => (
        <section className="timeline" key={track.id}>
          <div className="track-head">
            <span className="tag">{TYPE_LABEL[track.type]}</span>
            <h2>{track.title}</h2>
            {track.description && <p>{track.description}</p>}
          </div>
          {track.modules.map((mod) => (
            <div key={mod.id} style={{ marginBottom: 18 }}>
              <h3 className="mod-title">Módulo {mod.order}: {mod.title}</h3>
              {mod.lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  className="card lesson-card"
                  href={`/lessons/${lesson.id}`}
                >
                  <span className="state pass">Lección {lesson.order}</span>
                  <span className="lesson-title">{lesson.title}</span>
                  {lesson.durationMinutes != null && (
                    <span className="state partial">~{lesson.durationMinutes} min</span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </section>
      ))}
    </main>
  );
}