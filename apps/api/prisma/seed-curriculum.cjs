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
    slug: "git-y-github",
    title: "Git y GitHub",
    description:
      "Domina Git como en el trabajo real: init, commits, branches, merges, conflictos, remotes y pull requests.",
    type: C.JUNIOR,
    order: 0,
    modules: [
      {
        slug: "fundamentos-de-git",
        title: "Fundamentos de Git",
        description: "Qué es Git, el repositorio y tu historial de commits.",
        order: 1,
        estimatedHours: 5,
        lessons: [
          {
            slug: "que-es-git",
            title: "¿Qué es Git y por qué importa?",
            markdown:
              "# ¿Qué es Git?\n\nGit es un sistema de **control de versiones distribuido**. Guarda el historial completo de tus cambios y permite que varias personas trabajen en paralelo sin pisarse.\n\n- Guarda un historial de todo lo que cambia.\n- Trabaja **offline**: todo vive en tu máquina.\n- Cualquiera clona el repo y obtiene una copia completa.\n\n## Repositorio\n\nUn **repositorio** (repo) es la carpeta donde Git guarda el historial, en la subcarpeta oculta `.git`.\n\n```bash\ngit init\n```\n\nEste comando convierte la carpeta actual en un repo.\n\n## Ventajas de Git\n\n- Puedes volver a cualquier versión anterior de tu proyecto.\n- Experimentas sin miedo: las ramas son baratas y fáciles de crear.\n- Es el estándar de la industria: lo usan casi todos los equipos.\n\n> Consejo: ejecuta `git` y `git --help` para ver los comandos disponibles.",
            order: 1,
            durationMinutes: 40,
            exercises: [
              {
                title: "Inicia tu primer repositorio",
                description: "Convierte una carpeta en un repo Git.",
                instructions:
                  "Crea una carpeta, iniciala con git init y verifica que se creó la carpeta oculta .git. Luego ejecuta git status y muestra la salida.",
                difficulty: C.BEGINNER,
                maxAttempts: 3,
                requirements: [
                  "Ejecuta git init.",
                  "Ejecuta git status y muestra la salida.",
                ],
                tests: ["Verificar git init", "Verificar git status"],
              },
            ],
          },
          {
            slug: "primeros-commits",
            title: "Tu primer commit",
            markdown:
              "# Primeros commits\n\nEl flujo básico de Git tiene tres zonas: **working directory** (carpeta de trabajo), **staging area** (área de preparación) y **repo local**.\n\n```bash\n# 1. Marca qué archivos entran al commit\ngit add index.html style.css\n\n# 2. Crea el commit con un mensaje\ngit commit -m \"agrega página de inicio\"\n```\n\nPuedes usar `git add .` para agregar todos los archivos modificados, aunque es más preciso agregar archivo por archivo.\n\n## Buenos mensajes de commit\n\nUn buen mensaje describe **qué** hace el cambio y **por qué**, en presente: `add task model`, `fix auth redirect`. Evita mensajes como `cambios` o `final`.\n\n> Recomendación: haz commits pequeños y atómicos. Cada commit debe representar un solo cambio lógico.",
            order: 2,
            durationMinutes: 45,
            exercises: [
              {
                title: "Ciclo add y commit",
                description: "Guarda el primer cambio en el historial.",
                instructions:
                  "Crea un archivo, agrégalo al staging con git add y haz tu primer commit con git commit -m incluido.",
                difficulty: C.BEGINNER,
                maxAttempts: 3,
                requirements: [
                  "Usa git add.",
                  "Crea el primer commit con un mensaje claro.",
                ],
                tests: ["Verificar git add", "Verificar git commit"],
              },
            ],
          },
          {
            slug: "historial-y-estado",
            title: "Historial y estado del working tree",
            markdown:
              "# Historial y estado\n\nGit te permite inspeccionar qué cambió y cuándo.\n\n```bash\ngit status            # qué archivos cambian y de qué zona\ngit log --oneline     # historial de commits resumido\ngit show <commit>     # detalle de un commit\ngit diff              # cambios sin hacer staging\n```\n\n## Interpretar el estado\n\n- `modified`: el archivo cambió pero no está en staging.\n- `Changes to be committed`: el archivo ya está preparado.\n- `Untracked`: Git lo ve pero todavía no lo sigues.\n\n## Deshacer antes de commitear\n\nPara sacar un archivo del staging sin perder cambios: `git restore --staged archivo.txt`. Para descartar cambios locales: `git restore archivo.txt`. Siempre verifica con `git status` antes de decidir.",
            order: 3,
            durationMinutes: 40,
            exercises: [
              {
                title: "Inspecciona tu historial",
                description: "Lee el estado y el log de tu repo.",
                instructions:
                  "En un repo con al menos dos commits, ejecuta git log --oneline, modifica un archivo y muestra git status con el archivo modificado.",
                difficulty: C.BEGINNER,
                maxAttempts: 3,
                requirements: [
                  "El repo tiene al menos dos commits.",
                  "Ejecuta git log --oneline.",
                  "Git status muestra un archivo modificado.",
                ],
                tests: ["Verificar dos commits", "Verificar git log", "Verificar git status"],
              },
            ],
          },
        ],
      },
      {
        slug: "branches-y-merge",
        title: "Branches y merge",
        description: "Ramas, fusión y resolución de conflictos.",
        order: 2,
        estimatedHours: 6,
        lessons: [
          {
            slug: "trabajar-con-ramas",
            title: "Trabajar con ramas",
            markdown:
              "# Ramas (branches)\n\nUna **rama** es un puntero a un commit. Crear ramas permite experimentar sin romper `main`.\n\n```bash\ngit checkout -b feature/login\n# haces cambios...\ngit add .\ngit commit -m \"add login form\"\n```\n\n```bash\ngit branch        # listar ramas\ngit checkout main # volver a main\ngit branch -d feature/login  # borrar rama ya fusionada\n```\n\n## Buenas prácticas\n\n- Crea una rama por funcionalidad o bug, con nombre descriptivo.\n- Mantén `main` siempre en estado desplegable.\n- Borra las ramas que ya fusionaste para mantener el repo limpio.",
            order: 1,
            durationMinutes: 45,
            exercises: [
              {
                title: "Rama feature desde main",
                description: "Crea una rama, trabaja y vuelve.",
                instructions:
                  "Desde main, crea la rama feature/login, haz un commit en ella, vuelve a main y verifica que los cambios de la rama no están en main.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 2,
                requirements: [
                  "Crea la rama feature/login.",
                  "Haz al menos un commit en la rama.",
                  "Vuelve a main con git checkout main.",
                ],
                tests: ["Verificar rama creada", "Verificar commit", "Volver a main"],
              },
            ],
          },
          {
            slug: "merge-y-conflictos",
            title: "Merge y conflictos",
            markdown:
              "# Merge y conflictos\n\nFusionas una rama con `git merge`. Cuando ambas ramas tocaron el mismo archivo, Git no puede decidir solo y aparece un **conflicto**.\n\n```bash\ngit checkout main\ngit merge feature/login\n```\n\nSi hay conflicto, Git marca los bloques:\n\n```\n<<<<<<< HEAD\nversión de main\n=======\nversión de la rama\n>>>>>>> feature/login\n```\n\n## Resolver un conflicto\n\n1. Abre el archivo y lee ambas versiones.\n2. Decide qué queda: una de las dos o una mezcla.\n3. Borra las marcas `<<<<<<<`, `=======` y `>>>>>>>`.\n4. `git add` y `git commit` para cerrar el merge.\n\n> Los conflictos son normales. La clave es entender qué cambio quería hacer cada rama, no adivinar.",
            order: 2,
            durationMinutes: 50,
            exercises: [
              {
                title: "Fusiona feature en main",
                description: "Resuelve un merge exitoso.",
                instructions:
                  "Fusiona la rama feature/login en main y deja el historial en main con los cambios de la feature.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 2,
                requirements: [
                  "Ejecuta git merge.",
                  "La rama feature/login ya está integrada en main.",
                ],
                tests: ["Verificar merge realizado", "Verificar main actualizado"],
              },
            ],
          },
          {
            slug: "rebase-stash-reset",
            title: "Rebase, stash y cómo deshacer",
            markdown:
              "# Rebase, stash y deshacer\n\nHerramientas avanzadas para ordenar el historial y recuperarte de errores.\n\n## Stash\n\nGuarda cambios sin commitear para trabajos en curso:\n\n```bash\ngit stash           # guarda y limpia\ngit stash pop       # recupera\n```\n\n## Rebase\n\nReescribe la base de una rama para tener un historial lineal:\n\n```bash\ngit checkout feature\ngit rebase main\n```\n\nCuando el historial ya está publicado, evita reescribirlo en `main`: ahí se usa `merge`.\n\n## Deshacer\n\n- `git revert <commit>`: crea un commit inverso (seguro, lo usa todo el equipo).\n- `git reset --hard <commit>`: descarta cambios de forma destructiva. Úsalo solo en ramas locales.",
            order: 3,
            durationMinutes: 50,
            exercises: [
              {
                title: "Guarda trabajo con stash",
                description: "Aplica stash en un flujo real.",
                instructions:
                  "Con un archivo modificado sin committear, ejecuta git stash, verifica que el árbol quedó limpio y luego recupera con git stash pop.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 2,
                requirements: [
                  "Ejecuta git stash con cambios pendientes.",
                  "Recupera los cambios con git stash pop.",
                ],
                tests: ["Verificar git stash", "Verificar git stash pop"],
              },
            ],
          },
        ],
      },
      {
        slug: "github-remotes",
        title: "GitHub y remotes",
        description: "Remotes, push, pull, pull requests y trabajo en equipo.",
        order: 3,
        estimatedHours: 5,
        lessons: [
          {
            slug: "remotes-push-pull",
            title: "Remotes, push y pull",
            markdown:
              "# Remotes en GitHub\n\nUn **remote** es la URL del repo remoto en GitHub.\n\n```bash\ngit remote add origin https://github.com/tu-usuario/mi-proyecto.git\ngit push -u origin main\ngit pull\n```\n\n- `git push` sube tus commits al remoto.\n- `git pull` trae los cambios del remoto y actualiza tu working tree.\n- `-u` (upstream) asocia tu rama local con la remota y evita repetir `origin main`.\n\n## Clonar\n\n`git clone https://github.com/user/repo.git` crea una copia de trabajo completa de un repo remoto.\n\n> Verifica que el repo quedó público y sincronizado desde GitHub. Mantén tu rama local actualizada con `git pull` antes de empezar cada tarea.",
            order: 1,
            durationMinutes: 45,
            exercises: [
              {
                title: "Sube tu proyecto a GitHub",
                description: "Conecta el repo local con GitHub.",
                instructions:
                  "Crea un repo vacío en GitHub, agrega el remote origin y sube main con git push -u origin main.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 3,
                requirements: [
                  "Agrega el remote origin.",
                  "Sube la rama main con push.",
                ],
                tests: ["Verificar remote origin", "Verificar push"],
              },
            ],
          },
          {
            slug: "pull-requests",
            title: "Pull requests y flujo real",
            markdown:
              "# Pull requests\n\nEn el trabajo real no haces push directo a main: creas una rama, subes los cambios y abres una **pull request (PR)** para que alguien la revise.\n\n```bash\ngit checkout -b fix/navbar\ngit commit -am \"fix: navbar en mobile\"\ngit push -u origin fix/navbar\n```\n\nEn GitHub abres la PR, la revisan, se discuten cambios y al aprobarla se fusiona con **merge** o **squash**.\n\n## Una buena PR\n\n- Título descriptivo del cambio (`feat:`, `fix:`, `refactor:`).\n- Descripción: qué cambia, por qué y cómo probarlo.\n- Cambios pequeños y revisables.\n\n> El flujo de PRs es la forma estándar de colaborar y también de aprender de revisiones.",
            order: 2,
            durationMinutes: 40,
            exercises: [
              {
                title: "Ciclo completo con pull request",
                description: "Rama + push + PR como en el trabajo.",
                instructions:
                  "Crea una rama, haz un cambio, súbela a GitHub y abre una pull request describiendo qué hiciste y cómo probarlo.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 2,
                requirements: [
                  "Crea una rama y súbela.",
                  "Abre una pull request describiendo el cambio.",
                ],
                tests: ["Verificar rama remota", "Verificar PR abierta"],
              },
            ],
          },
          {
            slug: "gitignore-y-flujo-equipo",
            title: ".gitignore, tags y flujo de equipo",
            markdown:
              "# Trabajo en equipo con Git\n\n## .gitignore\n\nExcluye archivos que no deben versionarse: `node_modules/`, `.env`, builds. Un `.gitignore` correcto evita subir secretos y archivos pesados.\n\n```\nnode_modules/\n.env\n.DS_Store\ndist/\n```\n\n## Tags y versiones\n\nLos tags marcan versiones: `git tag v1.0.0` y `git push --tags`.\n\n## Flujo de equipo recomendado\n\n1. `git pull` antes de empezar.\n2. Crea una rama por tarea.\n3. Commits pequeños y claros.\n4. Push y pull request.\n5. Revisión, aprobación y merge.\n\n> Un buen `README` con instrucciones de instalación y uso es parte del trabajo profesional.",
            order: 3,
            durationMinutes: 40,
            exercises: [
              {
                title: "Ignora node_modules",
                description: "Crea un .gitignore eficaz.",
                instructions:
                  "Crea un archivo .gitignore que excluya node_modules/, .env y dist/. Verifica con git status que esos archivos no aparecen como untracked.",
                difficulty: C.BEGINNER,
                maxAttempts: 2,
                requirements: [
                  "El .gitignore incluye node_modules/.",
                  "Los archivos ignorados no aparecen en git status.",
                ],
                tests: ["Verificar .gitignore", "Verificar exclusión con git status"],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "fundamentos-fullstack",
    title: "Fundamentos Fullstack",
    description:
      "Base sólida: HTML, CSS, JavaScript, Git y tu primera API. Pensado para empezar desde cero.",
    type: C.JUNIOR,
    order: 1,
    modules: [
      {
        slug: "fundamentos-html-css",
        title: "HTML y CSS",
        description: "Semántica, layout, estilos y diseño responsive.",
        order: 1,
        estimatedHours: 8,
        lessons: [
          {
            slug: "html-semantico",
            title: "HTML semántico",
            markdown:
              "# HTML semántico\n\nEscribir HTML con **semántica** es la base de una página accesible y amigable con los buscadores.\n\n- Usa `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` en lugar de `<div>` genéricos.\n- Un `<h1>` por página; jerarquía de encabezados coherente.\n- Atributo `alt` obligatorio en imágenes.\n\n```html\n<main>\n  <h1>Mi portfolio</h1>\n  <section>\n    <h2>Proyectos</h2>\n  </section>\n</main>\n```\n\n## Formularios accesibles\n\nAsocia cada `input` con su `label` usando el atributo `for`, y agrupa campos relacionados con `<fieldset>` y `<legend>`.",
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
              "# Flexbox y Grid\n\n**Flexbox** reparte un eje (fila o columna); **Grid** organiza en dos dimensiones.\n\n```css\n.fila {\n  display: flex;\n  gap: 16px;\n  align-items: center;\n}\n\n.layout {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n```\n\n## Regla práctica\n\nUsa **Grid** para la estructura general de la página y **Flexbox** para los componentes internos.\n\n## Box model\n\nTodo elemento es una caja: `margin` (exterior), `border`, `padding` (interior) y `content`. Con `box-sizing: border-box` el padding no desborda el ancho declarado.",
            order: 2,
            durationMinutes: 45,
            exercises: [
              {
                title: "Barra de navegación con Flexbox",
                description: "Distribuye logo + enlaces con flex.",
                instructions:
                  "Crea un nav con display:flex, separa el logo a la izquierda y los enlaces a la derecha, alineados al centro vertical.",
                difficulty: C.BEGINNER,
                maxAttempts: 2,
                requirements: ["Usa display:flex en el nav.", "Enlaces alineados con margin-left:auto."],
                tests: ["Comprobar display:flex", "Comprobar alineación de enlaces"],
              },
            ],
          },
          {
            slug: "css-responsivo",
            title: "Responsive: media queries y unidades",
            markdown:
              "# Diseño responsive\n\nUna página debe verse bien en celulares, tablets y monitores.\n\n## Mobile-first\n\nEscribe los estilos base para el móvil y usa `min-width` para mejorar en pantallas grandes:\n\n```css\n.galeria { display: grid; grid-template-columns: 1fr; }\n\n@media (min-width: 700px) {\n  .galeria { grid-template-columns: repeat(3, 1fr); }\n}\n```\n\n## Unidades relativas\n\n- `rem`/`em` para tipografía (mantienen proporción).\n- `%`, `vw`/`vh`, `fr` para layout.\n- `clamp(min, preferido, max)` para tamaños fluidos.\n\n```css\nh1 { font-size: clamp(28px, 5vw, 56px); }\n```\n\n> Prueba siempre en un viewport angosto: un menú que no cabe o textos que se cortan son señales de un layout frágil.",
            order: 3,
            durationMinutes: 40,
            exercises: [
              {
                title: "Grid responsive",
                description: "Haz una galería que se adapte.",
                instructions:
                  "Crea una grilla de 3 columnas que pase a 1 columna en pantallas menores a 700px usando media query.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 2,
                requirements: [
                  "Usa media query con max-width o min-width.",
                  "La grilla cambia de columnas según el viewport.",
                ],
                tests: ["Verificar media query", "Verificar cambio de columnas"],
              },
            ],
          },
        ],
      },
      {
        slug: "fundamentos-javascript",
        title: "JavaScript moderno",
        description: "Variables, funciones, objetos, arrays y asincronía.",
        order: 2,
        estimatedHours: 10,
        lessons: [
          {
            slug: "variables-tipos",
            title: "Variables y tipos",
            markdown:
              "# Variables y tipos\n\nUsa `const` para valores fijos y `let` para los que cambian. Evita `var`.\n\n```js\nconst nombre = \"Ana\";\nlet edad = 28;\nedad += 1;\n```\n\n## Tipos básicos\n\nstring, number, boolean, null, undefined, object y array.\n\n## Operadores y control de flujo\n\n```js\nconst esMayor = edad >= 18;\nif (esMayor) {\n  console.log(\"Es mayor\");\n} else {\n  console.log(\"Es menor\");\n}\n```\n\n> Tip de consola: `console.log` es tu herramienta principal para depurar. Inspecciona el valor de las variables en cada paso.",
            order: 1,
            durationMinutes: 30,
            exercises: [
              {
                title: "Billetera simple",
                description: "Modela un saldo y una transacción.",
                instructions:
                  "Crea una función transaccion(saldo, monto) que sume o reste según el signo del monto y devuelva el nuevo saldo.",
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
              "# Funciones y arrays\n\nLas *arrow functions* y los métodos `map`, `filter` y `reduce` son parte del día a día.\n\n```js\nconst dobles = nums.map((n) => n * 2);\nconst pares = nums.filter((n) => n % 2 === 0);\nconst total = precios.reduce((acc, p) => acc + p, 0);\n```\n\n## Funciones puras\n\nDado el mismo input, una función pura devuelve siempre el mismo resultado y no modifica nada externo. Programar con funciones puras hace el código predecible y fácil de probar.\n\n> Prefiere `map`/`filter`/`reduce` sobre los bucles `for` clásicos para transformar datos.",
            order: 2,
            durationMinutes: 50,
            exercises: [
              {
                title: "Calcular total del carrito",
                description: "Suma precios con reduce.",
                instructions:
                  "Dado un array de objetos con {precio}, devuelve el total usando reduce (sin un bucle for clásico).",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 3,
                requirements: ["Usa el método reduce.", "No uses bucles for."],
                tests: ["Verificar uso de reduce", "Comprobar total correcto"],
              },
            ],
          },
          {
            slug: "objetos-destructuring",
            title: "Objetos y destructuring",
            markdown:
              "# Objetos y destructuring\n\nLos objetos agrupan datos relacionados. **Destructuring** extrae valores de forma limpia.\n\n```js\nconst usuario = { nombre: \"Ana\", edad: 28, pais: \"Argentina\" };\nconst { nombre, pais } = usuario;\nconsole.log(nombre, pais); // Ana Argentina\n\nconst cuadrado = ({ lado }) => lado * lado;\n```\n\n## Spread\n\nCopia objetos y arrays sin mutar el original:\n\n```js\nconst copia = { ...usuario, edad: 29 };\nconst nums2 = [1, 2, ...[3, 4]];\n```\n\n> Trabajar con copias en lugar de mutar evita errores difíciles de rastrear.",
            order: 3,
            durationMinutes: 35,
            exercises: [
              {
                title: "Normaliza el perfil",
                description: "Combina datos con destructuring y spread.",
                instructions:
                  "Dado un objeto base y un objeto con cambios, devuelve un objeto fusionado sin mutar el original usando spread.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 2,
                requirements: ["Usa destructuring al menos una vez.", "Usa spread para fusionar."],
                tests: ["Verificar destructuring", "Verificar spread y no mutación"],
              },
            ],
          },
          {
            slug: "asincronia-promesas",
            title: "Asincronía: promesas y async/await",
            markdown:
              "# Asincronía en JavaScript\n\nJavaScript es de un solo hilo: las operaciones lentas (fetch, archivos) no bloquean la interfaz gracias a las **promesas**.\n\n```js\nconst respuesta = await fetch(\"https://api.ejemplo.com/tareas\");\nconst datos = await respuesta.json();\nconsole.log(datos);\n```\n\n## async/await vs .then\n\n- `.then()` funciona y es válido.\n- `async/await` hace el código más legible, sobre todo con varios pasos.\n\n## Manejar errores\n\nEnvuelve el código asíncrono en `try/catch`:\n\n```js\ntry {\n  const r = await fetch(url);\n  if (!r.ok) throw new Error(\"Error de red\");\n} catch (err) {\n  console.error(err);\n}\n```\n\n> Nunca ignores un error de una promesa: siempre agrega un catch.",
            order: 4,
            durationMinutes: 50,
            exercises: [
              {
                title: "Carga tareas con fetch",
                description: "Consume una API y maneja errores.",
                instructions:
                  "Escribe una función async que haga fetch a una URL, valide que la respuesta es ok y devuelva los datos; en caso de error, lance una excepción clara.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 3,
                requirements: [
                  "Usa async/await.",
                  "Valida r.ok antes de devolver.",
                  "Incluye manejo de errores.",
                ],
                tests: ["Verificar async/await", "Verificar validación de respuesta"],
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
        estimatedHours: 6,
        lessons: [
          {
            slug: "commit-branch-merge",
            title: "Branches y merge",
            markdown:
              "# Branches y merge\n\nTrabajar con ramas permite avanzar sin romper `main`.\n\n```bash\ngit checkout -b feature/login\ngit add .\ngit commit -m \"agrega login\"\ngit checkout main\ngit merge feature/login\n```\n\n## Conflictos\n\nCuando dos ramas tocaron la misma línea, Git pide que resuelvas. Lee ambas versiones, decide qué queda, borra las marcas y haz `git add` y `git commit`.\n\n> Un flujo con ramas cortas, merged frecuentes y pruebas en cada PR reduce los conflictos grandes.",
            order: 1,
            durationMinutes: 55,
            exercises: [
              {
                title: "Ciclo completo con rama",
                description: "Crea, modifica y fusiona una rama.",
                instructions:
                  "Inicializa un repo, crea una rama feature, haz al menos un commit en ella, vuelve a main y fusiónala.",
                difficulty: C.BEGINNER,
                maxAttempts: 2,
                requirements: ["Crea una rama feature.", "Realiza al menos un commit.", "Fusiona la rama a main."],
                tests: ["Verificar que existe la rama feature", "Verificar merge realizado"],
              },
            ],
          },
          {
            slug: "push-y-pr",
            title: "Push, pull y pull requests",
            markdown:
              "# Push, pull y pull requests\n\nUn proyecto profesional vive en GitHub: tu código avanza con PRs revisadas.\n\n```bash\ngit push -u origin feature\ngit pull\n```\n\nUna **pull request** es la propuesta de integración de tu rama. La revisa el equipo, se ajusta y se fusiona.\n\n## Primer uso de remotes\n\n- `git remote add origin <url>` conecta un repo local con GitHub.\n- `git push -u origin <rama>` publica la rama y la asocia.\n- `git pull` sincroniza lo que cambió en el remoto.\n\n> Subir tu proyecto a GitHub y dejar un README claro es la primera pieza de tu portfolio.",
            order: 2,
            durationMinutes: 45,
            exercises: [
              {
                title: "Publica tu proyecto",
                description: "Conecta, sube y abre una PR.",
                instructions:
                  "Crea un repo en GitHub, conecta el remote origin, sube tu rama main y abre una pull request desde una rama de cambio.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 2,
                requirements: ["Conecta el remote origin.", "Sube una rama con push.", "Abre una PR."],
                tests: ["Verificar remote", "Verificar push", "Verificar PR"],
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
        description: "Diseño de endpoints, request/response, middlewares y validación.",
        order: 1,
        estimatedHours: 8,
        lessons: [
          {
            slug: "rutas-y-status",
            title: "Rutas y códigos de estado",
            markdown:
              "# Rutas y códigos de estado\n\nUna API REST expone recursos con verbos HTTP:\n\n- `GET /tareas` → 200\n- `POST /tareas` → 201\n- `PUT /tareas/:id` → 200\n- `DELETE /tareas/:id` → 204\n\n## Códigos clave\n\n- `200` OK · `201` Creado · `204` Sin contenido\n- `400` Petición inválida · `401` No autenticado · `403` Sin permisos · `404` No encontrado\n- `500` Error del servidor\n\n## Diseño de recursos\n\nUsa nombres en plural para colecciones (`/tareas`), identifica un elemento con su id (`/tareas/:id`) y refleja los subrecursos anidados cuando aportan claridad (`/tareas/:id/comentarios`).\n\n> Validar los datos de entrada siempre: nunca confíes en el cliente.",
            order: 1,
            durationMinutes: 40,
            exercises: [
              {
                title: "CRUD de tareas",
                description: "Implementa las 4 operaciones básicas.",
                instructions:
                  "Crea endpoints para listar, crear, actualizar y eliminar tareas en memoria, con los status codes correctos para cada caso.",
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
          {
            slug: "request-response",
            title: "Request y respuesta HTTP",
            markdown:
              "# Request y respuesta\n\nEl servidor lee la petición (método, headers, body, params, query) y devuelve una respuesta.\n\n## Datos de entrada\n\n- `req.params`: segmentos de ruta (`/tareas/:id`).\n- `req.query`: parámetros de consulta (`?estado=pendiente`).\n- `req.body`: cuerpo JSON en POST/PUT/PATCH.\n\n```js\napp.use(express.json());\n\napp.get(\"/tareas/:id\", (req, res) => {\n  const tarea = buscarPorId(req.params.id);\n  if (!tarea) return res.status(404).json({ error: \"No encontrada\" });\n  res.json(tarea);\n});\n```\n\n## Contrato consistente\n\nResponde siempre en JSON con la misma forma: éxito con los datos, error con `{ error: \"mensaje\" }`. Eso hace que el cliente sea simple y predecible.",
            order: 2,
            durationMinutes: 40,
            exercises: [
              {
                title: "Endpoint con params",
                description: "Sirve un recurso por id con 404.",
                instructions:
                  "Implementa GET /tareas/:id que devuelva la tarea indicada o responda 404 con { error } si no existe.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 2,
                requirements: [
                  "Lee el id desde req.params.",
                  "Devuelve 404 con un JSON de error si no existe.",
                ],
                tests: ["GET con id existente → 200", "GET con id inexistente → 404"],
              },
            ],
          },
          {
            slug: "middlewares-y-errores",
            title: "Middlewares y manejo de errores",
            markdown:
              "# Middlewares y manejo de errores\n\nUn **middleware** es una función que se ejecuta antes de llegar a una ruta: logging, autenticación, CORS, etc.\n\n```js\napp.use((req, res, next) => {\n  console.log(req.method, req.url);\n  next();\n});\n\napp.use((req, res, next) => {\n  if (!req.headers.authorization) {\n    return res.status(401).json({ error: \"Falta token\" });\n  }\n  next();\n});\n```\n\n## Error handler central\n\nEnvuelve toda la app y responde de forma consistente cuando algo falla:\n\n```js\napp.use((err, req, res, next) => {\n  console.error(err);   // logging del lado del servidor\n  res.status(500).json({ error: \"Error interno\" });\n});\n```\n\nNunca devuelvas el detalle interno de un error al cliente: expones información sensible.",
            order: 3,
            durationMinutes: 45,
            exercises: [
              {
                title: "Middleware de logging",
                description: "Registra cada petición.",
                instructions:
                  "Agrega un middleware que imprima método y ruta por cada petición, y un error handler que devuelva 500 en JSON.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 2,
                requirements: [
                  "Existe middleware de logging con next().",
                  "Existe un handler de errores que responde JSON.",
                ],
                tests: ["Verificar middleware", "Verificar error handler"],
              },
            ],
          },
          {
            slug: "validacion-entrada",
            title: "Validación de entrada",
            markdown:
              "# Validación de entrada\n\nValidar es no confiar en el cliente: un dato mal formado puede romper tu base de datos o tu seguridad.\n\n## Qué validar\n\n- Obligatoriedad: campos requeridos que faltan.\n- Formato: email, URL, UUID, rango.\n- Longitud: títulos demasiado largos, contraseñas débiles.\n- Tipos: número donde se esperaba número.\n\n```js\nfunction validarTarea(datos) {\n  if (!datos.titulo || datos.titulo.trim().length === 0) {\n    return { valido: false, error: \"El título es obligatorio\" };\n  }\n  if (datos.titulo.length > 120) {\n    return { valido: false, error: \"Título demasiado largo\" };\n  }\n  return { valido: true };\n}\n```\n\nDevuelve 400 con un mensaje claro y, de ser posible, el listado de errores encontrados.",
            order: 4,
            durationMinutes: 45,
            exercises: [
              {
                title: "Valida el título",
                description: "Rechaza datos inválidos con 400.",
                instructions:
                  "En POST /tareas valida que el título es obligatorio y de menos de 120 caracteres; responde 400 con el error correspondiente si falla.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 2,
                requirements: [
                  "Falta título → 400 con mensaje.",
                  "Título > 120 caracteres → 400.",
                ],
                tests: ["POST sin título → 400", "POST válido → 201"],
              },
            ],
          },
        ],
      },
      {
        slug: "autenticacion-jwt",
        title: "Autenticación JWT",
        description: "Contraseñas con hash, access y refresh tokens, autorización.",
        order: 2,
        estimatedHours: 8,
        lessons: [
          {
            slug: "contrasenas-y-bcrypt",
            title: "Contraseñas con hash",
            markdown:
              "# Hash de contraseñas\n\nNunca guardes contraseñas en texto plano. Se guardan con **hash + salt**.\n\n- **Hash**: transformación de un solo sentido (bcrypt, argon2).\n- **Salt**: valor aleatorio por usuario para que dos contraseñas iguales tengan hashes distintos.\n\n```js\nconst hash = await bcrypt.hash(password, 12);\nconst ok = await bcrypt.compare(passwordLngresada, hashGuardado);\n```\n\nRondas altas (10–12) hacen el hash lento a propósito: cuesta mucho adivinarlo por fuerza bruta.\n\n> Si te llega una contraseña en texto plano, ese sistema ya es vulnerable. El hash es solo una capa: también se usa HTTPS, límites de intentos y tokens.",
            order: 1,
            durationMinutes: 40,
            exercises: [
              {
                title: "Registro con hash",
                description: "Guarda contraseñas de forma segura.",
                instructions:
                  "En POST /register encripta la contraseña con bcrypt antes de guardar, y nunca devuelvas el hash en la respuesta.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 2,
                requirements: [
                  "Usas bcrypt para el hash.",
                  "La respuesta no incluye el hash.",
                ],
                tests: ["Verificar bcrypt", "Verificar que no se expone el hash"],
              },
            ],
          },
          {
            slug: "jwt-access-refresh",
            title: "Access y refresh tokens",
            markdown:
              "# Access y refresh tokens\n\nEl **access token** es de corta vida y viaja en cookie `httpOnly`; el **refresh token** permite renovar la sesión sin volver a pedir credenciales.\n\n- El servidor firma los tokens con un secreto.\n- El cliente solo envía la cookie: el código del navegador nunca toca el token.\n- Si el access expira, el cliente llama a `/refresh` con el refresh token.\n\n```js\nconst accessToken = jwt.sign({ sub: user.id }, SECRET, { expiresIn: \"15m\" });\nconst refreshToken = jwt.sign({ sub: user.id }, SECRET, { expiresIn: \"30d\" });\n```\n\n> Nunca expongas el secreto en el código del cliente. Los tokens cortos reducen el daño si un token se filtra.",
            order: 2,
            durationMinutes: 45,
            exercises: [
              {
                title: "Login con cookie httpOnly",
                description: "Protege una ruta privada con JWT.",
                instructions:
                  "Implementa POST /login que firme un JWT, lo guarde en una cookie httpOnly, y un middleware que proteja GET /me.",
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
          {
            slug: "autorizacion-roles",
            title: "Autorización y roles",
            markdown:
              "# Autorización y roles\n\nAutenticación es *quién es la persona*; autorización es *qué puede hacer*.\n\n## Roles\n\n- `admin`: gestiona usuarios y configuración.\n- `usuario`: usa sus propios recursos.\n\n## Reglas comunes\n\n```js\nfunction autorizar(...roles) {\n  return (req, res, next) => {\n    if (!req.user) return res.status(401).json({ error: \"No autenticado\" });\n    if (!roles.includes(req.user.rol)) return res.status(403).json({ error: \"Sin permisos\" });\n    next();\n  };\n}\n\napp.delete(\"/tareas/:id\", autorizar(\"admin\"), eliminarTarea);\n```\n\n## Acceso por dueño\n\nAdemás del rol, verifica la propiedad: un usuario no debe modificar los recursos de otro (`tarea.usuarioId === req.user.id`). Los datos sensibles usan `select` para no devolver campos innecesarios.",
            order: 3,
            durationMinutes: 45,
            exercises: [
              {
                title: "Ruta solo-admin",
                description: "Bloquea un endpoint por rol.",
                instructions:
                  "Protege DELETE /tareas/:id para que solo el rol admin la use; cualquier otro rol recibe 403.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 2,
                requirements: [
                  "Sin token → 401.",
                  "Token sin rol admin → 403.",
                  "Admin → 204.",
                ],
                tests: ["401 sin token", "403 con rol usuario", "204 con admin"],
              },
            ],
          },
        ],
      },
      {
        slug: "base-de-datos",
        title: "Base de datos con PostgreSQL",
        description: "Modelado, consultas y relaciones con Prisma.",
        order: 3,
        estimatedHours: 8,
        lessons: [
          {
            slug: "postgres-y-prisma",
            title: "PostgreSQL y Prisma",
            markdown:
              "# Bases de datos relacionales\n\nPostgreSQL guarda datos en **tablas** con columnas tipadas y **relaciones** entre ellas.\n\n**Prisma** define el esquema en un archivo y genera un cliente tipado:\n\n```prisma\nmodel Tarea {\n  id        Int      @id @default(autoincrement())\n  titulo    String\n  estado    String   @default(\"pendiente\")\n  creadaEn  DateTime @default(now())\n}\n```\n\n## Migraciones\n\n```bash\nprisma migrate dev --name \"crear tarea\"\n```\n\n> Prisma tipa las consultas: muchos errores de datos se detectan en tiempo de compilación.",
            order: 1,
            durationMinutes: 40,
            exercises: [
              {
                title: "Modelo Tarea",
                description: "Define y migra tu primera tabla.",
                instructions:
                  "Define un modelo Tarea con Prisma (titulo String, estado String con default) y ejecuta una migración inicial.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 2,
                requirements: [
                  "El modelo Tarea existe en el schema.",
                  "Se ejecuta una migración correctamente.",
                ],
                tests: ["Verificar modelo", "Verificar migración aplicada"],
              },
            ],
          },
          {
            slug: "modelos-y-consultas",
            title: "Consultas: create, findMany, update",
            markdown:
              "# Consultas con Prisma Client\n\nLas operaciones CRUD mapean al modelo:\n\n```js\nconst creada = await prisma.tarea.create({ data: { titulo: \"Comprar pan\" } });\nconst list = await prisma.tarea.findMany({ orderBy: { creadaEn: \"desc\" } });\nconst una = await prisma.tarea.findUnique({ where: { id: 1 } });\nconst act = await prisma.tarea.update({ where: { id: 1 }, data: { estado: \"hecha\" } });\nconst del = await prisma.tarea.delete({ where: { id: 1 } });\n```\n\n## Filtros\n\n`findMany({ where: { estado: \"pendiente\" } })` filtra por igualdad; puedes combinar con `AND`/`OR`.\n\n> Conecta tus endpoints REST a estas consultas: el CRUD en memoria del módulo anterior se convierte en persistente.",
            order: 2,
            durationMinutes: 45,
            exercises: [
              {
                title: "CRUD persistente",
                description: "Mueve tu CRUD a PostgreSQL.",
                instructions:
                  "Reemplaza el array en memoria por consultas de Prisma: listar, crear, actualizar y eliminar tareas en PostgreSQL.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 3,
                requirements: [
                  "Listar usa findMany.",
                  "Crear usa create.",
                  "Actualizar usa update.",
                  "Borrar usa delete.",
                ],
                tests: ["GET lista de la DB", "POST persiste", "DELETE afecta la DB"],
              },
            ],
          },
          {
            slug: "relaciones-y-cascada",
            title: "Relaciones y borrado en cascada",
            markdown:
              "# Relaciones\n\nLas entidades se relacionan: una tarea tiene muchos comentarios, un usuario tiene muchas tareas.\n\n```prisma\nmodel Usuario {\n  id      Int      @id @default(autoincrement())\n  email   String   @unique\n  tareas  Tarea[]\n}\n\nmodel Tarea {\n  id        Int      @id @default(autoincrement())\n  titulo    String\n  usuario   Usuario  @relation(fields: [usuarioId], references: [id])\n  usuarioId Int\n}\n```\n\n## Consultas anidadas\n\n```js\nconst usuario = await prisma.usuario.findUnique({\n  where: { id: 1 },\n  include: { tareas: true },\n});\n```\n\n## OnDelete\n\n`onDelete: Cascade` borra los registros relacionados al borrar el padre; sin esto la base rechaza el borrado. Define siempre qué debe pasar con los hijos.",
            order: 3,
            durationMinutes: 45,
            exercises: [
              {
                title: "Relación Usuario-Tarea",
                description: "Modela y consulta datos relacionados.",
                instructions:
                  "Agrega un modelo Usuario, relacionalo con Tarea, y escribe una consulta que traiga el usuario con sus tareas usando include.",
                difficulty: C.ADVANCED,
                maxAttempts: 2,
                requirements: [
                  "Existe la relación Usuario-Tarea.",
                  "Usa include para traer las tareas del usuario.",
                ],
                tests: ["Verificar relación", "Verificar include"],
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
      "Componentes, estado, datos remotos, enrutado y buenas prácticas en el navegador.",
    type: C.MID,
    order: 3,
    modules: [
      {
        slug: "react-componentes",
        title: "Componentes y props",
        description: "Componentes, composición, listas y keys.",
        order: 1,
        estimatedHours: 6,
        lessons: [
          {
            slug: "componentes-props",
            title: "Componentes y props",
            markdown:
              "# Componentes y props\n\nUn componente recibe `props` y devuelve JSX. Los datos fluyen **de arriba hacia abajo**.\n\n```jsx\nfunction Tarjeta({ titulo, children }) {\n  return (\n    <article>\n      <h3>{titulo}</h3>\n      {children}\n    </article>\n  );\n}\n```\n\n## Reglas\n\n- Los componentes se declaran con la primera letra en mayúscula.\n- Las props son de solo lectura: el padre las pasa, el hijo nunca las modifica.\n- Un componente debe ser **predecible**: mismo props, mismo resultado.",
            order: 1,
            durationMinutes: 35,
            exercises: [
              {
                title: "Tarjeta reutilizable",
                description: "Renderiza datos con props.",
                instructions:
                  "Crea un componente Tarjeta que reciba titulo, descripcion y una etiqueta, y renderícelo en una lista de 3 tarjetas distintas.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 2,
                requirements: ["El componente recibe props.", "Se reutiliza al menos 2 veces."],
                tests: ["Props fluyen al componente", "Componente reutilizado"],
              },
            ],
          },
          {
            slug: "composicion-children",
            title: "Composición y children",
            markdown:
              "# Composición\n\nEn lugar de pasar cientos de props, compones: un componente contenedor envuelve contenido con `children`.\n\n```jsx\nfunction Modal({ abierto, titulo, children }) {\n  if (!abierto) return null;\n  return (\n    <div className=\"modal\">\n      <h2>{titulo}</h2>\n      {children}\n    </div>\n  );\n}\n\n<Modal abierto={vista} titulo=\"Nueva tarea\">\n  <form>...</form>\n</Modal>\n```\n\n## Ventajas\n\n- Separa estructura de contenido.\n- Reutiliza contenedores (modal, tarjeta, layout) para cualquier contenido.\n- Facilita aislar cada pieza en pruebas.",
            order: 2,
            durationMinutes: 35,
            exercises: [
              {
                title: "Modal con children",
                description: "Construye un layout reutilizable.",
                instructions:
                  "Crea un componente Modal que muestre children cuando esté abierto y pasale un formulario como contenido.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 2,
                requirements: ["Usa children en el componente.", "No muestra nada cuando está cerrado."],
                tests: ["Verificar children", "Verificar condición de cerrado"],
              },
            ],
          },
          {
            slug: "listas-y-keys",
            title: "Listas y keys",
            markdown:
              "# Listas y keys\n\nPara renderizar una lista usas `map`. Cada elemento necesita una `key` estable y única para que React lo identifique.\n\n```jsx\nconst tareas = [{ id: 1, titulo: \"Estudiar\" }, { id: 2, titulo: \"Practicar\" }];\n\n<ul>\n  {tareas.map((t) => (\n    <li key={t.id}>{t.titulo}</li>\n  ))}\n</ul>\n```\n\n## Errores comunes\n\n- Usar el índice como key rompe el estado cuando la lista se reordena.\n- Omitir la key hace que React deja advertencias y renderice mal.\n\n> La key debe salir de un identificador único del dato, no de su posición.",
            order: 3,
            durationMinutes: 30,
            exercises: [
              {
                title: "Lista con key correcta",
                description: "Renderiza un array con map y key.",
                instructions:
                  "Recibe un array de tareas con id y titulo, y renderiza cada una en un <li> con key={t.id}.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 2,
                requirements: ["Usa .map() para renderizar.", "Cada item tiene key único."],
                tests: ["Usa .map()", "Cada item tiene key"],
              },
            ],
          },
        ],
      },
      {
        slug: "react-estado",
        title: "Estado y efectos",
        description: "useState, formularios, useEffect y estado compartido.",
        order: 2,
        estimatedHours: 6,
        lessons: [
          {
            slug: "use-state-forms",
            title: "useState y formularios",
            markdown:
              "# useState y formularios\n\n`useState` guarda estado local; los componentes controlados fijan el valor del input con el estado.\n\n```jsx\nconst [email, setEmail] = useState(\"\");\n\n<input\n  value={email}\n  onChange={(e) => setEmail(e.target.value)}\n/>\n```\n\n## Notas importantes\n\n- El estado se actualiza de forma **asíncrona**: calcula siempre sobre la versión más reciente.\n- Nunca lo mutes: crea un nuevo valor (`setLista([...lista, item])`).\n- Lee el formulario completo en `onSubmit`, no en cada tecla.",
            order: 1,
            durationMinutes: 40,
            exercises: [
              {
                title: "Formulario controlado",
                description: "Captura email y contraseña con estado.",
                instructions:
                  "Crea un formulario con inputs controlados por useState y muestra en vivo lo que se escribe.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 2,
                requirements: ["Inputs controlados con useState.", "Botón disabled si algún campo vacío."],
                tests: ["Inputs controlados", "Botón se habilita al completar"],
              },
            ],
          },
          {
            slug: "use-effect-datos",
            title: "useEffect y datos remotos",
            markdown:
              "# useEffect y datos remotos\n\n`useEffect` sincroniza tu componente con algo externo: un fetch, una suscripción, el DOM.\n\n```jsx\nconst [tareas, setTareas] = useState([]);\nconst [cargando, setCargando] = useState(true);\n\nuseEffect(() => {\n  let activo = true;\n  fetch(\"/api/tareas\")\n    .then((r) => r.json())\n    .then((datos) => {\n      if (activo) setTareas(datos);\n    })\n    .finally(() => {\n      if (activo) setCargando(false);\n    });\n  return () => {\n    activo = false; // evita setState tras desmontar\n  };\n}, []);\n```\n\n## Estados de carga y error\n\nManeja tres estados: `cargando`, `error` y `datos`. Mostrar \"Cargando…\", un error claro y luego el contenido real es la experiencia que espera cualquier usuaria.",
            order: 2,
            durationMinutes: 45,
            exercises: [
              {
                title: "Carga datos con efecto",
                description: "Fetch + estados de UI.",
                instructions:
                  "Carga una lista desde /api/tareas con useEffect, muestra un mensaje mientras carga, y la lista o un error cuando llegue la respuesta.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 3,
                requirements: [
                  "Usa useEffect para el fetch.",
                  "Hay un estado de carga visible.",
                  "Hay un estado de error posible.",
                ],
                tests: ["Verificar useEffect", "Verificar estado de carga"],
              },
            ],
          },
          {
            slug: "estado-compartido",
            title: "Estado compartido: lifting y refs",
            markdown:
              "# Compartir estado entre componentes\n\nCuando dos componentes necesitan el mismo dato, **levanta el estado** al ancestro común y pásalo por props.\n\n```jsx\nfunction App() {\n  const [contador, setContador] = useState(0);\n  return (\n    <>\n      <Boton alHacerClick={() => setContador(contador + 1)} />\n      <Resultado valor={contador} />\n    </>\n  );\n}\n```\n\n## useRef\n\n`useRef` guarda un valor mutable que **no dispara re-render**, ideal para enfocar inputs:\n\n```jsx\nconst inputRef = useRef(null);\ninputRef.current?.focus();\n```\n\n> Regla: ¿el dato afecta la UI? Entonces estado. Si solo es un valor técnico, quizá un ref.",
            order: 3,
            durationMinutes: 40,
            exercises: [
              {
                title: "Lifting state up",
                description: "Comparte estado entre hermanos.",
                instructions:
                  "Crea un botón que incrementa un contador y un componente que muestre el valor, compartidos a través del ancestro común.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 2,
                requirements: ["El estado vive en el ancestro común.", "El valor se muestra en un hijo distinto."],
                tests: ["Verificar lifting", "El contador se actualiza"],
              },
            ],
          },
        ],
      },
      {
        slug: "react-datos-routing",
        title: "Datos, rutas y despliegue",
        description: "Consumo de APIs, enrutado, variables de entorno y deploy.",
        order: 3,
        estimatedHours: 6,
        lessons: [
          {
            slug: "fetch-y-errores",
            title: "Manejo de errores en fetch",
            markdown:
              "# Errores en el frontend\n\nTodo lo que viene de la red puede fallar: el servidor cae, la red se corta, la API cambió.\n\n```jsx\nasync function cargar() {\n  setError(null);\n  try {\n    const r = await fetch(\"/api/tareas\");\n    if (!r.ok) throw new Error(\"Respuesta fallida\");\n    const datos = await r.json();\n    setTareas(datos);\n  } catch (err) {\n    setError(err.message);\n  }\n}\n```\n\n## Mensajes útiles\n\nA la persona usuaria le interesa que pase algo claro y accionable: \"No se pudieron cargar las tareas. Reintenta.\", junto a un botón de reintentar.\n\n> No muestres los detalles técnicos internos en la UI. Regístralos en consola para depurar.",
            order: 1,
            durationMinutes: 40,
            exercises: [
              {
                title: "Fetch con reintento",
                description: "Estado de error claro.",
                instructions:
                  "Carga datos con fetch, muestra un mensaje de error claro y un botón que reintente la carga.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 2,
                requirements: [
                  "Maneja r.ok.",
                  "Hay un botón de reintentar.",
                  "El error no se traga en silencio.",
                ],
                tests: ["Verificar manejo de error", "Verificar botón de reintento"],
              },
            ],
          },
          {
            slug: "rutas-y-navegacion",
            title: "Enrutado y navegación",
            markdown:
              "# Enrutado\n\nUna SPA no recarga la página entre pantallas: el **router** hace el cambio.\n\nEn Next (App Router) cada carpeta dentro de `app/` es una ruta:\n\n```\napp/\n  layout.tsx      -> estructura común\n  page.tsx        -> /\n  tareas/page.tsx -> /tareas\n  tareas/[id]/page.tsx -> /tareas/1\n```\n\nNavegas con `<Link>` y lees la ruta con `useParams()` o `useRouter()`.\n\n## Niveles de renderizado\n\n- **Client component** (`\"use client\"`): interactivo, con estado.\n- **Server component**: se renderiza en el servidor; ideal para datos y contenido.",
            order: 2,
            durationMinutes: 40,
            exercises: [
              {
                title: "Página de detalle",
                description: "Crea una ruta dinámica.",
                instructions:
                  "Crea una ruta dinámica tareas/[id] que muestre el id desde la URL y enlaces de navegación con Link.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 2,
                requirements: ["Existe la ruta dinámica.", "Lee el id de la URL.", "Usa Link para navegar."],
                tests: ["Verificar ruta dinámica", "Verificar Link"],
              },
            ],
          },
          {
            slug: "entorno-y-despliegue",
            title: "Variables de entorno y despliegue",
            markdown:
              "# Entorno y despliegue\n\nUna app se ejecuta en distintos entornos: local, staging, producción. Las **variables de entorno** separan configuración de código.\n\n```bash\n# .env.local (nunca se sube a Git)\nNEXT_PUBLIC_API_URL=https://api.tu-proyecto.com\n```\n\n- `NEXT_PUBLIC_*` se expone al navegador.\n- Las secretas (`DB_URL`, `JWT_SECRET`) viven solo en el servidor.\n- `.gitignore` debe excluir `.env*`.\n\n## Tips de deploy\n\n- Compila con `npm run build` antes de publicar.\n- Configura HTTPS en producción.\n- Monitorea errores (logs, alertas).",
            order: 3,
            durationMinutes: 35,
            exercises: [
              {
                title: "Configura el entorno",
                description: "Aísla la URL de tu API.",
                instructions:
                  "Mueve la URL de tu API a una variable NEXT_PUBLIC_ en un archivo .env.local y verifica que la app la lee y funciona.",
                difficulty: C.INTERMEDIATE,
                maxAttempts: 2,
                requirements: [
                  "La URL vive en una variable de entorno.",
                  "El .env.local está en .gitignore.",
                ],
                tests: ["Verificar variable de entorno", "Verificar .gitignore"],
              },
            ],
          },
        ],
      },
    ],
  },
];

async function upsertCourse() {
  await prisma.exercise.deleteMany({});
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
            order: lesson.order,
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