"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api, type SafeUser } from "../../lib/api";

type ModuleState = "LOCKED" | "AVAILABLE" | "IN_PROGRESS" | "COMPLETED";

interface TrackProgress {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  type: "JUNIOR" | "MID" | "SENIOR";
  modules: Array<{
    id: string;
    slug: string;
    title: string;
    order: number;
    lessons: Array<{ id: string; title: string; order: number }>;
  }>;
}

interface ModuleProgressItem {
  trackId: string;
  moduleId: string | null;
  state: ModuleState;
  progress: number;
}

interface LessonProgressItem {
  lessonId: string;
  completedAt: string | null;
}

interface ProgressPayload {
  tracks: TrackProgress[];
  progress: ModuleProgressItem[];
  lessonProgress: LessonProgressItem[];
}

const TYPE_LABEL: Record<string, string> = {
  JUNIOR: "Junior",
  MID: "Mid",
  SENIOR: "Senior",
};

const STATE_LABEL: Record<ModuleState, string> = {
  LOCKED: "Bloqueada",
  AVAILABLE: "Disponible",
  IN_PROGRESS: "En curso",
  COMPLETED: "Completada",
};

const AVATAR_COLORS = ["#7c5cff", "#00c2a8", "#ff8a5c", "#ff5c8a", "#5ca8ff", "#8aff5c", "#ffd25c", "#c15cff"];

function initialsOf(name: string | null, email: string): string {
  const source = name?.trim() || email.trim();
  const parts = source.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase() || "?";
}

function hashCode(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function avatarDataUrl(seed: string): string {
  const color = AVATAR_COLORS[hashCode(seed) % AVATAR_COLORS.length];
  const initials = initialsOf(null, seed);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="128" height="128" rx="28" fill="${color}"/><text x="64" y="80" font-family="Segoe UI, Arial, sans-serif" font-size="52" font-weight="600" fill="#ffffff" text-anchor="middle">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function Avatar({ user, size = 64 }: { user: SafeUser; size?: number }) {
  if (user.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.avatarUrl}
        alt="Foto de perfil"
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border, #3a3a4a)" }}
      />
    );
  }
  return (
    <div
      className="avatar-fallback"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: AVATAR_COLORS[hashCode(user.email) % AVATAR_COLORS.length],
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.4,
      }}
    >
      {initialsOf(user.name, user.email)}
    </div>
  );
}

function resizeToAvatar(file: File, maxPx = 192): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Archivo no es una imagen v��lida"));
      img.onload = () => {
        const ratio = Math.min(1, maxPx / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * ratio));
        canvas.height = Math.max(1, Math.round(img.height * ratio));
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("No se pudo procesar la imagen"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [progress, setProgress] = useState<ProgressPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [togglingLesson, setTogglingLesson] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api
      .me()
      .then((u) => {
        setUser(u);
        return api.getMyProgress();
      })
      .then((p) => setProgress(p))
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

  async function applyAvatar(urlOrFile: string | File) {
    setSavingAvatar(true);
    setFeedback(null);
    try {
      const next = urlOrFile instanceof File ? await resizeToAvatar(urlOrFile) : urlOrFile;
      const updated = await api.updateProfile({ avatarUrl: next });
      setUser(updated);
      setShowAvatarPicker(false);
      setFeedback("Foto de perfil actualizada.");
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "No se pudo actualizar la foto");
    } finally {
      setSavingAvatar(false);
    }
  }

  async function toggleLesson(lessonId: string, completed: boolean) {
    setTogglingLesson(lessonId);
    setFeedback(null);
    try {
      if (completed) {
        await api.startLesson(lessonId);
      } else {
        await api.completeLesson(lessonId);
      }
      const p = await api.getMyProgress();
      setProgress(p);
      setFeedback(completed ? "Clase reiniciada: se quita de completadas." : "Clase marcada como completada.");
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "No se pudo actualizar el progreso");
    } finally {
      setTogglingLesson(null);
    }
  }

  const lessonCompleted = (id: string) =>
    progress?.lessonProgress.some((lp) => lp.lessonId === id && lp.completedAt) ?? false;

  const moduleOf = (trackId: string, moduleId: string) =>
    progress?.progress.find((p) => p.trackId === trackId && p.moduleId === moduleId);

  function sectionStats(track: TrackProgress, moduleId: string) {
    const mod = track.modules.find((m) => m.id === moduleId);
    const total = mod?.lessons.length ?? 0;
    const done = mod?.lessons.filter((l) => lessonCompleted(l.id)).length ?? 0;
    const mp = moduleOf(track.id, moduleId);
    const state = (mp?.state ?? (track.modules[0]?.id === moduleId ? "AVAILABLE" : "LOCKED")) as ModuleState;
    return { total, done, pct: total === 0 ? 0 : Math.round((done / total) * 100), state };
  }

  function trackStats(track: TrackProgress) {
    const total = track.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const done = track.modules.reduce(
      (acc, m) => acc + m.lessons.filter((l) => lessonCompleted(l.id)).length,
      0,
    );
    return { total, done, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
  }

  return (
    <main className="container" style={{ paddingTop: "6vh" }}>
      <nav>
        <Link className="logo" href="/">
          Stack<span>Forge</span>
        </Link>
        <div className="navlinks">
          <Link href="/cursos">Ver cursos</Link>
          <button className="navbtn" type="button" onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? "Saliendo…" : "Salir"}
          </button>
        </div>
      </nav>

      <section className="hero">
        <div className="badge">
          <span className="dot" /> Panel de estudiante
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setShowAvatarPicker((v) => !v)}
            style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
            aria-label="Cambiar foto de perfil"
          >
            {user && <Avatar user={user} size={88} />}
          </button>
          <div>
            <h1 style={{ fontSize: "clamp(28px, 4.5vw, 44px)", margin: 0 }}>
              Hola, {user?.name || user?.email}
            </h1>
            <span className="dash-role">
              {user?.role === "ADMIN" ? "Administrador" : "Estudiante"}
            </span>
            <p style={{ margin: "6px 0 0" }}>
              Continúa tus cursos. Marca las clases para registrar tu avance.
            </p>
          </div>
        </div>
      </section>

      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
      {feedback && (
        <p className="state pass" role="status" style={{ marginBottom: 12 }}>
          {feedback}
        </p>
      )}

      {showAvatarPicker && user && (
        <section className="card avatar-picker" style={{ padding: 16, marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 12px" }}>Elige tu foto de perfil</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button
              type="button"
              className="btn"
              disabled={savingAvatar}
              onClick={() => applyAvatar(avatarDataUrl(user.email + "-preset-1"))}
            >
              Aleatoria con tus iniciales
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) applyAvatar(f);
                e.target.value = "";
              }}
            />
            <button type="button" className="btn" disabled={savingAvatar} onClick={() => fileRef.current?.click()}>
              Subir imagen
            </button>
            {savingAvatar && <span>Cargando…</span>}
          </div>
        </section>
      )}

      <h2 style={{ margin: "28px 0 8px" }}>Mis cursos</h2>

      {progress === null && !error && <p>Cargando tus cursos…</p>}

      {progress?.tracks.length === 0 && (
        <p>
          Aún no tienes cursos.{" "}
          <Link href="/cursos">Explora el catálago.</Link>
        </p>
      )}

      {progress?.tracks.map((track) => {
        const stats = trackStats(track);
        return (
          <section className="timeline" key={track.id}>
            <div className="track-head">
              <span className="tag">{(TYPE_LABEL[track.type] ?? track.type).toUpperCase()}</span>
              <h2>{track.title}</h2>
              {track.description && <p>{track.description}</p>}
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${stats.pct}%` }} />
              </div>
              <p style={{ margin: "6px 0 0" }}>
                {stats.done} de {stats.total} clases · {stats.pct}% completado
              </p>
            </div>

            {track.modules.map((mod) => {
              const s = sectionStats(track, mod.id);
              return (
                <div key={mod.id} className="card" style={{ padding: 14, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <h3 className="mod-title" style={{ margin: 0 }}>
                      Sección {mod.order}: {mod.title}
                    </h3>
                    <span className="state partial">
                      {STATE_LABEL[s.state]} · {s.done}/{s.total} · {s.pct}%
                    </span>
                  </div>
                  <div className="progress-bar" style={{ height: 6, margin: "10px 0 12px", background: "var(--bg-soft, #262633)" }}>
                    <div className="progress-fill" style={{ width: `${s.pct}%` }} />
                  </div>
                  {mod.lessons.map((lesson) => {
                    const complete = lessonCompleted(lesson.id);
                    return (
                      <div key={lesson.id} className="lesson-row" style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
                        <Link href={`/lessons/${lesson.id}`} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flex: 1 }}>
                          <span className={`state ${complete ? "pass" : "partial"}`}>
                            {complete ? "✔" : `Clase ${lesson.order}`}
                          </span>
                          <span>{lesson.title}</span>
                        </Link>
                        <button
                          type="button"
                          className="btn"
                          disabled={togglingLesson === lesson.id}
                          onClick={() => toggleLesson(lesson.id, complete)}
                        >
                          {togglingLesson === lesson.id ? "…" : complete ? "Reiniciar" : "Completar"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })}

            <p style={{ margin: "6px 0 18px" }}>
              <Link href={`/tracks/${track.slug}`}>Continuar curso →</Link>
            </p>
          </section>
        );
      })}
    </main>
  );
}