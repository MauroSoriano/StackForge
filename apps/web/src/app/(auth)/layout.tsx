/*
 * layout.tsx (grupo de rutas "(auth)")
 * -----------------------------------------------------------------------------
 * Layout compartido por las páginas de autenticación (login y registro).
 * Centra el contenido en la pantalla y agrega el enlace de vuelta a la portada.
 * El paréntesis en "(auth)" es un grupo de rutas: no aparece en la URL.
 * -----------------------------------------------------------------------------
 */
import Link from "next/link";

/**
 * Envuelve las páginas hijas de autenticación.
 *
 * @param children Página de login o registro.
 */
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // auth-wrap centra la tarjeta; children es el formulario correspondiente
    <main className="auth-wrap">
      <div>
        {children}
        {/* Enlace siempre visible para volver al inicio */}
        <p className="auth-alt">
          <Link href="/">← Volver a la portada</Link>
        </p>
      </div>
    </main>
  );
}