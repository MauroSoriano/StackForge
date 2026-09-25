"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  api,
  type ExerciseDetail,
  type ExerciseSubmission,
} from "../../../lib/api";
import { GlobalNav } from "../../../components/global-nav";

const DIFF_LABEL: Record<ExerciseDetail["difficulty"], string> = {
  BEGINNER: "Principiante",
  INTERMEDIATE: "Intermedio",
  ADVANCED: "Avanzado",
};

const STATUS_LABEL: Record<ExerciseSubmission["status"], string> = {
  RECEIVED: "Recibida",
  PROCESSING: "En revisión",
  PASSED: "Aprobada",
  PARTIAL: "Parcialmente aprobada",
  NEEDS_WORK: "Requiere ajustes",
  ERROR: "Error",
};

const STATUS_CLASS: Record<ExerciseSubmission["status"], string> = {
  RECEIVED: "pass",
  PROCESSING: "partial",
  PASSED: "pass",
  PARTIAL: "partial",
  NEEDS_WORK: "fail",
  ERROR: "fail",
};

function formatBytes(bytes: number | null): string {
  if (bytes == null) return "";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

function formatDate(value: string): string {
  const d = new Date(value);
  return d.toLocaleString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Instructions({ text }: { text: string }) {
  return (
    <div className="markdown">
      {text.split("\n").map((line, i) => {
        const t = line.trim();
        if (/^#{1,3}\s+/.test(t)) return <h4 key={i}>{t.replace(/^#{1,3}\s+/, "")}</h4>;
        if (/^[-*]\s+/.test(t)) {
          return (
            <p key={i} className="md-bullet">
              {t.replace(/^[-*]\s+/, "• ")}
            </p>
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

export default function ActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [exercise, setExercise] = useState<ExerciseDetail | null>(null);
  const [submissions, setSubmissions] = useState<ExerciseSubmission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadOk, setUploadOk] = useState<string | null>(null);
  const [selected, setSelected] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    params
      .then((p) =>
        api
          .me()
          .catch((err) => {
            if (err instanceof Error && "status" in err && (err as { status: number }).status === 401) {
              router.replace("/login");
            }
            throw err;
          })
          .then(async () => {
            const [ex, subs] = await Promise.all([
              api.getExercise(p.id),
              api.getExerciseSubmissions(p.id),
            ]);
            setExercise(ex);
            setSubmissions(subs);
          }),
      )
      .catch((err: unknown) => {
        if (!(err instanceof Error && "status" in err && (err as { status: number }).status === 401)) {
          setError(err instanceof Error ? err.message : "Error inesperado");
        }
      });
  }, [params, router]);

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUploadOk(null);
    const file = event.target.files?.[0] ?? null;
    setSelected(file);
  }

  async function handleUpload() {
    if (!selected || !exercise) return;
    setUploading(true);
    setUploadOk(null);
    setError(null);
    try {
      const result = await api.uploadExerciseFile(exercise.id, selected);
      setSubmissions((prev) => [
        {
          id: result.id,
          attemptNumber: result.attemptNumber,
          status: result.status as ExerciseSubmission["status"],
          archiveSizeBytes: result.archiveSizeBytes,
          fileCount: result.fileCount,
          submittedAt: result.submittedAt,
          files: [{ path: selected.name, sizeBytes: selected.size }],
        },
        ...prev,
      ]);
      setUploadOk(`Actividad entregada (intento ${result.attemptNumber}).`);
      setSelected(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir el archivo.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="container activity" style={{ paddingTop: "6vh" }}>
      <GlobalNav />

      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}

      {uploadOk && (
        <p className="state pass submit-ok" role="status">
          ✓ {uploadOk} La revisión automática estará disponible próximamente.
        </p>
      )}

      {exercise && (
        <>
          <section className="hero">
            {exercise.lesson && (
              <div className="badge">
                <span className="dot" /> {exercise.lesson.module.track.title} · {exercise.lesson.module.title}
              </div>
            )}
            <h1 style={{ fontSize: "clamp(26px, 4vw, 44px)" }}>{exercise.title}</h1>
            <div className="activity-meta">
              <span className="tag">{DIFF_LABEL[exercise.difficulty]}</span>
              {exercise.requirements.length > 0 && (
                <span className="details-count">
                  {exercise.requirements.length} {exercise.requirements.length === 1 ? "requisito" : "requisitos"}
                </span>
              )}
              {exercise.tests.length > 0 && (
                <span className="details-count">
                  {exercise.tests.length} {exercise.tests.length === 1 ? "test" : "tests"}
                </span>
              )}
            </div>
            {exercise.description && <p className="hero-note">{exercise.description}</p>}
          </section>

          <div className="activity-layout">
            <section className="card">
              <h2>Lo que tenés que hacer</h2>
              <Instructions text={exercise.instructions} />
            </section>

            {exercise.requirements.length > 0 && (
              <section className="card">
                <h2>Requisitos de la actividad</h2>
                <ul className="req-list">
                  {exercise.requirements.map((req) => (
                    <li key={req.id} className={req.isMandatory ? "req mandatory" : "req optional"}>
                      <span className="req-badge">{req.isMandatory ? "✔" : "○"}</span>
                      <span>{req.description}</span>
                      <span className="req-kind">{req.isMandatory ? "Obligatorio" : "Opcional"}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <section className="card submit-card">
            <h2>Entregar mi actividad</h2>
            <p className="card-sub">
              Subí el documento o el comprimido (.zip, .rar) con tu trabajo. Quedará guardado para futura revisión.
            </p>

            <label className="upload-box">
              <span className="upload-hint">Elegí un archivo para subir</span>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.md,.zip,.rar,.7z,.tar,.gz,.tgz"
                onChange={onFileChange}
                aria-label="Archivo de la actividad"
              />
            </label>

            {selected && (
              <div className="upload-meta">
                <strong>{selected.name}</strong>
                <span>{formatBytes(selected.size)}</span>
              </div>
            )}

            <button
              type="button"
              className="btn primary upload-btn"
              onClick={handleUpload}
              disabled={!selected || uploading}
            >
              {uploading ? "Subiendo…" : "Subir archivo"}
            </button>
          </section>

          <section className="submissions">
            <h2>Tus entregas</h2>
            {submissions.length === 0 && <p>Esta actividad aún no tiene entregas tuyas.</p>}
            {submissions.map((s) => (
              <div key={s.id} className="submission-item">
                <div className="submission-head">
                  <span className="state partial">Intento #{s.attemptNumber}</span>
                  <span className={`state ${STATUS_CLASS[s.status]}`}>{STATUS_LABEL[s.status]}</span>
                  <span className="submission-date">{formatDate(s.submittedAt)}</span>
                </div>
                <ul className="submission-files">
                  {s.files.map((f, i) => (
                    <li key={i}>
                      📎 {f.path}
                      {f.sizeBytes != null && <span> · {formatBytes(f.sizeBytes)}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {exercise.lesson && (
            <p className="activity-back">
              <Link href={`/lessons/${exercise.lesson.id}`}>← Volver a {exercise.lesson.title}</Link>
            </p>
          )}
        </>
      )}
    </main>
  );
}