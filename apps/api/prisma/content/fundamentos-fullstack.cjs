"use strict";
// Contenido del track: Fundamentos Fullstack.

/* ===========================================================================
 * ESTRUCTURA DEL OBJETO EXPORTADO (un archivo .cjs = un track del curso)
 * ---------------------------------------------------------------------------
 * module.exports = {
 *   slug:        string   // identificador único del track (clave del seed)
 *   title:       string   // nombre visible del track
 *   description: string   // resumen de lo que enseña el track
 *   type:        string   // TrackType: "JUNIOR" | "MID" | "SENIOR"
 *   order:       number   // posición del track dentro del curso
 *   modules: [            // módulos del track, en orden
 *     {
 *       slug:           string  // identificador del módulo dentro del track
 *       title:          string  // nombre visible del módulo
 *       description:    string  // resumen del módulo
 *       order:          number  // posición del módulo dentro del track
 *       estimatedHours: number  // horas estimadas de trabajo
 *       lessons: [              // lecciones del módulo
 *         {
 *           slug:            string   // identificador de la lección
 *           title:           string   // nombre visible de la lección
 *           markdown:        string   // cuerpo de la lección (texto markdown)
 *           order:           number   // posición de la lección dentro del módulo
 *           durationMinutes: number   // duración estimada en minutos
 *           exercises: [              // ejercicios prácticos de la lección
 *             {
 *               title:        string    // nombre del ejercicio (clave natural del seed)
 *               description:  string    // resumen breve del ejercicio
 *               instructions: string    // consigna detallada para el estudiante
 *               difficulty:   string    // Difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
 *               maxAttempts:  number    // intentos máximos permitidos
 *               requirements: string[]  // requisitos que debe cumplir la entrega
 *               tests:        string[]  // pruebas/verificaciones que se ejecutan
 *             }
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 * }
 *
 * NOTA: el contenido de los strings `markdown` es texto del curso y NO debe
 * modificarse desde aquí; este archivo solo aporta datos al seed.
 * ===========================================================================
 */

module.exports = {
  slug: "fundamentos-fullstack",
  title: "Fundamentos Fullstack",
  description:
    "Base sólida desde cero: HTML semántico, CSS moderno, JavaScript completo (DOM, módulos, asincronía) y control de versiones. El punto de partida para cualquier especialidad.",
  type: "JUNIOR",
  order: 1,
  modules: [
    {
      slug: "fundamentos-html-css",
      title: "HTML y CSS",
      description: "Semántica, layout con Flexbox y Grid, diseño responsive, formularios y accesibilidad.",
      order: 1,
      estimatedHours: 9,
      lessons: [
        {
          slug: "html-semantico",
          title: "HTML semántico",
          order: 1,
          durationMinutes: 40,
          markdown:
            "# HTML semántico\n\nHTML es el esqueleto de la web. Escribir con **semántica** significa usar la etiqueta correcta para cada contenido: es la base de una página accesible, indexable por buscadores y fácil de mantener.\n\n## Etiquetas de estructura\n\nEn lugar de llenar todo de `<div>`, usa etiquetas que describen su función:\n\n```html\n<body>\n  <header>\n    <nav>Inicio · Proyectos · Contacto</nav>\n  </header>\n  <main>\n    <h1>Mi portfolio</h1>\n    <section>\n      <h2>Proyectos</h2>\n    </section>\n    <aside>Datos de contacto</aside>\n  </main>\n  <footer>© 2026 Ana</footer>\n</body>\n```\n\n- `<header>`: encabezado de la página o de una sección.\n- `<nav>`: bloque de navegación.\n- `<main>`: contenido principal (uno por página).\n- `<section>`: sección temática, normalmente con su propio encabezado.\n- `<article>`: contenido independiente y autocontenido (una noticia, un post).\n- `<aside>`: contenido secundario.\n- `<footer>`: pie de página.\n\n## Jerarquía de encabezados\n\nLos encabezados van de `<h1>` a `<h6>` y forman el índice del documento.\n\n- Un solo `<h1>` por página.\n- No saltees niveles: si usas `<h2>`, sus hijos son `<h3>`.\n- Los encabezados describen contenido, no tamaño: el tamaño se controla con CSS.\n\n## Imágenes y texto\n\n```html\n<img src='foto.jpg' alt='Ana programando en su escritorio' />\n<time datetime='2026-01-15'>15 de enero</time>\n```\n\nEl atributo `alt` es obligatorio: describe la imagen para lectores de pantalla y aparece si no carga.\n\n## Por qué importa la semántica\n\n- **Accesibilidad**: los lectores de pantalla navegan por regiones y encabezados.\n- **SEO**: los buscadores entienden mejor la estructura.\n- **Mantenibilidad**: el código se lee solo.\n- **Comportamiento nativo**: etiquetas como `<button>` ya son accesibles con teclado.\n\n## Buenas prácticas\n\n- Un `<h1>` por página y jerarquía coherente.\n- Usa `<button>` para acciones y `<a>` para navegar; no un `<div>` con click.\n- Agrupa formularios con `<label>`, `<fieldset>` y `<legend>`.\n- Cierra las etiquetas y valida tu HTML con el validador del W3C.\n\n> Error común: usar `<div>` para todo y simular botones. Se pierde accesibilidad y significado. Elige siempre la etiqueta que describa el contenido.\n\n## Resumen y práctica\n\nAprendiste la estructura semántica, la jerarquía de encabezados y por qué importan. Practica convirtiendo un esqueleto de divs en HTML semántico.",
          exercises: [
            {
              title: "Estructura semántica de un portfolio",
              description: "Convierte un esqueleto con divs en HTML semántico.",
              instructions:
                "Crea un archivo index.html que use header, nav, main, section y footer. Incluye una sección de proyectos con al menos dos article, una imagen con alt descriptivo y una sección de contacto. Usa un solo h1 y jerarquía de encabezados coherente.",
              difficulty: "BEGINNER",
              maxAttempts: 3,
              requirements: [
                "Usa al menos 5 etiquetas semánticas (header, nav, main, section, article, footer).",
                "Hay exactamente un h1 en la página.",
                "Toda imagen tiene atributo alt.",
                "El HTML valida sin errores.",
              ],
              tests: ["Buscar etiquetas semánticas", "Verificar un solo h1", "Verificar alt en imágenes"],
            },
          ],
        },
        {
          slug: "css-flexbox-grid",
          title: "CSS: Flexbox y Grid",
          order: 2,
          durationMinutes: 50,
          markdown:
            "# Layout moderno: Flexbox y Grid\n\nCSS moderno resuelve el layout con dos sistemas: **Flexbox** distribuye elementos en un eje (fila o columna) y **Grid** organiza en dos dimensiones (filas y columnas).\n\n## El modelo de caja\n\nTodo elemento es una caja con cuatro capas, de afuera hacia adentro:\n\n- `margin`: espacio exterior.\n- `border`: el borde.\n- `padding`: espacio interior.\n- `content`: el contenido.\n\n```css\n* { box-sizing: border-box; }\n```\n\nCon `box-sizing: border-box`, el `padding` y el `border` se incluyen en el ancho declarado y no desbordan el layout. Es lo primero que se define en un proyecto.\n\n## Flexbox (un eje)\n\n```css\n.fila {\n  display: flex;\n  gap: 16px;\n  align-items: center;      /* alineación vertical */\n  justify-content: space-between; /* reparto horizontal */\n  flex-wrap: wrap;          /* pasa a la siguiente línea si no cabe */\n}\n.item { flex: 1; }          /* reparte el espacio disponible por igual */\n```\n\nPropiedades clave: `justify-content` (eje principal), `align-items` (eje cruzado), `gap` (espaciado sin márgenes), `flex-grow/shrink/basis`.\n\n## Grid (dos ejes)\n\n```css\n.layout {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n```\n\n- `fr` es una fracción del espacio libre.\n- `repeat(3, 1fr)` crea 3 columnas iguales.\n- `minmax(200px, 1fr)` permite columnas fluidas con mínimo.\n\n## Cuándo usar cada uno\n\n- **Grid** para la estructura general de la página y grillas de tarjetas.\n- **Flexbox** para componentes internos: barras, filas de botones, alineaciones.\n\n## Patrón: tarjetas responsive sin media queries\n\n```css\n.galeria {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));\n  gap: 20px;\n}\n```\n\nEste patrón llena automáticamente cuantas columnas entren, sin escribir media queries.\n\n## Buenas prácticas\n\n- Empieza el CSS con `box-sizing: border-box`.\n- Usa `gap` en vez de márgenes manuales en flex/grid.\n- Prefiere `minmax` y `auto-fill` para grillas fluidas.\n- Evita `float` y `position` para layouts; resérvalos para casos puntuales.\n\n> Error común: anidar flexbox innecesariamente. Muchas veces un `gap` y `flex-wrap` resuelven lo que parece requerir estructuras complejas.\n\n## Resumen y práctica\n\nDominaste el modelo de caja, Flexbox y Grid. Practica crear una barra de navegación con flex y una grilla de tarjetas.",
          exercises: [
            {
              title: "Barra de navegación y grilla con Flexbox/Grid",
              description: "Distribuye elementos con flex y grid.",
              instructions:
                "Crea un archivo estilos.css y una página. El nav debe usar display:flex con el logo a la izquierda y los enlaces a la derecha alineados al centro vertical. Debajo, una galería de al menos 4 tarjetas con display:grid, columnas fluidas con minmax y gap. Aplica box-sizing: border-box globalmente.",
              difficulty: "BEGINNER",
              maxAttempts: 2,
              requirements: [
                "Usa display:flex en el nav.",
                "Los enlaces se alinean con margin-left:auto o justify-content.",
                "La galería usa display:grid con minmax.",
                "Aplicas box-sizing: border-box.",
              ],
              tests: ["Comprobar display:flex", "Comprobar alineación de enlaces", "Comprobar display:grid"],
            },
          ],
        },
        {
          slug: "css-responsivo",
          title: "Diseño responsive: media queries y unidades",
          order: 3,
          durationMinutes: 45,
          markdown:
            "# Diseño responsive\n\nUna página debe verse bien en celulares, tablets y monitores. El enfoque profesional es **mobile-first**: se diseñan primero los estilos del celular y se mejoran con `min-width` para pantallas grandes.\n\n## Mobile-first con media queries\n\n```css\n.galeria {\n  display: grid;\n  grid-template-columns: 1fr;      /* 1 columna en móvil */\n  gap: 16px;\n}\n\n@media (min-width: 700px) {\n  .galeria { grid-template-columns: repeat(2, 1fr); }\n}\n\n@media (min-width: 1024px) {\n  .galeria { grid-template-columns: repeat(3, 1fr); }\n}\n```\n\nCon `min-width` los estilos se **suman** a medida que crece la pantalla: menos código y sin sorpresas.\n\n## La etiqueta viewport\n\nSin esto, los celulares renderizan la página a tamaño de escritorio:\n\n```html\n<meta name='viewport' content='width=device-width, initial-scale=1' />\n```\n\n## Unidades relativas\n\n- `rem`: relativa al tamaño de fuente de la raíz. Ideal para tipografía y espaciados consistentes.\n- `em`: relativa al tamaño del elemento padre.\n- `%`: relativa al contenedor.\n- `vw`/`vh`: porcentaje del viewport.\n- `clamp(min, preferido, max)`: valor fluido con límites.\n\n```css\nh1 { font-size: clamp(28px, 5vw, 56px); }\n.contenedor { width: min(1100px, 92%); margin: 0 auto; }\n```\n\n`clamp` ajusta el tamaño según la pantalla sin media queries.\n\n## Imágenes y medios fluidos\n\n```css\nimg { max-width: 100%; height: auto; display: block; }\n```\n\nEvita que las imágenes desborden su contenedor.\n\n## Probar el responsive\n\n- DevTools: modo dispositivo, prueba varios anchos (320, 768, 1024, 1440).\n- Revisa que no haya scroll horizontal ni textos cortados.\n- Navega solo con el teclado para detectar problemas de foco.\n\n## Buenas prácticas\n\n- Diseña mobile-first.\n- Usa `rem` y `clamp` antes que tamaños fijos en píxeles.\n- Añade el meta viewport siempre.\n- Prueba en tamaño angosto: un menú que no entra es señal de layout frágil.\n\n> Error común: hacer zoom en el celular para leer. Si el usuario necesita hacer zoom, el layout no es responsive de verdad.\n\n## Resumen y práctica\n\nAprendiste mobile-first, media queries y unidades fluidas. Practica una galería que cambie de columnas según el ancho.",
          exercises: [
            {
              title: "Grilla responsive mobile-first",
              description: "Haz una galería que se adapte al viewport.",
              instructions:
                "Crea una grilla de tarjetas que en móvil tenga 1 columna, en pantallas medianas (min-width: 700px) 2 columnas y en grandes (min-width: 1024px) 3 columnas. Usa media queries con min-width y unidades clamp o relativas para la tipografía. Incluye el meta viewport.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "Usa media queries con min-width.",
                "La grilla cambia de 1 a 2 y 3 columnas.",
                "Incluye el meta viewport.",
                "Usa al menos una unidad relativa (rem, %, clamp).",
              ],
              tests: ["Verificar media queries", "Verificar cambio de columnas", "Verificar meta viewport"],
            },
          ],
        },
        {
          slug: "formularios-y-accesibilidad",
          title: "Formularios y accesibilidad",
          order: 4,
          durationMinutes: 45,
          markdown:
            "# Formularios y accesibilidad\n\nLos formularios son la principal forma en que las personas interactúan con una web: iniciar sesión, registrarse, buscar, enviar datos. Hacerlos accesibles y robustos es esencial.\n\n## Estructura accesible\n\n```html\n<form>\n  <label for='email'>Correo electrónico</label>\n  <input id='email' name='email' type='email' required autocomplete='email' />\n\n  <label for='pass'>Contraseña</label>\n  <input id='pass' name='pass' type='password' required minlength='8' />\n\n  <button type='submit'>Ingresar</button>\n</form>\n```\n\n- `label for` apunta al `id` del input: al hacer clic en el texto se enfoca el campo.\n- `name` es la clave con la que viaja el dato al servidor.\n- `autocomplete` ayuda a los gestores de contraseñas.\n\n## Validación nativa\n\nHTML valida sin JavaScript:\n\n- `required`: obligatorio.\n- `type=email`: formato de correo.\n- `minlength` / `maxlength`: longitud.\n- `min` / `max` / `step`: rangos numéricos.\n- `pattern`: expresión regular.\n\n```html\n<input type='number' min='1' max='10' step='1' />\n<input type='text' pattern='[A-Za-z]{3,}' />\n```\n\nEl servidor **siempre** debe revalidar: la validación del navegador es una ayuda de UX, no seguridad.\n\n## Agrupar y describir\n\n```html\n<fieldset>\n  <legend>Plan de suscripción</legend>\n  <label><input type='radio' name='plan' value='free' /> Gratis</label>\n  <label><input type='radio' name='plan' value='pro' /> Pro</label>\n</fieldset>\n```\n\n`fieldset` + `legend` agrupan campos relacionados. `aria-describedby` asocia mensajes de ayuda o error.\n\n## Accesibilidad en general\n\n- Contraste de color suficiente (WCAG AA: 4.5:1 para texto normal).\n- Todo control operable con teclado y foco visible.\n- Textos alternativos en imágenes y enlaces con texto descriptivo.\n- Usa HTML nativo antes que ARIA: `<button>` ya es accesible.\n\n## Estados de formulario\n\n- Muestra errores junto al campo, con texto claro y color además de color.\n- Deshabilita el botón de envío mientras se procesa.\n- No borres lo que la persona escribió ante un error.\n\n## Buenas prácticas\n\n- Asocia siempre `label` con su input.\n- Usa el `type` correcto (`email`, `tel`, `number`, `date`).\n- Muestra los errores de forma accesible (`role=alert`, `aria-live`).\n- Valida también en el servidor.\n\n> Error común: usar `placeholder` como si fuera label. El placeholder desaparece al escribir y no lo leen bien los lectores de pantalla. Usa `<label>` siempre.\n\n## Resumen y práctica\n\nAprendiste formularios accesibles, validación nativa y buenas prácticas. Practica un formulario de registro completo.",
          exercises: [
            {
              title: "Formulario de registro accesible",
              description: "Construye un formulario usable y accesible.",
              instructions:
                "Crea un formulario de registro con campos de nombre, email y contraseña. Cada input debe tener su label asociado con for/id, tipos correctos, atributos de validación (required, minlength) y autocomplete. Agrega un fieldset con radios para elegir un plan y un botón de envío. Muestra un mensaje de ayuda asociado con aria-describedby.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "Todos los inputs tienen label asociado.",
                "Usas types correctos (email, password, text).",
                "Incluyes validación nativa (required, minlength).",
                "Agrupas los radios con fieldset y legend.",
              ],
              tests: ["Verificar labels", "Verificar types", "Verificar validación nativa"],
            },
          ],
        },
      ],
    },
    {
      slug: "fundamentos-javascript",
      title: "JavaScript moderno",
      description: "Variables, tipos, funciones, arrays, objetos, asincronía, DOM, eventos y módulos.",
      order: 2,
      estimatedHours: 12,
      lessons: [
        {
          slug: "variables-tipos",
          title: "Variables, tipos y control de flujo",
          order: 1,
          durationMinutes: 35,
          markdown:
            "# Variables y tipos\n\nJavaScript tiene tres formas de declarar variables, pero hoy se usan dos:\n\n- `const`: valor que no se reasigna. **Preferido por defecto.**\n- `let`: valor que sí cambia.\n- `var`: histórico y con problemas de alcance. Evítalo.\n\n```js\nconst nombre = 'Ana';\nlet edad = 28;\nedad += 1;            // 29\n// nombre = 'Otro';   // Error: no se puede reasignar una const\n```\n\n## Tipos primitivos\n\n- `string`: cadenas de texto.\n- `number`: números (enteros y decimales).\n- `boolean`: `true` o `false`.\n- `null`: ausencia intencional de valor.\n- `undefined`: variable sin valor asignado.\n- `bigint` y `symbol`: casos especiales.\n\n```js\nconst precio = 19.99;\nconst activo = true;\nconst nada = null;      // decidido\nlet pendiente;          // undefined\n```\n\nLos objetos y arrays son tipos de referencia (los vemos más adelante).\n\n## Operadores\n\n```js\n// Aritméticos\n1 + 2; 10 % 3; 2 ** 3;\n// Comparación: usa === (estricta)\n5 === 5;   '5' === 5;   // true, false\n// Lógicos\ntrue && false;  true || false;  !true;\n```\n\nUsa siempre `===` y `!==` en lugar de `==` y `!=` para evitar conversiones implícitas sorprendentes.\n\n## Condicionales\n\n```js\nconst edad = 20;\nif (edad >= 18) {\n  console.log('Es mayor');\n} else if (edad >= 13) {\n  console.log('Es adolescente');\n} else {\n  console.log('Es menor');\n}\n\nconst etiqueta = edad >= 18 ? 'mayor' : 'menor';   // ternario\n```\n\n## Bucles\n\n```js\nfor (let i = 0; i < 3; i++) console.log(i);\n\nconst frutas = ['pera', 'uva'];\nfor (const f of frutas) console.log(f);\n```\n\n## Plantillas de texto\n\n```js\nconst saludo = `Hola, ${nombre}. Tenés ${edad} años.`;\n```\n\nLas plantillas con backticks permiten interpolar expresiones y escribir texto en varias líneas.\n\n## Buenas prácticas\n\n- `const` por defecto, `let` solo si necesitas reasignar.\n- `===` en vez de `==`.\n- Nombres descriptivos en camelCase.\n- Usa `console.log` para inspeccionar valores mientras aprendes.\n\n> Error común: convertir números y strings con `+`. `'2' + 2` da `'22'`, no `4`. Convierte explícitamente con `Number(...)`.\n\n## Resumen y práctica\n\nViste variables, tipos, operadores, condicionales y bucles. Practica con una función que reciba un saldo y un monto.",
          exercises: [
            {
              title: "Billetera simple",
              description: "Modela un saldo y una transacción.",
              instructions:
                "Crea una función transaccion(saldo, monto) que sume o reste según el signo del monto y devuelva el nuevo saldo. Si el resultado quedaría negativo, devuelve el saldo original y muestra un mensaje con console.log. Declara la función con const y usa const/let correctamente.",
              difficulty: "BEGINNER",
              maxAttempts: 3,
              requirements: [
                "Declaras la función con const.",
                "Devuelve el saldo resultante correcto.",
                "Evita que el saldo quede negativo.",
                "Usas === y const/let en el código.",
              ],
              tests: ["Llamar transaccion(100, -30)", "Verificar retorno correcto", "Verificar saldo negativo evitado"],
            },
          ],
        },
        {
          slug: "funciones-arrays",
          title: "Funciones y arrays",
          order: 2,
          durationMinutes: 50,
          markdown:
            "# Funciones y arrays\n\nLas funciones agrupan lógica reutilizable y los arrays guardan listas de datos. Juntos son el corazón de JavaScript.\n\n## Formas de declarar funciones\n\n```js\nfunction sumar(a, b) { return a + b; }        // declaración\nconst restar = (a, b) => a - b;               // arrow function\nconst duplicar = (n) => n * 2;\n```\n\nLas arrow functions son compactas y no tienen su propio `this`, por eso son ideales como callbacks.\n\n## Parámetros\n\n```js\nfunction saludar(nombre = 'invitado') { return `Hola, ${nombre}`; }\nfunction suma(...nums) { return nums.reduce((a, n) => a + n, 0); }\n```\n\n- Valores por defecto con `=`.\n- Rest params `...nums` agrupan argumentos en un array.\n\n## Arrays: operaciones básicas\n\n```js\nconst nums = [3, 1, 2];\nnums.push(4);        // agrega al final\nnums.length;         // 4\nnums.includes(2);    // true\n```\n\n## map, filter y reduce\n\nSon los tres métodos que más usarás:\n\n```js\nconst nums = [1, 2, 3, 4];\nconst dobles = nums.map((n) => n * 2);           // [2, 4, 6, 8]\nconst pares = nums.filter((n) => n % 2 === 0);   // [2, 4]\nconst total = nums.reduce((acc, n) => acc + n, 0); // 10\n\nconst precios = [{ precio: 10 }, { precio: 20 }];\nconst suma = precios.reduce((acc, p) => acc + p.precio, 0); // 30\n```\n\n- `map`: transforma cada elemento.\n- `filter`: deja solo los que cumplen una condición.\n- `reduce`: combina todo en un único valor.\n\nSe pueden encadenar: `nums.filter((n) => n > 1).map((n) => n * 10)`.\n\n## Funciones puras\n\nUna función pura, dado el mismo input, devuelve siempre lo mismo y no modifica nada externo. Son predecibles y fáciles de probar.\n\n```js\n// pura\nconst doble = (n) => n * 2;\n// impura: modifica el array recibido\nfunction agregar(arr, x) { arr.push(x); return arr; }\n```\n\n## Buenas prácticas\n\n- Prefiere `map`/`filter`/`reduce` sobre bucles `for` para transformar datos.\n- No mutes los arrays originales: devuelve copias nuevas.\n- Funciones cortas que hagan una sola cosa.\n- Nombres que describan la acción (`calcularTotal`, `filtrarActivos`).\n\n> Error común: usar `forEach` para transformar y mutar un array. Para transformar, `map`; para filtrar, `filter`; para acumular, `reduce`.\n\n## Resumen y práctica\n\nAprendiste funciones, arrow functions y los métodos de array. Practica sumando precios con `reduce`.",
          exercises: [
            {
              title: "Calcular el total del carrito",
              description: "Suma precios con reduce.",
              instructions:
                "Dado un array de objetos con { precio, cantidad }, devuelve el total del carrito usando reduce (sin un bucle for clásico). Además, crea una función que use filter para devolver solo los productos con cantidad mayor a 0, y otra que use map para obtener solo los nombres.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 3,
              requirements: [
                "Usas reduce para calcular el total.",
                "Usas filter para productos activos.",
                "Usas map para obtener nombres.",
                "No usas bucles for clásicos.",
              ],
              tests: ["Verificar uso de reduce", "Verificar map y filter", "Comprobar total correcto"],
            },
          ],
        },
        {
          slug: "objetos-destructuring",
          title: "Objetos, destructuring y spread",
          order: 3,
          durationMinutes: 40,
          markdown:
            "# Objetos, destructuring y spread\n\nLos objetos agrupan datos relacionados con pares clave-valor. Saber leerlos y copiarlos de forma inmutable es clave para código limpio.\n\n## Objetos\n\n```js\nconst usuario = {\n  nombre: 'Ana',\n  edad: 28,\n  pais: 'Argentina',\n  saludar() { return `Hola, ${this.nombre}`; },\n};\n\nusuario.nombre;      // 'Ana'\nusuario['edad'];     // 28\n```\n\n## Destructuring\n\nExtrae valores con una sintaxis compacta:\n\n```js\nconst { nombre, pais } = usuario;\nconst { edad: anios } = usuario;      // renombra a anios\n\nfunction mostrar({ nombre, edad }) { console.log(nombre, edad); }\n```\n\n## Destructuring en arrays\n\n```js\nconst [primero, segundo] = ['a', 'b'];\nconst [, , tercero] = [1, 2, 3];      // 3\n```\n\n## Spread: copiar sin mutar\n\n```js\nconst copia = { ...usuario, edad: 29 };   // copia con edad cambiada\nconst nums = [1, 2, ...[3, 4]];           // [1, 2, 3, 4]\nconst mas = [...nums, 5];\n```\n\nSpread crea copias superficiales: ideal para actualizaciones inmutables.\n\n## Actualizar sin mutar (inmutabilidad)\n\n```js\nconst actualizado = { ...usuario, pais: 'Chile' };\n// usuario.pais sigue siendo 'Argentina'\n```\n\nEsto es la base de React y de cualquier estado predecible.\n\n## Métodos útiles de objetos\n\n```js\nObject.keys(usuario);     // claves\nObject.values(usuario);   // valores\nObject.entries(usuario);  // pares [clave, valor]\n```\n\n## Buenas prácticas\n\n- Usa destructuring en parámetros de funciones.\n- No mutes: crea copias con spread.\n- Nombres de propiedad descriptivos; evita estructuras demasiado anidadas.\n- Para claves dinámicas usa `{ [clave]: valor }`.\n\n> Error común: `const copia = usuario` no copia, crea otra referencia al mismo objeto. Para copiar hay que usar spread: `{ ...usuario }`.\n\n## Resumen y práctica\n\nAprendiste a leer, extraer y copiar objetos. Practica fusionando un objeto base con cambios sin mutar el original.",
          exercises: [
            {
              title: "Normaliza un perfil",
              description: "Combina datos con destructuring y spread.",
              instructions:
                "Dados un objeto base (por ejemplo { nombre, edad, pais }) y un objeto con cambios, devuelve un objeto fusionado sin mutar el original usando spread. Usa destructuring para extraer al menos dos campos en una función. Muestra que el objeto original no cambió.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "Usas destructuring al menos una vez.",
                "Usas spread para fusionar.",
                "El objeto original no se modifica.",
                "Funciona con propiedades nuevas que no estaban en el base.",
              ],
              tests: ["Verificar destructuring", "Verificar spread", "Verificar no mutación"],
            },
          ],
        },
        {
          slug: "asincronia-promesas",
          title: "Asincronía: promesas y async/await",
          order: 4,
          durationMinutes: 55,
          markdown:
            "# Asincronía en JavaScript\n\nJavaScript tiene un solo hilo de ejecución. Las operaciones lentas (red, archivos, temporizadores) no bloquean la interfaz gracias a la **asincronía** basada en promesas.\n\n## Qué es una promesa\n\nUna promesa representa un valor que estará disponible en el futuro. Puede resolverse (éxito) o rechazarse (error).\n\n```js\nconst promesa = fetch('https://api.ejemplo.com/tareas');\npromesa.then((r) => r.json()).then((datos) => console.log(datos));\n```\n\n## async / await\n\nHace el código asíncrono parecer síncrono y mucho más legible:\n\n```js\nasync function cargarTareas() {\n  const respuesta = await fetch('https://api.ejemplo.com/tareas');\n  const datos = await respuesta.json();\n  return datos;\n}\n```\n\n- `async` convierte la función en una promesa.\n- `await` espera el resultado sin bloquear el hilo.\n\n## Manejo de errores con try/catch\n\n```js\nasync function cargar() {\n  try {\n    const r = await fetch(url);\n    if (!r.ok) throw new Error(`Error ${r.status}`);\n    return await r.json();\n  } catch (err) {\n    console.error('Fallo la carga:', err.message);\n    throw err;   // o devolver un valor por defecto\n  }\n}\n```\n\n## Operaciones en paralelo\n\nNo esperes una por una si son independientes:\n\n```js\nconst [tareas, usuarios] = await Promise.all([\n  fetch('/api/tareas').then((r) => r.json()),\n  fetch('/api/usuarios').then((r) => r.json()),\n]);\n```\n\n`Promise.all` falla si una falla. `Promise.allSettled` espera todas, sin importar el resultado.\n\n## Errores comunes\n\n- Olvidar `await`: obtienes una promesa en vez del valor.\n- No validar `r.ok`: `fetch` no rechaza en errores HTTP (404/500).\n- No capturar errores: una promesa rechazada sin catch genera errores silenciosos.\n\n## Buenas prácticas\n\n- Usa `async/await` para flujos con varios pasos.\n- Siempre maneja errores con `try/catch`.\n- Paraleliza con `Promise.all` lo que no dependa entre sí.\n- Evita mezclar `.then()` y `await` en la misma función.\n\n> Regla: nunca ignores el resultado de una promesa. Toda promesa necesita un `await` o un `.catch()`.\n\n## Resumen y práctica\n\nAprendiste promesas, async/await, manejo de errores y paralelismo. Practica una función async que consuma una API.",
          exercises: [
            {
              title: "Carga datos con fetch",
              description: "Consume una API y maneja errores.",
              instructions:
                "Escribe una función async que haga fetch a una URL, valide que la respuesta es ok, devuelva los datos parseados y lance una excepción clara si la respuesta falla. Incluye try/catch y demuestra el uso de Promise.all cargando dos recursos en paralelo.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 3,
              requirements: [
                "Usas async/await.",
                "Validás r.ok antes de devolver.",
                "Incluís manejo de errores con try/catch.",
                "Usás Promise.all para cargar en paralelo.",
              ],
              tests: ["Verificar async/await", "Verificar validación de respuesta", "Verificar manejo de errores"],
            },
          ],
        },
        {
          slug: "dom-y-eventos",
          title: "DOM y eventos",
          order: 5,
          durationMinutes: 50,
          markdown:
            "# DOM y eventos\n\nEl **DOM** (Document Object Model) es la representación en JavaScript del HTML de la página. Con él puedes leer y modificar la interfaz en respuesta a lo que hace el usuario.\n\n## Seleccionar elementos\n\n```js\nconst titulo = document.querySelector('h1');\nconst botones = document.querySelectorAll('.btn');\nconst porId = document.getElementById('app');\n```\n\n`querySelector` devuelve el primer elemento; `querySelectorAll` devuelve una lista.\n\n## Leer y modificar\n\n```js\ntitulo.textContent = 'Nuevo título';\nbotones[0].classList.add('activo');\nbotones[0].classList.toggle('activo');\ncaja.style.display = 'none';\ncaja.setAttribute('aria-hidden', 'true');\n```\n\nPrefiere `textContent` (seguro) sobre `innerHTML` (riesgo de inyección si el contenido viene del usuario).\n\n## Crear y agregar elementos\n\n```js\nconst li = document.createElement('li');\nli.textContent = 'Nueva tarea';\nlista.appendChild(li);\n```\n\n## Escuchar eventos\n\n```js\nconst boton = document.querySelector('#enviar');\nboton.addEventListener('click', (evento) => {\n  evento.preventDefault();\n  console.log('Se hizo clic');\n});\n\nformulario.addEventListener('submit', (e) => {\n  e.preventDefault();   // evita recargar la página\n  const datos = new FormData(e.target);\n  console.log(Object.fromEntries(datos));\n});\n```\n\nEventos comunes: `click`, `submit`, `input`, `change`, `keydown`, `load`.\n\n## Delegación de eventos\n\nEn vez de un listener por elemento, escucha en el contenedor y usa el evento para saber quién se disparó. Es más eficiente en listas grandes:\n\n```js\nlista.addEventListener('click', (e) => {\n  if (e.target.matches('li')) e.target.classList.toggle('hecho');\n});\n```\n\n## Accesibilidad del DOM\n\n- Mantén el foco visible y navegable con teclado.\n- Usa `<button>` para acciones.\n- Anuncia cambios importantes con `aria-live`.\n\n## Buenas prácticas\n\n- Selecciona por clase o id, no por estructura frágil.\n- Usa delegación para listas.\n- Separa la lógica del DOM en funciones.\n- Muestra estados: cargando, vacío, error.\n\n> Error común: no usar `preventDefault()` en el submit y perder el estado por la recarga de la página.\n\n## Resumen y práctica\n\nAprendiste a seleccionar, modificar y escuchar eventos del DOM. Practica una lista de tareas interactiva.",
          exercises: [
            {
              title: "Lista de tareas interactiva",
              description: "Manipula el DOM y maneja eventos.",
              instructions:
                "Crea una página con un formulario para agregar tareas y una lista. Al enviar el formulario, agrega la tarea al DOM (sin recargar la página, usando preventDefault). Permite marcar tareas como hechas con un clic usando delegación de eventos, y eliminar una tarea.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 3,
              requirements: [
                "Usás addEventListener para submit y click.",
                "Usás preventDefault para evitar la recarga.",
                "Creás elementos con createElement o similar.",
                "Implementás delegación de eventos para marcar/eliminar.",
              ],
              tests: ["Verificar evento submit", "Verificar creación de elementos", "Verificar delegación de eventos"],
            },
          ],
        },
        {
          slug: "modulos-y-npm",
          title: "Módulos, npm y herramientas",
          order: 6,
          durationMinutes: 45,
          markdown:
            "# Módulos, npm y herramientas\n\nA medida que un proyecto crece, el código se divide en **módulos**. Node y el navegador moderno usan módulos ES, y **npm** administra las dependencias.\n\n## Módulos ES\n\nExporta e importa entre archivos con `export` e `import`:\n\n```js\n// math.js\nexport const sumar = (a, b) => a + b;\nexport default function multiplicar(a, b) { return a * b; }\n\n// app.js\nimport multiplicar, { sumar } from './math.js';\nconsole.log(sumar(2, 3));\n```\n\n- **Named exports**: varios por archivo, se importan con llaves.\n- **Default export**: uno por archivo, sin llaves.\n\n## npm: el gestor de paquetes\n\n```bash\nnpm init -y                    # crea package.json\nnpm install lodash             # dependencia de producción\nnpm install -D vitest          # dependencia de desarrollo\nnpm install                    # instala todo lo del package.json\nnpm ci                         # instalación limpia y reproducible (CI)\n```\n\n## package.json\n\n```json\n{\n  'name': 'mi-app',\n  'scripts': {\n    'dev': 'node src/index.js',\n    'test': 'vitest run',\n    'lint': 'eslint .'\n  },\n  'dependencies': {},\n  'devDependencies': {}\n}\n```\n\nLos **scripts** se ejecutan con `npm run nombre`. Son el punto de entrada estándar de cualquier proyecto.\n\n## Dependencias de producción vs desarrollo\n\n- `dependencies`: se necesitan para ejecutar la app.\n- `devDependencies`: solo para desarrollar (linters, testing, bundlers).\n\n## node_modules y lockfile\n\n- `node_modules/`: las dependencias instaladas. **Nunca** se versiona.\n- `package-lock.json`: fija versiones exactas para instalaciones reproducibles. **Sí** se versiona.\n\n## Versiones semánticas\n\n`^1.2.3` acepta actualizaciones compatibles; `~1.2.3` solo parches; `1.2.3` es exacta. Entender esto evita sorpresas al actualizar.\n\n## Buenas prácticas\n\n- Un módulo, una responsabilidad.\n- Versiona `package-lock.json`, ignora `node_modules/`.\n- Define scripts claros (`dev`, `build`, `test`, `lint`).\n- Revisa las dependencias antes de agregarlas: cada una es código de terceros en tu app.\n\n> Error común: subir `node_modules/` a Git. Es enorme, innecesario y se regenera con `npm ci`.\n\n## Resumen y práctica\n\nAprendiste módulos, npm y package.json. Practica separando tu código en módulos y definiendo scripts.",
          exercises: [
            {
              title: "Organiza el proyecto en módulos",
              description: "Divide el código y configura npm.",
              instructions:
                "Crea un package.json con scripts dev y test. Separa tu lógica en al menos dos módulos (por ejemplo utils.js y app.js) usando export/import. Verifica que node ejecuta la app con npm run dev y que node_modules/ está en .gitignore.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "Existe package.json con scripts.",
                "Separás el código en módulos con export/import.",
                "Ejecutás la app con npm run dev.",
                "node_modules/ está ignorado.",
              ],
              tests: ["Verificar package.json", "Verificar módulos", "Verificar .gitignore"],
            },
          ],
        },
      ],
    },
    {
      slug: "fundamentos-git",
      title: "Git y GitHub",
      description: "Control de versiones aplicado: commits, ramas, merge y pull requests.",
      order: 3,
      estimatedHours: 6,
      lessons: [
        {
          slug: "commit-branch-merge",
          title: "Branches y merge",
          order: 1,
          durationMinutes: 55,
          markdown:
            "# Branches y merge\n\nTrabajar con ramas permite avanzar sin romper `main`. Cada rama es un puntero a un commit que puedes fusionar cuando el trabajo está listo.\n\n## El ciclo con ramas\n\n```bash\ngit switch -c feature/login\ngit add .\ngit commit -m 'agrega formulario de login'\ngit switch main\ngit merge feature/login\ngit branch -d feature/login\n```\n\n## Qué pasa en el merge\n\n- Si `main` no cambió: **fast-forward**, Git solo mueve el puntero.\n- Si ambas ramas avanzaron: se crea un **commit de merge** que une las historias.\n\n## Conflictos\n\nCuando dos ramas tocan la misma línea, Git marca el archivo:\n\n```\n<<<<<<< HEAD\ntu versión\n=======\nversión de la rama\n>>>>>>> feature/login\n```\n\nResolución: lee ambas, deja la versión final, borra las marcas, `git add` y `git commit`. Para cancelar: `git merge --abort`.\n\n## Ver el historial de ramas\n\n```bash\ngit log --oneline --graph --all --decorate\n```\n\nEste comando dibuja las ramas y fusiones en la terminal: muy útil para entender qué pasó.\n\n## Buenas prácticas\n\n- Ramas cortas por tarea y merged frecuentes.\n- Mantén `main` desplegable siempre.\n- Sincroniza tu rama con `main` seguido para evitar conflictos grandes.\n- Borra ramas ya fusionadas.\n\n> Un flujo de ramas cortas y pruebas en cada PR reduce drásticamente los conflictos.\n\n## Resumen y práctica\n\nAprendiste el ciclo completo con ramas y cómo resolver conflictos. Practica creando, cambiando y fusionando una rama.",
          exercises: [
            {
              title: "Ciclo completo con rama",
              description: "Crea, modifica y fusiona una rama.",
              instructions:
                "Inicializa un repo con un commit en main. Crea una rama feature, haz al menos un commit en ella, vuelve a main y fusiónala con git merge. Muestra el historial con git log --oneline --graph y borra la rama fusionada.",
              difficulty: "BEGINNER",
              maxAttempts: 2,
              requirements: [
                "Creas una rama feature.",
                "Realizas al menos un commit en la rama.",
                "Fusionas la rama a main con merge.",
                "Borras la rama fusionada.",
              ],
              tests: ["Verificar rama feature", "Verificar commit", "Verificar merge"],
            },
          ],
        },
        {
          slug: "push-y-pr",
          title: "Push, pull y pull requests",
          order: 2,
          durationMinutes: 45,
          markdown:
            "# Push, pull y pull requests\n\nUn proyecto profesional vive en GitHub y el código avanza con pull requests revisadas.\n\n## Publicar y sincronizar\n\n```bash\ngit remote add origin https://github.com/usuario/repo.git\ngit push -u origin main\ngit push -u origin feature/login\ngit pull\n```\n\n- `git remote add origin <url>` conecta tu repo local con GitHub.\n- `git push -u origin <rama>` publica la rama y la asocia (upstream).\n- `git pull` trae y fusiona los cambios del remoto.\n\n## Pull requests\n\nUna **pull request (PR)** propone integrar tu rama en `main`. El equipo la revisa, comenta y, al aprobarla, se fusiona.\n\nUn buen flujo de PR:\n\n1. Actualiza `main` y crea tu rama.\n2. Commitea cambios pequeños y claros.\n3. Sube la rama con push.\n4. Abre la PR con una descripción útil.\n5. Atiende los comentarios con nuevos commits.\n6. Fusiona (merge o squash) y borra la rama.\n\n## Descripción de una PR\n\n- Qué cambia y por qué.\n- Cómo probarlo.\n- Issue relacionado (`Closes #12`).\n\n## Buenas prácticas\n\n- Nunca hagas push directo a `main` en equipo: usa ramas y PRs.\n- Actualiza tu rama con `main` antes de pedir revisión.\n- Un commit, un cambio lógico; una PR, una funcionalidad.\n- Deja el README claro: es la carta de presentación de tu proyecto.\n\n> Subir tu proyecto a GitHub con un README bien escrito es la primera pieza de tu portfolio.\n\n## Resumen y práctica\n\nAprendiste push, pull y pull requests. Practica publicando tu proyecto y abriendo una PR.",
          exercises: [
            {
              title: "Publica tu proyecto y abre una PR",
              description: "Conecta, sube y abre una pull request.",
              instructions:
                "Crea un repositorio en GitHub, conecta el remote origin, sube la rama main con push -u y abre una pull request desde una rama de cambio. La PR debe explicar qué cambia, por qué y cómo probarlo, e incluir un README en el proyecto.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "Conectás el remote origin.",
                "Subís la rama con push.",
                "Abrís una pull request con descripción.",
                "El proyecto incluye un README.",
              ],
              tests: ["Verificar remote", "Verificar push", "Verificar PR", "Verificar README"],
            },
          ],
        },
      ],
    },
  ],
};
