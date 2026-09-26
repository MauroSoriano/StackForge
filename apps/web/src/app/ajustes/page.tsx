"use client";

/*
 * page.tsx (ruta "/ajustes")
 * -----------------------------------------------------------------------------
 * Página de preferencias del usuario: apariencia (tema claro/oscuro), idioma y
 * notificaciones. El tema y el idioma se guardan en localStorage; las
 * notificaciones son por ahora solo estado local (funcionalidad futura).
 * -----------------------------------------------------------------------------
 */
import { useEffect, useRef, useState } from "react";
import { GlobalNav } from "../../components/global-nav";

// Idiomas ofrecidos en el selector.
const LANGUAGES = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
];

/** Página de ajustes. */
export default function AjustesPage() {
  // Referencias a los controles para inicializarlos según lo guardado.
  const darkSwitchRef = useRef<HTMLInputElement>(null);
  const langRef = useRef<HTMLSelectElement>(null);
  // Estados locales de las notificaciones (aún no persistidos).
  const [nProgress, setNProgress] = useState(true);
  const [nResults, setNResults] = useState(true);
  const [nMentions, setNMentions] = useState(false);
  const [nEmails, setNEmails] = useState(true);

  // Al montar, sincroniza los controles con el tema e idioma guardados.
  useEffect(() => {
    if (darkSwitchRef.current) {
      darkSwitchRef.current.checked = document.documentElement.dataset.theme !== "light";
    }
    if (langRef.current) {
      langRef.current.value = localStorage.getItem("sf-lang") || "es";
    }
  }, []);

  /** Aplica el tema en <html> y lo guarda en localStorage. */
  function applyTheme(next: "dark" | "light") {
    if (next === "light") {
      document.documentElement.dataset.theme = "light";
      localStorage.setItem("sf-theme", "light");
    } else {
      delete document.documentElement.dataset.theme; // oscuro = sin atributo
      localStorage.setItem("sf-theme", "dark");
    }
  }

  /** Guarda el idioma elegido (el cambio de contenido llegará después). */
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

        {/* Tarjeta: tema claro/oscuro */}
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

        {/* Tarjeta: selección de idioma */}
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

        {/* Tarjeta: preferencias de notificaciones (aún sin persistir) */}
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