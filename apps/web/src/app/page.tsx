/*
 * page.tsx (portada "/")
 * -----------------------------------------------------------------------------
 * Página de inicio pública de StackForge. Es un Server Component (no lleva
 * "use client") que muestra secciones estáticas de marketing: hero, beneficios,
 * roadmap de 12 semanas, evaluación, Git/GitHub y preguntas frecuentes.
 * -----------------------------------------------------------------------------
 */
import Link from "next/link";
import { GlobalNav } from "../components/global-nav";

// Datos estáticos del roadmap (semanas, título, descripción y etiqueta).
const phases = [
  {
    weeks: "SEM 01–02",
    title: "Fundamentos + Git + HTML/CSS",
    desc: "Terminal, lógica, Git, GitHub, HTML semántico, CSS y responsive design.",
    tag: "Base",
  },
  {
    weeks: "SEM 03–04",
    title: "JavaScript + TypeScript",
    desc: "DOM, asincronía, módulos, ES moderno, TypeScript y buenas prácticas.",
    tag: "Frontend",
  },
  {
    weeks: "SEM 05–06",
    title: "React + Next.js",
    desc: "Componentes, estado, routing, formularios, consumo de APIs y arquitectura frontend.",
    tag: "Frontend",
  },
  {
    weeks: "SEM 07–09",
    title: "Backend + APIs + PostgreSQL",
    desc: "HTTP, REST, autenticación, validación, SQL, ORM, seguridad y diseño de APIs.",
    tag: "Backend",
  },
  {
    weeks: "SEM 10–12",
    title: "Fullstack + Testing + Deploy",
    desc: "Integración completa, testing, Docker, CI/CD, despliegue y proyecto de portafolio.",
    tag: "Junior Ready",
  },
  {
    weeks: "AVANZADO",
    title: "De Mid a Senior",
    desc: "Arquitectura, escalabilidad, sistemas distribuidos, observabilidad, rendimiento, cloud y liderazgo técnico.",
    tag: "Senior Track",
  },
];

// Filas de ejemplo que simulan un resultado de revisión automática de código.
const checkRows = [
  { state: "PASS", label: "La API implementa CRUD de tareas" },
  { state: "PASS", label: "Autenticación JWT con contraseñas hasheadas" },
  { state: "PARTIAL", label: "Validación de entrada y manejo de errores" },
  { state: "PASS", label: "README con instrucciones de instalación" },
  { state: "NEEDS WORK", label: "El estado de la UI no se sincroniza tras eliminar una tarea" },
];

// Preguntas frecuentes (pares pregunta/respuesta) mostradas en un acordeón.
const faqs = [
  {
    q: "¿Necesito saber programar antes de empezar?",
    a: "No. La ruta empieza desde los fundamentos: computadora, terminal, lógica y las primeras líneas de código. Está diseñada para llevarte de cero a nivel junior en unas 12 semanas de trabajo intensivo.",
  },
  {
    q: "¿Dónde escribo el código?",
    a: "En tu propio entorno, como un desarrollador real: VS Code, terminal, Git y GitHub. StackForge no sustituye tus herramientas; te enseña a usarlas y evalúa tu trabajo.",
  },
  {
    q: "¿Cómo entrego los ejercicios?",
    a: "Subes tu proyecto desde la plataforma (carpeta o .zip). El sistema lo procesa en un entorno aislado y la IA lo evalúa contra los requisitos del ejercicio, con checks deterministas además de la revisión cualitativa.",
  },
  {
    q: "¿La IA me da la solución completa?",
    a: "No. El feedback explica qué está mal, por qué y qué concepto repasar. Corriges, vuelves a subir y así demuestras progreso real con cada intento.",
  },
  {
    q: "¿Completar 12 semanas garantiza empleo?",
    a: "No. El objetivo es construir conocimientos, práctica y un portfolio que te permita competir por posiciones junior. El resultado depende de tu esfuerzo, el mercado y la calidad de lo que construyas.",
  },
];

/** Componente de la portada. Renderiza todas las secciones de la landing. */
export default function Home() {
  return (
    <main>
      {/* Barra de navegación con enlaces a las secciones internas */}
      <div className="container">
        {/* Nav */}
        <GlobalNav
          links={[
            { href: "/cursos", label: "Cursos" },
            { href: "#ruta", label: "Ruta" },
            { href: "#ia", label: "IA" },
            { href: "#github", label: "GitHub" },
            { href: "#faq", label: "FAQ" },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="hero" id="start">
        <div className="container">
          <div className="badge">
            <span className="dot" /> Ruta Fullstack basada en proyectos
          </div>
          <h1>
            Learn Fullstack. Build Real Projects.{" "}
            <span className="gradient">Become a Developer.</span>
          </h1>
          <p>
            Aprende desarrollando proyectos reales en tu propio entorno y recibe
            feedback automático de IA mientras construyes tu portfolio.
          </p>
          <div className="actions">
            <a className="btn primary" href="#ruta">
              Ver la ruta →
            </a>
            <Link className="btn secondary" href="/tracks/git-y-github">
              Aprender Git y GitHub
            </Link>
          </div>
          <p className="hero-note">
            12 semanas para construir fundamentos sólidos de nivel junior ·
            aprendizaje práctico · sin IDE interno
          </p>
        </div>
      </section>

      {/* Learning by building */}
      <section id="proyectos">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Aprendizaje práctico</div>
            <h2>No acumules cursos. Acumula proyectos.</h2>
            <p>
              Cada módulo termina con código real, pruebas, documentación y un
              proyecto que puedes publicar en tu propio GitHub.
            </p>
          </div>
          <div className="grid">
            <article className="card">
              <div className="icon">01</div>
              <h3>Aprende haciendo</h3>
              <p>
                Lecciones cortas seguidas inmediatamente por ejercicios, retos y
                funcionalidades que debes implementar manualmente.
              </p>
            </article>
            <article className="card">
              <div className="icon">02</div>
              <h3>Proyectos progresivos</h3>
              <p>
                Desde una API sencilla hasta aplicaciones Fullstack con
                autenticación, bases de datos, testing, despliegue y arquitectura.
              </p>
            </article>
            <article className="card">
              <div className="icon">03</div>
              <h3>Portfolio real</h3>
              <p>
                GitHub URL, live demo y documentación para cada proyecto. Tu
                trabajo queda público y demostrable, no en un cajón.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 12-week Junior Track + Mid/Senior roadmap */}
      <section id="ruta">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Roadmap lineal</div>
            <h2>Del “no sé programar” a junior, y luego senior.</h2>
            <p>
              El sistema desbloquea contenidos en orden y separa la ruta
              intensiva para empleo junior de la especialización avanzada.
            </p>
          </div>
          <div className="timeline">
            {phases.map((phase) => (
              <div className="phase" key={phase.weeks}>
                <strong>{phase.weeks}</strong>
                <div>
                  <h3>{phase.title}</h3>
                  <p>{phase.desc}</p>
                </div>
                <span className="tag">{phase.tag}</span>
              </div>
            ))}
          </div>
          <div className="actions" style={{ marginTop: 26 }}>
            <a className="btn primary" href="/cursos">
              Ver los cursos fullstack →
            </a>
          </div>
        </div>
      </section>

      {/* Project review */}
      <section id="ia">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Evaluación automática</div>
            <h2>Tu código es revisado como un PR real.</h2>
            <p>
              Checks deterministas contra criterios explícitos:
              lo que está bien, lo que falla y por qué, con pistas para corregirlo.
            </p>
            <p style={{ color: "var(--muted)", marginTop: 10 }}>
              <em>Calificador IA: próximamente.</em> La revisión con IA queda
              pendiente de habilitación.
            </p>
          </div>
          <div className="split">
            <div>
              <div className="checklist">
                {checkRows.map((row) => (
                  <div className="checkrow" key={row.label}>
                    <span className={`state ${row.state.toLowerCase().replace(" ", "-")}`}>
                      {row.state}
                    </span>
                    <span>{row.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p style={{ color: "var(--muted)", marginBottom: 18 }}>
                Cada entrega genera un resultado PASS, PARTIAL o NEEDS WORK,
                con requirements, code quality, problemas detectados y
                recomendaciones. Vuelves a subir y el historial muestra tus
                intentos: conversion real de progreso.
              </p>
              <a className="btn primary" href="/cursos">
                Comenzar a construir →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Git / GitHub learning */}
      <section id="github">
        <div className="container">
          <div className="github">
            <div>
              <div className="eyebrow">Git y GitHub como centro</div>
              <h2>Aprende Git de verdad. No lo ocultamos.</h2>
              <p>
                Tutoriales interactivos paso a paso: git init, commit, branches,
                merge, conflictos, remotes y push. Nada de subidas automáticas:
                tú creas tus repositorios y commits, como en el trabajo real.
              </p>
              <Link className="btn primary" href="/tracks/git-y-github">
                Quiero dominar Git →
              </Link>
            </div>
            <div className="terminal">
              <div className="terminalbar">stackforge / create-your-first-repo</div>
              <pre>
                <span className="purple">$</span> git init
                <span className="purple">$</span> git add .
                <span className="purple">$</span> git commit -m{" "}
                <span className="green">{"\u201C"}feat: add task creation{"\u201D"}</span>

{"\n"}
                <span className="purple">$</span> git remote add origin
                <span className="purple">$</span> git push -u origin main

{"\n"}
                <span className="green">✓</span> Repository created
                <span className="green">✓</span> Timeline tracked

{"\n"}
                <span className="purple">→</span> github.com/you/fullstack-project
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="container">
          <div className="section-head" style={{ marginInline: "auto", textAlign: "center" }}>
            <div className="eyebrow">Preguntas frecuentes</div>
            <h2>Resolvemos las dudas antes de empezar.</h2>
          </div>
          <div className="faq">
            {faqs.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <div className="eyebrow">Construye tu carrera</div>
          <h2>De tu primer “Hello World” a sistemas reales.</h2>
          <p>
            Una experiencia centrada en escribir código, resolver problemas y
            demostrar lo que sabes construyendo.
          </p>
          <a className="btn primary" href="/cursos">
            Explorar la ruta →
          </a>
        </div>
      </section>

      <div className="container">
        <footer>
          <span>© 2026 StackForge</span>
          <span>Learn · Build · Ship</span>
        </footer>
      </div>
    </main>
  );
}