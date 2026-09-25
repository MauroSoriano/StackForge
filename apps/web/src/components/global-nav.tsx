"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { api, type SafeUser } from "../lib/api";

const AVATAR_COLORS = ["#7c5cff", "#00c2a8", "#ff8a5c", "#ff5c8a", "#5ca8ff", "#8aff5c", "#ffd25c", "#c15cff"];

function initialsOf(url: string | null, name: string | null, email: string): string {
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

interface GlobalNavProps {
  links?: Array<{ href: string; label: string }>;
  children?: ReactNode;
}

export function GlobalNav({ links = [], children }: GlobalNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api
      .me()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setChecked(true));
  }, [pathname]);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function toggleTheme() {
    if (document.documentElement.dataset.theme === "light") {
      delete document.documentElement.dataset.theme;
      localStorage.setItem("sf-theme", "dark");
    } else {
      document.documentElement.dataset.theme = "light";
      localStorage.setItem("sf-theme", "light");
    }
  }

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
      <Link className="logo" href="/">
        Stack<span>Forge</span>
      </Link>

      {(links.length > 0 || children) && <div className="navlinks">{links.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}{children}</div>}

      <div className="nav-right">
        <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label="Cambiar tema" title="Cambiar tema">
          <span className="icon-moon">🌙</span>
          <span className="icon-sun">☀️</span>
        </button>

        {checked && !user && (
          <Link className="navbtn" href="/login">
            Ingresar
          </Link>
        )}

        {checked && user && (
          <div className="user-menu" ref={menuRef}>
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

            {open && (
              <div className="user-dropdown" role="menu">
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