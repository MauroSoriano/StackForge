"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { Markdown } from "../../../components/markdown";

interface ExerciseItem {
  id: string;
  title: string;
  description: string | null;
  instructions: string;
  order: number | null;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  maxAttempts: number | null;
  _count: { tests: number };
}

interface LessonItem {
  id: string;
  slug: string;
  title: string;
  markdown: string;
  order: number;
  durationMinutes: number | null;
  exercises: ExerciseItem[];
}

interface ModuleItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  order: number;
  estimatedHours: number | null;
  lockedByDefault: boolean;
  lessons: LessonItem[];
}

interface TrackDetail {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  type: "JUNIOR" | "MID" | "SENIOR";
  order: number;
  modules: ModuleItem[];
}

const TYPE_LABEL: Record<TrackDetail["type"], string> = {
  JUNIOR: "Junior",
  MID: "Mid",
  SENIOR: "Senior",
};

const DIFF_LABEL: Record<ExerciseItem["difficulty"], string> = {
  BEGINNER: "Principiante",
  INTERMEDIATE: "Intermedio",
  ADVANCED: "Avanzado",
};

export default function TrackPage({ params }: { params: Promise<{ slug: string }> }) {
  const [track, setTrack] = useState<TrackDetail | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params
      .then((p) => api.getTrack(p.slug))
      .then((data) => {
        setTrack(data);
        setOpenSection(data.modules[0]?.id ?? null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado"));
  }, [params]);

  return (
    <main className="container" style={{ paddingTop: "6vh" }}>
      <nav>
        <Link className="logo" href="/">
          Stack<span>Forge</span>
        </Link>
        <div className="navlinks">
          <Link href="/cursos">Cursos</Link>
          <Link href="/login">Ingresar</Link>
        </div>
      </nav>

      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}

      {track && (
        <>
          <section className="hero">
            <div className="badge">
              <span className="dot" /> Curso · {TYPE_LABEL[track.type]}
            </div>
            <h1 style={{ fontSize: "clamp(30px, 5vw, 52px)" }}>{track.title}</h1>
            {track.description && <p>{track.description}</p>}
          </section>

          {track.modules.map((mod) => {
            const isOpen = openSection === mod.id;
            const activities = mod.lessons.flatMap((l) => l.exercises);
            return (
              <section
                key={mod.id}
                className="card"
                style={{ marginBottom: 14, padding: 0, overflow: "hidden" }}
              >
                <button
                  type="button"
                  className="sec-head"
                  onClick={() => setOpenSection(isOpen ? null : mod.id)}
                  aria-expanded={isOpen}
                >
                  <span className="tag">Sección {mod.order}</span>
                  <span className="sec-title">{mod.title}</span>
                  <span className="sec-cheat">
                    {isOpen ? "▲" : "▼"} · {mod.lessons.length} clases
                  </span>
                </button>

                {isOpen && (
                  <div className="sec-body">
                    {mod.description && <p className="sec-desc">{mod.description}</p>}

                    <h3 className="mod-title">Clases de la sección</h3>
                    {mod.lessons.map((lesson) => (
                      <article key={lesson.id} className="clase">
                        <div className="clase-head">
                          <h4>
                            Clase {lesson.order}: {lesson.title}
                          </h4>
                          {lesson.durationMinutes != null && (
                            <span className="state partial">~{lesson.durationMinutes} min</span>
                          )}
                        </div>
                        <Markdown text={lesson.markdown} />
                      </article>
                    ))}

                    <h3 className="mod-title">Actividad de la sección</h3>
                    {activities.length === 0 && <p>Esta sección aún no tiene actividad.</p>}
                    {activities.map((ex) => (
                      <article key={ex.id} className="card actividad">
                        <span className="tag">{DIFF_LABEL[ex.difficulty]}</span>
                        <h4>{ex.title}</h4>
                        {ex.description && <p>{ex.description}</p>}
                        <p className="md-instructions">{ex.instructions}</p>
                        <p>
                          <span className="state pass">{ex._count.tests} tests</span>
                          {ex.maxAttempts != null && (
                            <span className="state partial"> hasta {ex.maxAttempts} intentos</span>
                          )}
                        </p>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </>
      )}
    </main>
  );
}