import Link from "next/link";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <div className="auth-card">
      <Link className="logo" href="/">
        Stack<span>Forge</span>
      </Link>
      <h1>Crear cuenta</h1>
      <p className="auth-sub">Empieza a construir tu portfolio.</p>
      <RegisterForm />
    </div>
  );
}