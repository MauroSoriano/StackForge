"use client";

/*
 * global-nav.tsx
 * -----------------------------------------------------------------------------
 * Barra de navegación global reutilizada en casi todas las páginas.
 * Incluye: logo, enlaces opcionales, botón de cambio de tema (claro/oscuro),
 * y el menú desplegable de usuario (perfil, ajustes, dashboard, cerrar sesión).
 * Es un Client Component porque usa estado, efectos y eventos del navegador.
 * -----------------------------------------------------------------------------
 */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { api, type SafeUser } from "../lib/api";

// Paleta para generar el color del avatar cuando el usuario no subió foto.
const AVATAR_COLORS = ["#7c5cff", "#00c2a8", "#ff8a5c", "#ff5c8a", "#5ca8ff", "#8aff5c", "#ffd25c", "#c15cff"];

/** Devuelve las iniciales (1 o 2 letras) del nombre o, si no hay, del email. */
function initialsOf(url: string | null, name: string | null, email: string): string {
  const source = name?.trim() || email.trim();
  const parts = source.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase() || "?";
}

/** Hash simple y estable de un string; se usa para elegir un color de avatar determinista. */
function hashCode(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Círculo de avatar del usuario.
 * Si tiene `avatarUrl` muestra la imagen; si no, un círculo de color con iniciales.
 *
 * @param user Usuario del que se saca la foto/nombre/email.
 * @param size Diámetro en píxeles (por defecto 34).
 */
function AvatarCircle({ user, size = 34 }: { user: SafeUser; size?: number }) {
  const diameter = { width: size, height: size };
  if (user.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className="avatar-circle"
        src={user.avatarUrl}
        alt="Foto de perfil"
        style={{ ...diameter, border: "1px solid var(--border, #3a3a4a)" }}
      />
    );
  }
  return (
    <span
      className="avatar-circle"
      style={{
        ...diameter,
        background: AVATAR_COLORS[hashCode(user.email) % AVATAR_COLORS.length],
        color: "#fff",
        fontSize: Math.round(size * 0.4),
      }}
    >
      {initialsOf(user.avatarUrl, user.name, user.email)}
    </span>
  );
}

// Props de la barra de navegación.
interface GlobalNavProps {
  links?: Array<{ href: string; label: string }>; // Enlaces extra a la izquierda
  children?: ReactNode; // Contenido adicional que se renderiza junto a los enlaces
}

/**
 * Barra de navegación superior.
 * Carga el usuario actual, muestra el toggle de tema y el menú desplegable.
 *
 * @param links Lista de enlaces de navegación (opcional).
 * @param children Contenido React extra (opcional).
 */
export function GlobalNav({ links = [], children }: GlobalNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  // Usuario logueado (null si no hay sesión o aún no se comprobó).
  const [user, setUser] = useState<SafeUser | null>(null);
  // `checked` indica que ya terminó la comprobación de sesión (evita parpadeos).
  const [checked, setChecked] = useState(false);
  // `open` controla si el menú desplegable de usuario está abierto.
  const [open, setOpen] = useState(false);
  // `loggingOut` muestra "Saliendo…" y deshabilita el botón mientras se cierra sesión.
  const [loggingOut, setLoggingOut] = useState(false);
  // Referencia al contenedor del menú para detectar clics fuera de él.
  const menuRef = useRef<HTMLDivElement>(null);

  // Pide el usuario actual; se re-ejecuta al cambiar de ruta (pathname).
  useEffect(() => {
    api
      .me()
      .then((u) => setUser(u))
      .catch(() => setUser(null)) // 401 u otro error: se muestra como invitado
      .finally(() => setChecked(true));
  }, [pathname]);

  // Cierra el desplegable al hacer clic fuera del menú.
  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    // Solo escucha mientras el menú está abierto; limpia el listener al cerrar.
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  /**
   * Alterna entre tema oscuro y claro.
   * El tema oscuro es el estado por defecto (sin atributo data-theme);
   * para el claro se pone data-theme="light" en <html>. Se guarda en localStorage.
   */
  function toggleTheme() {
    if (document.documentElement.dataset.theme === "light") {
      delete document.documentElement.dataset.theme; // vuelve al tema oscuro por defecto
      localStorage.setItem("sf-theme", "dark");
    } else {
      document.documentElement.dataset.theme = "light";
      localStorage.setItem("sf-theme", "light");
    }
  }

  /** Cierra la sesión: llama a la API, limpia el estado y vuelve al inicio. */
  async function handleLogout() {
    setLoggingOut(true);
    setOpen(false);
    try {
      await api.logout();
    } catch {
      // Aunque falle la petición, forzamos la salida local igualmente.
    } finally {
      // Limpiamos el estado del nav al instante (evita el "Saliendo…" congelado
      // cuando ya estamos en la ruta destino) y refrescamos la sesión/caché.
      setUser(null);
      setLoggingOut(false);
      router.replace("/");
      router.refresh();
    }
  }

  return (
    <nav>
      {/* Logo que lleva a la portada */}
      <Link className="logo" href="/">
        Stack<span>Forge</span>
      </Link>

      {/* Enlaces de navegación + contenido extra (solo si hay alguno) */}
      {(links.length > 0 || children) && <div className="navlinks">{links.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}{children}</div>}

      <div className="nav-right">
        {/* Botón que alterna el tema; muestra luna en oscuro y sol en claro (vía CSS) */}
        <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label="Cambiar tema" title="Cambiar tema">
          <span className="icon-moon">🌙</span>
          <span className="icon-sun">☀️</span>
        </button>

        {/* Si ya se comprobó la sesión y NO hay usuario: enlace para ingresar */}
        {checked && !user && (
          <Link className="navbtn" href="/login">
            Ingresar
          </Link>
        )}

        {/* Usuario logueado: trigger del avatar/nombre + desplegable */}
        {checked && user && (
          <div className="user-menu" ref={menuRef}>
            {/* Botón que abre/cierra el menú; muestra avatar y nombre o email */}
            <button
              type="button"
              className="user-trigger"
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <AvatarCircle user={user} size={34} />
              <span className="username">{user.name || user.email}</span>
            </button>

            {/* Menú desplegable: se renderiza solo cuando `open` es true */}
            {open && (
              <div className="user-dropdown" role="menu">
                {/* Cada enlace cierra el menú al navegar */}
                <Link href="/tu-perfil" role="menuitem" onClick={() => setOpen(false)}>
                  👤 Tu perfil
                </Link>
                <Link href="/ajustes" role="menuitem" onClick={() => setOpen(false)}>
                  ⚙️ Ajustes
                </Link>
                <Link href="/dashboard" role="menuitem" onClick={() => setOpen(false)}>
                  📊 Dashboard
                </Link>
                <div className="menu-sep" />
                <button type="button" className="menu-item danger" role="menuitem" onClick={handleLogout} disabled={loggingOut}>
                  🚪 {loggingOut ? "Saliendo…" : "Cerrar sesión"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}