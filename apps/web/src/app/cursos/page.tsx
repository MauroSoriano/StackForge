"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

interface TrackItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  type: "JUNIOR" | "MID" | "SENIOR";
  order: number;
  _count: { modules: number };
}

const TYPE_LABEL: Record<TrackItem["type"], string> = {
  JUNIOR: "Junior",
  MID: "Mid",
  SENIOR: "Senior",
};

export default function CursosPage() {
  const [tracks, setTracks] = useState<TrackItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listTracks()
      .then((data) => setTracks(Array.isArray(data) ? data : [data]))
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado"));
  }, []);

  return (
    <main className="container" style={{ paddingTop: "6vh" }}>
      <nav>
        <Link className="logo" href="/">
          Stack<span>Forge</span>
        </Link>
        <div className="navlinks">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/login">Ingresar</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="badge">
          <span className="dot" /> Catálogo de cursos
        </div>
        <h1 style={{ fontSize: "clamp(30px, 5vw, 52px)" }}>Elige tu curso</h1>
        <p>
          Cada curso está dividido por secciones; cada sección tiene sus clases en
          texto y su actividad práctica.
        </p>
      </section>

      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}

      {tracks === null && !error && <p>Cargando cursos…</p>}

      <div className="grid" style={{ marginTop: 12 }}>
        {tracks?.map((track) => (
          <Link key={track.id} className="card" href={`/tracks/${track.slug}`}>
            <span className="tag">{TYPE_LABEL[track.type]}</span>
            <h3>{track.title}</h3>
            {track.description && <p>{track.description}</p>}
            <p className="lesson-title">
              <span className="state pass">{track._count.modules} secciones</span>
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}