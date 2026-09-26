/*
 * layout.tsx (Root Layout)
 * -----------------------------------------------------------------------------
 * Layout raíz de toda la aplicación (App Router). Envuelve todas las páginas:
 * define el <html>/<body>, el idioma, los metadatos SEO y el script anti-FOUC
 * que aplica el tema guardado antes de que React hidrate la página.
 * -----------------------------------------------------------------------------
 */
import type { Metadata } from "next";
import "./globals.css"; // Estilos globales de la app

// Metadatos que Next usa para <title> y la descripción (SEO / pestaña).
export const metadata: Metadata = {
  title: "StackForge — Aprende Fullstack construyendo",
  description:
    "Aprende desarrollando proyectos reales en tu propio entorno y recibe feedback automático de IA mientras construyes tu portfolio.",
};

/**
 * Layout raíz. Se renderiza una sola vez alrededor de todas las rutas.
 *
 * @param children La página o layout hijo que corresponde a la ruta actual.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning evita avisos porque el script cambia el tema en <html>.
    <html lang="es" suppressHydrationWarning>
      <head>
        {/*
          Script anti-FOUC (flash of unstyled content): se ejecuta ANTES del
          render para aplicar el tema sin parpadeo. Lee "sf-theme" de localStorage;
          si no hay preferencia guardada, usa el del sistema operativo.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var stored = localStorage.getItem("sf-theme");
                  var dark = stored
                    ? stored === "dark"
                    : !window.matchMedia("(prefers-color-scheme: light)").matches;
                  if (!dark) document.documentElement.dataset.theme = "light";
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}