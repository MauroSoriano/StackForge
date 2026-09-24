"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";

interface ModuleItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  order: number;
  estimatedHours: number | null;
  lockedByDefault: boolean;
  _count: { lessons: number };
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

export default function TrackPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [track, setTrack] = useState<TrackDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .me()
      .then(() => params.then((p) => api.getTrack(p.slug)))
      .then(setTrack)
      .catch((err) => {
        if (err instanceof Error && "status" in err && (err as { status: number }).status === 401) {
          router.replace("/login");
        } else {
          setError(err instanceof Error ? err.message : "Error inesperado");
        }
      });
  }, [router, params]);

  return (
    <main className="container" style={{ paddingTop: "6vh" }}>
      <nav>
        <Link className="logo" href="/">
          Stack<span>Forge</span>
        </Link>
        <Link className="navbtn" href="/dashboard">
          ↔ Dashboard
        </Link>
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
              <span className="dot" /> Track
            </div>
            <h1 style={{ fontSize: "clamp(30px, 5vw, 52px)" }}>{track.title}</h1>
            {track.description && <p>{track.description}</p>}
          </section>

          <section className="timeline">
            {track.modules.map((mod) => (
              <div key={mod.id} className="card">
                <span className="tag">Módulo {mod.order}</span>
                <h3>{mod.title}</h3>
                {mod.description && <p>{mod.description}</p>}
                <p>
                  <span className="state pass">{mod._count.lessons} lecciones</span>
                  {mod.estimatedHours != null && (
                    <span className="state partial"> ~{mod.estimatedHours}h</span>
                  )}
                </p>
              </div>
            ))}
          </section>
        </>
      )}
    </main>
  );
}