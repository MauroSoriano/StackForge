import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="auth-wrap">
      <div>
        {children}
        <p className="auth-alt">
          <Link href="/">← Volver a la portada</Link>
        </p>
      </div>
    </main>
  );
}