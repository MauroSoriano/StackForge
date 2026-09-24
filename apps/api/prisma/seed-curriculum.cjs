"use strict";
// Seed del currículum StackForge (curso 100% texto).
// Uso: node prisma/seed-curriculum.cjs  (requiere DATABASE_URL en .env)
const fs = require("fs");
const path = require("path");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../dist/generated/prisma/client.js");

function envFromDotEnv() {
  const file = path.join(__dirname, "..", ".env");
  const raw = fs.readFileSync(file, "utf8");
  const match = raw.match(/^\s*DATABASE_URL\s*=\s*"([^"]+)"\s*$/m);
  if (match) return match[1];
  const match2 = raw.match(/^\s*DATABASE_URL\s*=\s*'([^']+)'\s*$/m);
  if (match2) return match2[1];
  return process.env.DATABASE_URL ?? "";
}

const DATABASE_URL = envFromDotEnv();
if (!DATABASE_URL) {
  console.error("Falta DATABASE_URL en .env");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: DATABASE_URL }),
});

const C = {
  JUNIOR: "JUNIOR",
  MID: "MID",
  SENIOR: "SENIOR",
  BEGINNER: "BEGINNER",
  INTERMEDIATE: "INTERMEDIATE",
  ADVANCED: "ADVANCED",
};

const course = [
  {
    slug: "fundamentos-fullstack",
    title: "Fundamentos Fullstack",
    description:
      "Base sólida: HTML, CSS, JavaScript, Git y tu primera API. Pensado para empezar de cero.",
    type: C.JUNIOR,
    order: 1,
    modules: [
      {
        slug: "fundamentos-html-css",
        title: "HTML y CSS",
        description: "Semántica, layout y estilos modernos.",
        order: 1,
        estimatedHours: 6,
        lessons: [
          {
            slug: "html-semantico",
            title: "HTML semántico",
            markdown:
              "# HTML semántico\n\nEscribir HTML con **semántica** es la base de una página accesible y SEO-friendly.\n\n- Usa `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` en lugar de `<div>` genéricos.\n- Un `<h1>` por página; jerarquía de encabezados coherente.\n- Atributo `alt` obligatorio en imágenes.\n\n```html\n<main>\n  <h1>Mi portfolio</h1>\n  <section>\n    <h2>Proyectos</h2>\n  </section>\n</main>\n```\n\nCuando el <em>contenido</em> y la <em>presentación</em> se separan, el proyecto escala.",
            order: 1,
            durationMinutes: 35,
            exercises: [
              {
                title: "Estructura semántica de portfolio",
                description: "Convierte un esqueleto con divs en HTML semántico.",
                instructions:
                  "Crea un archivo index.html con header, nav, main y footer. Incluye una sección de proyectos y una de contacto.",
                difficulty: C.BEGINNER,
                maxAttempts: 3,
                requirements: [
                  "Usa al menos 4 etiquetas semánticas (header, nav, main, section, footer).",
                  "Solo un h1 en toda la página.",
                ],
                tests: ["Buscar etiquetas <header>", "Verificar un solo <h1>"],
              },
            ],
          },
          {
            slug: "css-flexbox-grid",
            title: "CSS: Flexbox y Grid",
            markdown:
              "# Flexbox y Grid\n\n**Flexbox** reparte un eje (row/column); **Grid** organiza en dos dimensiones.\n\n```css\n.fila {\n  display: flex;\n  gap: 16px;\n  align-items: center;\n}\n.layout {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n```\n\nRegla práctica: usa Grid para la página, Flexbox para los componentes.",
            order: 2,
            durationMinutes: 45,
            exercises: [
              {
                title: "Barra de navegación con Flexbox",
                description: "Distribuye logo + enlaces con flex.",
                instructions:
                  "Crea un nav con display:flex, separa logo a la izquierda y enlaces a la derecha, alineados al centro vertical.",
                difficulty: C.BEGINNER,
                maxAttempts: 2,
                requirements: ["Usa display:flex en el nav.", "Enlaces alineados con margin-left:auto."],
                tests: ["Comprobar display:flex", "Comprobar alineación de enlaces"],
              },
            ],
          },
        ],
      },
      {
        slug: "fundamentos-javascript",
        title: "JavaScript moderno",
        description: "Variables, funciones, arrays y objetos.",
        order: 2,
        estimatedHours: 8,
        lessons: [
          {
            slug: "variables-tipos",
            title: "Variables y tipos",
            markdown:
              "# Variables y tipos\n\n`const` para valores fijos, `let` para los que cambian.\n\n```js\nconst nombre = \"Ana\";\nlet edad = 28;\nedad += 1;\n```\n\nTipos básicos: string, number, boolean, null, undefined, object, array.",
            order: 1,
            durationMinutes: 30,
            exercises: [
              {
                title: "Billetera simple",
                description: "Modela un saldo y una transacción.",
                instructions:
                  "Crea una función `transaccion(saldo, monto)` que sume o reste según el signo y devuelva el nuevo saldo.",
                difficulty: C.BEGINNER,
                maxAttempts: 3,
                requirements: ["Declara la función con const.", "Devuelve el saldo resultante."],
                tests: ["Llamar transaccion(100, -30)", "Verificar retorno correcto"],
              },
            ],
          },
          {
            slug: "funciones-arrays",
            title: "Funciones y arrays",
            markdown:
              "# Funciones y arrays\n\nLas `arrow functions` y métodos como `map`, `filter` y `reduce` son el pan de cada día.\n\n```js\nconst dobles = nums.map((n) => n * 2);\nconst pares = nums.filter((n) => n % 2 === 0);\n```",
            order: 2,
            durationMinutes: 50,
            exercises: [
              {
                title: "Calcular total del carrito",
                description: "Suma precios con reduce.",
                instructions:
                  "Dado un array de {precio}, devuelve el total usando reduce (sin for clásico).",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 3,
                requirements: ["Usa el método reduce.", "No uses bucles for."],
                tests: ["Verificar uso de reduce", "Comprobar total correcto"],
              },
            ],
          },
        ],
      },
      {
        slug: "git-y-github",
        title: "Git y GitHub",
        description: "Control de versiones como en el trabajo real.",
        order: 3,
        estimatedHours: 5,
        lessons: [
          {
            slug: "commit-branch-merge",
            title: "Branches y merge",
            markdown:
              "# Branches y merge\n\nTrabajar con ramas permite avanzar sin romper `main`.\n\n```bash\ngit checkout -b feature/login\ngit add .\ngit commit -m \"agrega login\"\ngit checkout main\ngit merge feature/login\n```\n\nResuelve conflictos leyendo ambas versiones antes de `git add`.",
            order: 1,
            durationMinutes: 55,
            exercises: [
              {
                title: "Ciclo completo con rama",
                description: "Crea, modificá y fusioná una rama.",
                instructions:
                  "Inicializa un repo, crea una rama feature, haz al menos un commit en ella, vuelve a main y fusiónala.",
                difficulty: C.BEGINNER,
                maxAttempts: 2,
                requirements: ["Crea una rama feature.", "Realiza al menos un commit.", "Fusiona la rama a main."],
                tests: ["Verificar que existe la rama feature", "Verificar merge realizado"],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "backend-api-node",
    title: "Backend con Node",
    description:
      "APIs REST con Node, TypeScript, validación, autenticación y base de datos.",
    type: C.MID,
    order: 2,
    modules: [
      {
        slug: "apis-rest",
        title: "APIs REST",
        description: "Diseño de endpoints, status codes y validación.",
        order: 1,
        estimatedHours: 6,
        lessons: [
          {
            slug: "rutas-y-status",
            title: "Rutas y códigos de estado",
            markdown:
              "# Rutas y códigos de estado\n\nUna API REST expone recursos con verbos HTTP:\n\n- `GET /tareas` → 200\n- `POST /tareas` → 201\n- `PUT /tareas/:id` → 200\n- `DELETE /tareas/:id` → 204\n\nValidá los datos de entrada siempre: nunca confíes en el cliente.",
            order: 1,
            durationMinutes: 40,
            exercises: [
              {
                title: "CRUD de tareas",
                description: "Implementa las 4 operaciones básicas.",
                instructions:
                  "Crea un endpoint para listar, crear, actualizar y eliminar tareas en memoria, con los status codes correctos.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 3,
                requirements: [
                  "GET devuelve 200 y la lista.",
                  "POST crea y devuelve 201.",
                  "DELETE devuelve 204.",
                ],
                tests: ["GET /tareas → 200", "POST /tareas → 201", "DELETE → 204"],
              },
            ],
          },
        ],
      },
      {
        slug: "autenticacion-jwt",
        title: "Autenticación JWT",
        description: "Registro, login, tokens y cookies httpOnly.",
        order: 2,
        estimatedHours: 6,
        lessons: [
          {
            slug: "jwt-access-refresh",
            title: "Access y refresh tokens",
            markdown:
              "# Access y refresh tokens\n\nEl **access token** es de corta vida y viaja en cookie `httpOnly`; el **refresh token** permite renovar sin volver a pedir credenciales.\n\nEl servidor firma con un secreto, y el cliente solo envía la cookie. Nunca expongas el secreto en código cliente.",
            order: 1,
            durationMinutes: 45,
            exercises: [
              {
                title: "Login con cookie httpOnly",
                description: "Protege una ruta privada con JWT.",
                instructions:
                  "Implementa POST /login que firme un JWT, lo guarde en cookie httpOnly, y un middleware que proteja GET /me.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 3,
                requirements: [
                  "Firma un JWT al hacer login.",
                  "La cookie es httpOnly.",
                  "GET /me sin token responde 401.",
                ],
                tests: ["Login firma un token", "Cookie httpOnly", "/me sin token → 401"],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "frontend-react",
    title: "Frontend con React",
    description:
      "Componentes, estado, enrutado y consumo de APIs desde el navegador.",
    type: C.MID,
    order: 3,
    modules: [
      {
        slug: "react-componentes",
        title: "Componentes y props",
        description: "Componentes, composición y props.",
        order: 1,
        estimatedHours: 4,
        lessons: [
          {
            slug: "componentes-props",
            title: "Componentes y props",
            markdown:
              "# Componentes y props\n\nUn componente recibe `props` y devuelve JSX. Los datos fluyen **de arriba hacia abajo**.\n\n```jsx\nfunction Tarjeta({ titulo, children }) {\n  return (\n    <article>\n      <h3>{titulo}</h3>\n      {children}\n    </article>\n  );\n}\n```",
            order: 1,
            durationMinutes: 35,
            exercises: [
              {
                title: "Lista de tarjetas",
                description: "Renderiza una lista desde un array con map.",
                instructions:
                  "Crea un componente Lista que reciba datos y renderice una Tarjeta por elemento usando key correcto.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 2,
                requirements: ["Usa .map() para renderizar.", "Cada item tiene key único."],
                tests: ["Usa .map()", "Props fluyen al hijo"],
              },
            ],
          },
        ],
      },
      {
        slug: "react-estado",
        title: "Estado y efectos",
        description: "useState, useEfecto y formularios.",
        order: 2,
        estimatedHours: 4,
        lessons: [
          {
            slug: "use-state-forms",
            title: "useState y formularios",
            markdown:
              "# useState y formularios\n\n`useState` guarda estado local; los inputs controlados fijan su valor con él.\n\n```jsx\nconst [email, setEmail] = useState(\"\");\n<input value={email} onChange={(e) => setEmail(e.target.value)} />\n```\n\nSabé que el estado se actualiza de forma asíncrona: calculá siempre sobre el valor más reciente.",
            order: 1,
            durationMinutes: 40,
            exercises: [
              {
                title: "Formulario controlado",
                description: "Captura email y contraseña con estado.",
                instructions:
                  "Crea un formulario con inputs controlados y muestra en vivo lo que se escribe.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 2,
                requirements: ["Inputs controlados con useState.", "Botón disabled si algún campo vacío."],
                tests: ["Inputs controlados", "Botón se habilita al completar"],
              },
            ],
          },
        ],
      },
    ],
  },
];

async function upsertCourse() {
  for (const [ti, track] of course.entries()) {
    const t = await prisma.track.upsert({
      where: { slug: track.slug },
      update: { title: track.title, description: track.description, type: track.type, order: track.order },
      create: { slug: track.slug, title: track.title, description: track.description, type: track.type, order: track.order },
    });
    console.log(`track ${ti + 1}/${course.length}: ${t.slug}`);

    for (const mod of track.modules) {
      const m = await prisma.module.upsert({
        where: { trackId_order: { trackId: t.id, order: mod.order } },
        update: {
          slug: mod.slug,
          title: mod.title,
          description: mod.description,
          estimatedHours: mod.estimatedHours,
        },
        create: {
          trackId: t.id,
          slug: mod.slug,
          title: mod.title,
          description: mod.description,
          order: mod.order,
          estimatedHours: mod.estimatedHours,
        },
      });
      console.log(`  módulo: ${m.slug}`);

      for (const lesson of mod.lessons) {
        const l = await prisma.lesson.upsert({
          where: { moduleId_slug: { moduleId: m.id, slug: lesson.slug } },
          update: {
            title: lesson.title,
            markdown: lesson.markdown,
            durationMinutes: lesson.durationMinutes,
          },
          create: {
            moduleId: m.id,
            slug: lesson.slug,
            title: lesson.title,
            markdown: lesson.markdown,
            order: lesson.order,
            durationMinutes: lesson.durationMinutes,
          },
        });
        console.log(`    lección: ${l.slug}`);

        for (const [ei, ex] of lesson.exercises.entries()) {
          const e = await prisma.exercise.create({
            data: {
              lessonId: l.id,
              title: ex.title,
              description: ex.description,
              instructions: ex.instructions,
              order: ei + 1,
              difficulty: ex.difficulty,
              maxAttempts: ex.maxAttempts,
              requirements: {
                create: ex.requirements.map((r, ri) => ({
                  description: r,
                  order: ri + 1,
                  isMandatory: true,
                })),
              },
              tests: {
                create: ex.tests.map((n, ri) => ({ name: n, order: ri + 1 })),
              },
            },
          });
          console.log(`      ejercicio: ${e.title}`);
        }
      }
    }
  }
}

upsertCourse()
  .then(() => {
    console.log("SEED OK");
  })
  .catch((err) => {
    console.error("SEED FAIL", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());