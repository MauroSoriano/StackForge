"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { GlobalNav } from "../../../components/global-nav";

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

interface LessonDetail {
  id: string;
  slug: string;
  title: string;
  markdown: string;
  order: number;
  durationMinutes: number | null;
  module: {
    id: string;
    title: string;
    slug: string;
    track: { slug: string; title: string };
  };
  exercises: ExerciseItem[];
}

const DIFF_LABEL: Record<ExerciseItem["difficulty"], string> = {
  BEGINNER: "Principiante",
  INTERMEDIATE: "Intermedio",
  ADVANCED: "Avanzado",
};

function Markdown({ text }: { text: string }) {
  return (
    <div className="markdown">
      {text.split("\n").map((line, i) => {
        const t = line.trim();
        const h = t.match(/^(#{1,3})\s+(.*)$/);
        if (h) {
          const level = h[1].length;
          return level === 1 ? (
            <h3 key={i}>{h[2]}</h3>
          ) : level === 2 ? (
            <h3 key={i}>{h[2]}</h3>
          ) : (
            <h4 key={i}>{h[2]}</h4>
          );
        }
        if (/^[-*]\s+/.test(t)) {
          return (
            <p key={i} className="md-bullet">
              {t.replace(/^[-*]\s+/, "• ")}
            </p>
          );
        }
        if (/^```/.test(t)) {
          return (
            <pre key={i}>
              <code>{t.replace(/^```\s*$/, "").trim()}</code>
            </pre>
          );
        }
        if (t === "") return <p key={i}>&nbsp;</p>;
        return (
          <p key={i}>
            {t.replace(/`([^`]+)`/g, "<code>$1</code>").replace(/[*_]+([^*_]+)[*_]+/g, "$1")}
          </p>
        );
      })}
    </div>
  );
}

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .me()
      .then(() => params.then((p) => api.getLesson(p.id)))
      .then(setLesson)
      .catch((err) => {
        if (err instanceof Error && "status" in err && (err as { status: number }).status === 401) {
          router.replace("/login");
        } else {
          setError(err instanceof Error ? err.message : "Error inesperado");
        }
      });
  }, [router, params]);

  return (
    <main className="container lesson" style={{ paddingTop: "6vh" }}>
      <GlobalNav />

      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}

      {lesson && (
        <>
          <section className="hero">
            <div className="badge">
              <span className="dot" /> {lesson.module.track.title} · {lesson.module.title}
            </div>
            <h1 style={{ fontSize: "clamp(26px, 4vw, 44px)" }}>{lesson.title}</h1>
            {lesson.durationMinutes != null && (
              <p className="state partial">~{lesson.durationMinutes} min</p>
            )}
          </section>

          <Markdown text={lesson.markdown} />

          <section>
            <h2>Ejercicios</h2>
            {lesson.exercises.length === 0 && <p>Esta lección aún no tiene ejercicios.</p>}
            {lesson.exercises.map((ex) => (
              <div key={ex.id} className="card">
                <span className="tag">{DIFF_LABEL[ex.difficulty]}</span>
                <h3>{ex.title}</h3>
                {ex.description && <p>{ex.description}</p>}
                <p className="md-instructions">{ex.instructions}</p>
                <div className="exercise-actions">
                  <span className="state pass">{ex._count.tests} {ex._count.tests === 1 ? "test" : "tests"}</span>
                  <Link className="btn primary" href={`/actividad/${ex.id}`}>
                    Ver la actividad
                  </Link>
                </div>
              </div>
            ))}
          </section>
        </>
      )}
    </main>
  );
}