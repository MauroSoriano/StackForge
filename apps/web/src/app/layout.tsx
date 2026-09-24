import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StackForge — Aprende Fullstack construyendo",
  description:
    "Aprende desarrollando proyectos reales en tu propio entorno y recibe feedback automático de IA mientras construyes tu portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
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