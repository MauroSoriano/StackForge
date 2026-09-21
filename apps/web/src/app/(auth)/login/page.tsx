import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="auth-card">
      <Link className="logo" href="/">
        Stack<span>Forge</span>
      </Link>
      <h1>Entrar</h1>
      <p className="auth-sub">Continúa donde lo dejaste.</p>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}