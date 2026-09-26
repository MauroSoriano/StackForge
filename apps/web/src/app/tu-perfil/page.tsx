"use client";

/*
 * page.tsx (ruta "/tu-perfil")
 * -----------------------------------------------------------------------------
 * Página de perfil del usuario: muestra y permite editar foto, nombre, email,
 * teléfono y país. Carga los datos actuales con el API y los guarda al enviar.
 * Requiere sesión (redirige a /login?next=/tu-perfil si no la hay).
 * -----------------------------------------------------------------------------
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { api, type SafeUser } from "../../lib/api";
import { GlobalNav } from "../../components/global-nav";

// Paleta para el avatar generado con iniciales.
const AVATAR_COLORS = ["#7c5cff", "#00c2a8", "#ff8a5c", "#ff5c8a", "#5ca8ff", "#8aff5c", "#ffd25c", "#c15cff"];

// Lista de países para el selector del formulario.
const COUNTRIES = [
  "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica", "Cuba",
  "Ecuador", "El Salvador", "España", "Estados Unidos", "Guatemala", "Honduras",
  "México", "Nicaragua", "Panamá", "Paraguay", "Perú", "Portugal",
  "Puerto Rico", "República Dominicana", "Uruguay", "Venezuela", "Otro",
];

/** Iniciales (1 o 2 letras) a partir del nombre o del email. */
function initialsOf(name: string | null, email: string): string {
  const source = name?.trim() || email.trim();
  const parts = source.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase() || "?";
}

/** Hash simple de un string, usado para elegir un color de avatar determinista. */
function hashCode(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Redimensiona una imagen en el navegador con <canvas> y la devuelve como
 * data URL JPEG, para subir un avatar liviano.
 */
function resizeToAvatar(file: File, maxPx = 192): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("El archivo no es una imagen válida"));
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

/** Página de perfil del usuario. */
export default function PerfilPage() {
  const router = useRouter();
  // Usuario cargado y valores controlados del formulario.
  const [user, setUser] = useState<SafeUser | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null); // mensaje de éxito
  const [saving, setSaving] = useState(false); // guardando datos del formulario
  const [savingPhoto, setSavingPhoto] = useState(false); // subiendo la foto
  // Referencia al input de archivo oculto para la foto.
  const fileRef = useRef<HTMLInputElement>(null);

  // Al montar, carga el usuario y rellena los campos del formulario.
  // Si no hay sesión (401), redirige al login conservando la ruta destino.
  useEffect(() => {
    api
      .me()
      .then((u) => {
        setUser(u);
        setName(u.name ?? "");
        setEmail(u.email);
        setPhone(u.phone ?? "");
        setCountry(u.country ?? "");
      })
      .catch((err) => {
        if (err instanceof Error && "status" in err && (err as { status: number }).status === 401) {
          router.replace("/login?next=/tu-perfil");
        } else {
          setError(err instanceof Error ? err.message : "Error inesperado");
        }
      });
  }, [router]);

  /** Redimensiona y sube una nueva foto de perfil. */
  async function applyPhoto(file: File) {
    setSavingPhoto(true);
    setFeedback(null);
    try {
      const next = await resizeToAvatar(file);
      const updated = await api.updateProfile({ avatarUrl: next });
      setUser(updated);
      setFeedback("Foto de perfil actualizada.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar la foto");
    } finally {
      setSavingPhoto(false);
    }
  }

  /** Guarda los cambios del formulario de información personal. */
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFeedback(null);
    setSaving(true);
    try {
      const updated = await api.updateProfile({
        name: name.trim() || undefined,
        email: email.trim(),
        phone: phone.trim() || undefined,
        country: country || undefined,
      });
      setUser(updated);
      setName(updated.name ?? "");
      setEmail(updated.email);
      setPhone(updated.phone ?? "");
      setCountry(updated.country ?? "");
      setFeedback("Perfil actualizado.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSaving(false);
    }
  }

  // Mientras no cargó el usuario, se muestra un estado de carga/error.
  if (!user) {
    return (
      <main className="container" style={{ paddingTop: "6vh" }}>
        <GlobalNav />
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        <p className="auth-alt">Cargando tu perfil…</p>
      </main>
    );
  }

  return (
    <main className="container" style={{ paddingTop: "6vh" }}>
      <GlobalNav />

      <div className="settings-wrap">
        <div className="hero" style={{ padding: "40px 0 30px" }}>
          <div className="badge">
            <span className="dot" /> Cuenta
          </div>
          <h1 style={{ fontSize: "clamp(30px, 5vw, 46px)" }}>Tu perfil</h1>
          <p className="hero-note">Actualiza tu información personal.</p>
        </div>

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

        {/* Tarjeta: foto de perfil (imagen o avatar con iniciales) */}
        <div className="settings-card">
          <h2>Foto de perfil</h2>
          <p className="card-sub">Se muestra junto a tu nombre en la plataforma.</p>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="profile-avatar-big"
                src={user.avatarUrl}
                alt="Foto de perfil"
                style={{ width: 88, height: 88, border: "2px solid var(--border, #3a3a4a)" }}
              />
            ) : (
              <span
                className="profile-avatar-big"
                style={{
                  width: 88,
                  height: 88,
                  background: AVATAR_COLORS[hashCode(user.email) % AVATAR_COLORS.length],
                  color: "#fff",
                  fontSize: 34,
                }}
              >
                {initialsOf(user.name, user.email)}
              </span>
            )}
            <div>
              <button
                type="button"
                className="btn secondary"
                disabled={savingPhoto}
                onClick={() => fileRef.current?.click()}
              >
                {savingPhoto ? "Subiendo…" : "Cambiar foto"}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void applyPhoto(file);
                  e.target.value = "";
                }}
              />
            </div>
          </div>
        </div>

        {/* Tarjeta: formulario de datos personales */}
        <div className="settings-card">
          <h2>Información personal</h2>
          <p className="card-sub">Tu nombre, correo, teléfono y país.</p>
          <form onSubmit={onSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="name">Nombre</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ana García"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ana@ejemplo.com"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="phone">Teléfono</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+54 11 5555 1234"
              />
            </div>

            <label htmlFor="country">País</label>
            <select
              id="country"
              className="country-select"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Selecciona un país</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <div className="auth-actions">
              <button className="btn primary" type="submit" disabled={saving}>
                {saving ? "Guardando…" : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>

        <p className="auth-alt">
          <Link href="/dashboard">← Volver a tu dashboard</Link>
        </p>
      </div>
    </main>
  );
}