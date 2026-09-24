"use client";

import { useEffect, useRef, useState } from "react";
import { GlobalNav } from "../../components/global-nav";

const LANGUAGES = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
];

export default function AjustesPage() {
  const darkSwitchRef = useRef<HTMLInputElement>(null);
  const langRef = useRef<HTMLSelectElement>(null);
  const [nProgress, setNProgress] = useState(true);
  const [nResults, setNResults] = useState(true);
  const [nMentions, setNMentions] = useState(false);
  const [nEmails, setNEmails] = useState(true);

  useEffect(() => {
    if (darkSwitchRef.current) {
      darkSwitchRef.current.checked = document.documentElement.dataset.theme !== "light";
    }
    if (langRef.current) {
      langRef.current.value = localStorage.getItem("sf-lang") || "es";
    }
  }, []);

  function applyTheme(next: "dark" | "light") {
    if (next === "light") {
      document.documentElement.dataset.theme = "light";
      localStorage.setItem("sf-theme", "light");
    } else {
      delete document.documentElement.dataset.theme;
      localStorage.setItem("sf-theme", "dark");
    }
  }

  function changeLanguage(code: string) {
    localStorage.setItem("sf-lang", code);
  }

  return (
    <main className="container" style={{ paddingTop: "6vh" }}>
      <GlobalNav />

      <div className="settings-wrap">
        <div className="hero" style={{ padding: "40px 0 30px" }}>
          <div className="badge">
            <span className="dot" /> Preferencias
          </div>
          <h1 style={{ fontSize: "clamp(30px, 5vw, 46px)" }}>Ajustes</h1>
          <p className="hero-note">Personaliza tu experiencia en StackForge.</p>
        </div>

        <div className="settings-card">
          <h2>Apariencia</h2>
          <p className="card-sub">El modo claro o oscuro se guarda en tu dispositivo.</p>
          <div className="settings-row">
            <div>
              <div className="row-label">Modo oscuro</div>
              <div className="row-desc">Activa o desactiva el tema oscuro.</div>
            </div>
            <label className="switch">
              <input
                ref={darkSwitchRef}
                type="checkbox"
                onChange={(e) => applyTheme(e.target.checked ? "dark" : "light")}
                aria-label="Modo oscuro"
              />
              <span className="slider" />
            </label>
          </div>
        </div>

        <div className="settings-card">
          <h2>Idioma</h2>
          <p className="card-sub">Selecciona el idioma de la plataforma.</p>
          <div className="settings-row">
            <div>
              <div className="row-label">Idioma de la interfaz</div>
              <div className="row-desc">El cambio de contenido se aplicará próximamente.</div>
            </div>
            <select
              ref={langRef}
              className="settings-select"
              onChange={(e) => changeLanguage(e.target.value)}
              defaultValue="es"
              aria-label="Idioma"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="settings-card">
          <h2>Notificaciones</h2>
          <p className="card-sub">Preferencias de notificación. Se habilitarán en breve.</p>
          <div className="settings-row">
            <div>
              <div className="row-label">Progreso del curso</div>
              <div className="row-desc">Avances y clases completadas.</div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={nProgress} onChange={(e) => setNProgress(e.target.checked)} aria-label="Progreso del curso" />
              <span className="slider" />
            </label>
          </div>
          <div className="settings-row">
            <div>
              <div className="row-label">Resultados de ejercicios</div>
              <div className="row-desc">Feedback de tus entregas.</div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={nResults} onChange={(e) => setNResults(e.target.checked)} aria-label="Resultados de ejercicios" />
              <span className="slider" />
            </label>
          </div>
          <div className="settings-row">
            <div>
              <div className="row-label">Menciones y respuestas</div>
              <div className="row-desc">Interacciones en tu proyecto.</div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={nMentions} onChange={(e) => setNMentions(e.target.checked)} aria-label="Menciones y respuestas" />
              <span className="slider" />
            </label>
          </div>
          <div className="settings-row">
            <div>
              <div className="row-label">Correos semanales</div>
              <div className="row-desc">Resumen de tu actividad cada semana.</div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={nEmails} onChange={(e) => setNEmails(e.target.checked)} aria-label="Correos semanales" />
              <span className="slider" />
            </label>
          </div>
        </div>
      </div>
    </main>
  );
}