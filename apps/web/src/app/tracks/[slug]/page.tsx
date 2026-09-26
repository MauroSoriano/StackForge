"use client";

/*
 * page.tsx (ruta "/tracks/[slug]")
 * -----------------------------------------------------------------------------
 * Detalle de un curso: muestra sus secciones (módulos) en acordeón, las clases
 * (con su markdown) y las actividades de cada sección. Si hay sesión, permite
 * marcar clases como completadas y registra el inicio de módulo.
 * Es Client Component por el uso de estado, efectos y eventos.
 * -----------------------------------------------------------------------------
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { Markdown } from "../../../components/markdown";
import { GlobalNav } from "../../../components/global-nav";

// Forma de un ejercicio dentro de una lección.
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

// Forma de una lección (clase).
interface LessonItem {
  id: string;
  slug: string;
  title: string;
  markdown: string;
  order: number;
  durationMinutes: number | null;
  exercises: ExerciseItem[];
}

// Forma de un módulo/sección del curso.
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

// Forma del curso completo con sus módulos.
interface TrackDetail {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  type: "JUNIOR" | "MID" | "SENIOR";
  order: number;
  modules: ModuleItem[];
}

// Etiquetas legibles para el tipo de curso.
const TYPE_LABEL: Record<TrackDetail["type"], string> = {
  JUNIOR: "Junior",
  MID: "Mid",
  SENIOR: "Senior",
};

// Etiquetas legibles para la dificultad de un ejercicio.
const DIFF_LABEL: Record<ExerciseItem["difficulty"], string> = {
  BEGINNER: "Principiante",
  INTERMEDIATE: "Intermedio",
  ADVANCED: "Avanzado",
};

/**
 * Página de detalle del curso.
 *
 * @param params Promesa con el parámetro dinámico `slug` de la URL.
 */
export default function TrackPage({ params }: { params: Promise<{ slug: string }> }) {
  // Datos del curso cargado.
  const [track, setTrack] = useState<TrackDetail | null>(null);
  // Id del módulo abierto en el acordeón (null = todos cerrados).
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Set con los ids de las lecciones ya completadas (búsqueda rápida).
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  // null = aún comprobando sesión; true/false = hay o no sesión.
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  // Id de la lección que se está marcando como completada (para deshabilitar el botón).
  const [marking, setMarking] = useState<string | null>(null);

  // Resuelve el slug y carga el curso; abre la primera sección por defecto.
  useEffect(() => {
    params
      .then((p) => api.getTrack(p.slug))
      .then((data) => {
        setTrack(data);
        setOpenSection(data.modules[0]?.id ?? null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado"));
  }, [params]);

  // Carga el progreso del usuario para saber qué clases ya completó.
  // Si falla (sin sesión), se marca loggedIn = false.
  useEffect(() => {
    api
      .getMyProgress()
      .then((p) => {
        setCompleted(new Set(p.lessonProgress.filter((l) => l.completedAt).map((l) => l.lessonId)));
        setLoggedIn(true);
      })
      .catch(() => setLoggedIn(false));
  }, []);

  /**
   * Abre/cierra una sección del acordeón. Si hay sesión, registra el inicio
   * de la primera clase del módulo (sin bloquear la navegación si falla).
   */
  async function handleOpenSection(moduleId: string | null) {
    setOpenSection(moduleId);
    if (moduleId && loggedIn && track) {
      try {
        const mod = track.modules.find((m) => m.id === moduleId);
        const firstLessonId = mod?.lessons[0]?.id;
        if (firstLessonId) await api.startLesson(firstLessonId);
      } catch {
        // el progreso no debe romper la navegación
      }
    }
  }

  /** Marca una clase como completada y refresca el progreso local. */
  async function handleComplete(lessonId: string) {
    if (!loggedIn) return; // solo usuarios con sesión pueden completar
    setMarking(lessonId);
    try {
      await api.completeLesson(lessonId);
      const p = await api.getMyProgress();
      setCompleted(new Set(p.lessonProgress.filter((l) => l.completedAt).map((l) => l.lessonId)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el progreso");
    } finally {
      setMarking(null);
    }
  }

  return (
    <main className="container" style={{ paddingTop: "6vh" }}>
      <GlobalNav links={[{ href: "/cursos", label: "Cursos" }]} />

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

          {/* Recorre cada módulo y lo renderiza como una sección acordeón */}
          {track.modules.map((mod) => {
            const isOpen = openSection === mod.id; // ¿esta sección está abierta?
            // Todos los ejercicios de todas las clases del módulo.
            const activities = mod.lessons.flatMap((l) => l.exercises);
            return (
              <section
                key={mod.id}
                className="card"
                style={{ marginBottom: 14, padding: 0, overflow: "hidden" }}
              >
                {/* Cabecera clickeable del acordeón (abre/cierra la sección) */}
                <button
                  type="button"
                  className="sec-head"
                  onClick={() => handleOpenSection(isOpen ? null : mod.id)}
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
                    {mod.lessons.map((lesson) => {
                      const isDone = completed.has(lesson.id); // ¿ya está completada?
                      return (
                        <article key={lesson.id} className="clase">
                          <div className="clase-head">
                            <h4>
                              {isDone && <span title="Completada">✔ </span>}
                              Clase {lesson.order}: {lesson.title}
                            </h4>
                            {lesson.durationMinutes != null && (
                              <span className="state partial">~{lesson.durationMinutes} min</span>
                            )}
                            {loggedIn && (
                              <button
                                type="button"
                                className="btn"
                                disabled={marking === lesson.id || isDone}
                                onClick={() => handleComplete(lesson.id)}
                              >
                                {isDone ? "Completada" : marking === lesson.id ? "…" : "Marcar completada"}
                              </button>
                            )}
                          </div>
                          <Markdown text={lesson.markdown} />
                        </article>
                      );
                    })}

                    <h3 className="mod-title">Actividad de la sección</h3>
                    {activities.length === 0 && <p>Esta sección aún no tiene actividad.</p>}
                    {activities.map((ex) => (
                      <article key={ex.id} className="card actividad">
                        <span className="tag">{DIFF_LABEL[ex.difficulty]}</span>
                        <h4>{ex.title}</h4>
                        {ex.description && <p>{ex.description}</p>}
                        <p className="md-instructions">{ex.instructions}</p>
                        <div className="exercise-actions">
                          <span className="activity-tags">
                            <span className="state pass">
                              {ex._count.tests} {ex._count.tests === 1 ? "test" : "tests"}
                            </span>
                            {ex.maxAttempts != null && (
                              <span className="state partial">hasta {ex.maxAttempts} intentos</span>
                            )}
                          </span>
                          {loggedIn && (
                            <Link className="btn primary small" href={`/actividad/${ex.id}`}>
                              Ver la actividad
                            </Link>
                          )}
                        </div>
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