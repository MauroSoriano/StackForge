"use strict";
// Contenido del track: Frontend con React.

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
  slug: "frontend-react",
  title: "Frontend con React",
  description:
    "Interfaces modernas con React y Next.js: componentes y props, estado, efectos, hooks personalizados, consumo de APIs, manejo de errores, contexto global, rutas y despliegue.",
  type: "MID",
  order: 3,
  modules: [
    {
      slug: "react-componentes",
      title: "Componentes y props",
      description: "Componentes, composición, listas y keys, y estilos.",
      order: 1,
      estimatedHours: 7,
      lessons: [
        {
          slug: "componentes-props",
          title: "Componentes y props",
          order: 1,
          durationMinutes: 40,
          markdown:
            "# Componentes y props\n\nEn React la interfaz se construye con **componentes**: funciones que reciben datos y devuelven JSX. Los datos entran por **props** y fluyen siempre de arriba hacia abajo.\n\n## Tu primer componente\n\n```jsx\nfunction Tarjeta({ titulo, descripcion }) {\n  return (\n    <article className='tarjeta'>\n      <h3>{titulo}</h3>\n      <p>{descripcion}</p>\n    </article>\n  );\n}\n\nexport default function App() {\n  return <Tarjeta titulo='React' descripcion='Componentes reutilizables' />;\n}\n```\n\n## Reglas de los componentes\n\n- El nombre empieza con **mayúscula** (`Tarjeta`, no `tarjeta`).\n- Devuelven JSX (o `null`).\n- Las props son de **solo lectura**: el hijo nunca las modifica.\n- Un componente debe ser predecible: mismas props, mismo resultado.\n\n## Expresiones en JSX\n\n```jsx\nconst nombre = 'Ana';\nconst elemento = <p>Hola, {nombre}. Tenés {2 + 3} mensajes.</p>;\n```\n\nLas llaves `{}` interpolan expresiones JavaScript. Para atributos, se usan llaves en vez de comillas cuando el valor no es un string literal:\n\n```jsx\n<img src={foto} alt={texto} />\n<button disabled={estaCargando}>Enviar</button>\n```\n\n## Props por defecto y children\n\n```jsx\nfunction Boton({ texto = 'Enviar', variante = 'primario', children }) {\n  return <button className={variante}>{children ?? texto}</button>;\n}\n```\n\n`children` es el contenido que se pasa entre las etiquetas de apertura y cierre.\n\n## Composición sobre props infinitas\n\nSi un componente acumula decenas de props, probablemente conviene componerlo con `children` o dividirlo en componentes más pequeños.\n\n## Buenas prácticas\n\n- Componentes pequeños y con una sola responsabilidad.\n- Nombres descriptivos.\n- Nunca mutes props: si necesitas cambiarlas, es señal de que hace falta estado o un callback.\n- Valida props con TypeScript para evitar errores.\n\n> Error común: olvidar la mayúscula en el nombre y que React lo trate como una etiqueta HTML desconocida.\n\n## Resumen y práctica\n\nAprendiste a crear componentes y a pasarles datos. Practica una tarjeta reutilizable renderizada con datos distintos.",
          exercises: [
            {
              title: "Tarjeta reutilizable",
              description: "Renderiza datos con props.",
              instructions:
                "Crea un componente Tarjeta que reciba titulo, descripcion y etiqueta, y renderizá una lista de al menos 3 tarjetas con datos distintos. Usá una prop con valor por defecto y renderizá children en al menos un caso. Verificá que cambiar las props cambia el render.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "El componente recibe props.",
                "Se reutiliza al menos 2 veces con datos distintos.",
                "Usás un valor por defecto en una prop.",
                "El nombre del componente empieza con mayúscula.",
              ],
              tests: ["Props fluyen al componente", "Componente reutilizado", "Valor por defecto"],
            },
          ],
        },
        {
          slug: "composicion-children",
          title: "Composición y children",
          order: 2,
          durationMinutes: 40,
          markdown:
            "# Composición y children\n\nEn lugar de pasar muchos props, se **compone**: un componente contenedor envuelve contenido y lo recibe como `children`.\n\n## El patrón contenedor\n\n```jsx\nfunction Modal({ abierto, titulo, children }) {\n  if (!abierto) return null;\n  return (\n    <div className='modal'>\n      <h2>{titulo}</h2>\n      <div className='modal-body'>{children}</div>\n    </div>\n  );\n}\n\n<Modal abierto={vista} titulo='Nueva tarea'>\n  <form>...</form>\n</Modal>\n```\n\nEl Modal no sabe qué contiene: solo estructura. Puede envolver un formulario, texto o cualquier otra cosa.\n\n## Por qué componer\n\n- Separa estructura de contenido.\n- Reutiliza contenedores (modal, tarjeta, layout) para cualquier contenido.\n- Evita props booleanas que multiplican variantes.\n\n## Props como \"slots\"\n\nPuedes pasar varios fragmentos:\n\n```jsx\nfunction Layout({ header, children, footer }) {\n  return (\n    <div className='layout'>\n      <header>{header}</header>\n      <main>{children}</main>\n      <footer>{footer}</footer>\n    </div>\n  );\n}\n\n<Layout header={<Nav />} footer={<Pie />}>\n  <Contenido />\n</Layout>\n```\n\n## El problema de las props booleanas\n\n```jsx\n// Difícil de mantener\n<Card conBorde conSombra conAccion accionTexto='Editar' ... />\n\n// Mejor: composición\n<Card>\n  <CardHeader>...</CardHeader>\n  <CardBody>...</CardBody>\n</Card>\n```\n\nLas variantes por props booleanas crecen sin control; la composición escala mejor.\n\n## Buenas prácticas\n\n- Un contenedor no debería conocer el contenido que envuelve.\n- Usa `children` para contenido principal y props para \"slots\" con nombre.\n- Divide componentes grandes en partes componibles.\n- Mantén cada componente con una única razón para cambiar.\n\n> La composición es la alternativa idiomática a la herencia en React. Piensa en \"envolver\", no en \"extender\".\n\n## Resumen y práctica\n\nAprendiste a componer con children y slots. Practica un Modal reutilizable con un formulario adentro.",
          exercises: [
            {
              title: "Modal con children",
              description: "Construye un layout reutilizable.",
              instructions:
                "Crea un componente Modal que muestre children cuando esté abierto y no renderice nada cuando esté cerrado. Pasale un formulario como children y un titulo como prop. Usá el mismo Modal para mostrar dos contenidos distintos y demuestra la reutilización.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "Usás children en el componente.",
                "No muestra nada cuando está cerrado.",
                "El Modal se reutiliza con contenidos distintos.",
                "Separa estructura (Modal) de contenido (children).",
              ],
              tests: ["Verificar children", "Verificar condición de cerrado", "Verificar reutilización"],
            },
          ],
        },
        {
          slug: "listas-y-keys",
          title: "Listas y keys",
          order: 3,
          durationMinutes: 35,
          markdown:
            "# Listas y keys\n\nPara renderizar listas usas `map`. Cada elemento necesita una **key** estable y única para que React lo identifique entre renders.\n\n## Renderizar una lista\n\n```jsx\nconst tareas = [\n  { id: 1, titulo: 'Estudiar' },\n  { id: 2, titulo: 'Practicar' },\n];\n\n<ul>\n  {tareas.map((t) => (\n    <li key={t.id}>{t.titulo}</li>\n  ))}\n</ul>\n```\n\n## ¿Por qué importan las keys?\n\nReact usa la key para saber qué elementos son los mismos entre renders. Sin keys estables, puede reusar el DOM de forma incorrecta y perder el estado (por ejemplo, el texto escrito en un input).\n\n## El error de usar el índice\n\n```jsx\n// Frágil: si la lista se reordena, las keys cambian de dueño\n{tareas.map((t, i) => <li key={i}>{t.titulo}</li>)}\n```\n\nUsar el índice como key funciona hasta que la lista se reordena, se filtra o se insertan elementos: ahí aparecen bugs sutiles. Usa siempre un id único del dato.\n\n## Filtrar antes de renderizar\n\n```jsx\n{tareas\n  .filter((t) => !t.hecha)\n  .map((t) => <li key={t.id}>{t.titulo}</li>)}\n```\n\n## Renderizado condicional en listas\n\n```jsx\n{tareas.length === 0 ? (\n  <p>No hay tareas todavía.</p>\n) : (\n  <ul>{tareas.map((t) => <li key={t.id}>{t.titulo}</li>)}</ul>\n)}\n```\n\nSiempre maneja el estado vacío: es una de las experiencias que más se olvida.\n\n## Buenas prácticas\n\n- Siempre una key estable y única.\n- Nunca uses el índice salvo listas estáticas que nunca cambian.\n- Maneja el estado vacío de la lista.\n- Extrae el elemento de la lista a su propio componente cuando crece.\n\n> Error común: faltar la key y ver la advertencia en consola. No la ignores: suele anticipar bugs de estado.\n\n## Resumen y práctica\n\nAprendiste a renderizar listas con map y keys correctas. Practica una lista de tareas con estado vacío.",
          exercises: [
            {
              title: "Lista con key correcta",
              description: "Renderiza un array con map y key.",
              instructions:
                "Recibí un array de tareas con id y titulo y renderizá cada una en un li con key igual al id. Agregá un estado vacío (mensaje cuando no hay tareas) y un filtro que muestre solo las tareas no completadas. Verificá que no aparece la advertencia de key en la consola.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "Usás .map() para renderizar.",
                "Cada item tiene key igual a un id único.",
                "Manejás el estado vacío.",
                "No hay warnings de key en consola.",
              ],
              tests: ["Usa .map()", "Cada item tiene key", "Estado vacío"],
            },
          ],
        },
        {
          slug: "estilos-y-clases",
          title: "Estilos, clases y className",
          order: 4,
          durationMinutes: 40,
          markdown:
            "# Estilos y clases en React\n\nReact no cambia cómo funciona CSS, pero cambia cómo se aplica: `class` pasa a llamarse `className` y los estilos dinámicos requieren atención.\n\n## Aplicar clases\n\n```jsx\n<button className='btn primario'>Enviar</button>\n```\n\n## Clases condicionales\n\n```jsx\nconst cls = ['btn', activo && 'activo', deshabilitado && 'disabled']\n  .filter(Boolean)\n  .join(' ');\n\n<button className={cls}>Enviar</button>\n```\n\nCon template literals:\n\n```jsx\n<div className={`tarjeta ${seleccionada ? 'seleccionada' : ''}`}>\n```\n\n## Estilos inline\n\n```jsx\n<div style={{ color: 'red', fontSize: 14 }}>\n```\n\nLas claves van en camelCase y los valores son strings o números (los números se interpretan en `px`). Úsalos solo para valores dinámicos; para lo demás, CSS.\n\n## Variables CSS dinámicas\n\n```jsx\n<div style={{ '--progreso': `${porcentaje}%` }}>\n```\n\nPermiten inyectar valores en CSS con `var(--progreso)`.\n\n## CSS Modules\n\nEn Next.js puedes usar módulos CSS que evitan colisiones de nombres:\n\n```jsx\nimport styles from './Tarjeta.module.css';\n<div className={styles.tarjeta}>...</div>\n```\n\n## Organización del CSS\n\n- Una hoja global para variables y estilos base.\n- Estilos por componente (módulos o utilidades).\n- Nombres con un patrón consistente (por ejemplo BEM).\n- Tokens de diseño: colores y tamaños en variables CSS.\n\n## Buenas prácticas\n\n- `className`, nunca `class`.\n- Evita estilos inline para todo: dificultan media queries y reuso.\n- Usa variables CSS para el tema (claro/oscuro).\n- Mantén el CSS junto al componente que lo usa.\n\n> Error común: escribir `class` en JSX (se ignora silenciosamente) y ver el componente sin estilos.\n\n## Resumen y práctica\n\nAprendiste className, clases condicionales y estilos. Practica un componente con estado visual activo.",
          exercises: [
            {
              title: "Componente con estilos dinámicos",
              description: "Aplica clases según el estado.",
              instructions:
                "Crea un componente con un botón que se resalte cuando está activo. Usá className condicional (con template literal o filtrando un array) para alternar las clases. Agregá un ejemplo de estilo inline con una variable CSS dinámica (por ejemplo un ancho de progreso). Documentá las clases en un CSS.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "Usás className (no class).",
                "Aplicás clases condicionales según el estado.",
                "Usás al menos una variable CSS dinámica o estilo inline justificado.",
                "El estilo cambia visualmente con el estado.",
              ],
              tests: ["Verificar className", "Verificar clase condicional"],
            },
          ],
        },
      ],
    },
    {
      slug: "react-estado",
      title: "Estado y efectos",
      description: "useState, formularios, useEffect, estado compartido y hooks personalizados.",
      order: 2,
      estimatedHours: 7,
      lessons: [
        {
          slug: "use-state-forms",
          title: "useState y formularios",
          order: 1,
          durationMinutes: 45,
          markdown:
            "# useState y formularios\n\n`useState` guarda **estado local**: datos que cambian con el tiempo y provocan re-render.\n\n## Estado básico\n\n```jsx\nimport { useState } from 'react';\n\nfunction Contador() {\n  const [cuenta, setCuenta] = useState(0);\n  return <button onClick={() => setCuenta(cuenta + 1)}>{cuenta}</button>;\n}\n```\n\n- El primer valor del array es el estado actual.\n- El segundo es la función para actualizarlo (dispara re-render).\n\n## Formularios controlados\n\nUn input controlado fija su valor con el estado:\n\n```jsx\nconst [email, setEmail] = useState('');\n\n<input value={email} onChange={(e) => setEmail(e.target.value)} />\n```\n\nAsí la UI siempre refleja el estado y puedes validar en vivo.\n\n## Varios campos\n\n```jsx\nconst [form, setForm] = useState({ email: '', password: '' });\n\nconst cambiar = (e) =>\n  setForm({ ...form, [e.target.name]: e.target.value });\n\n<input name='email' value={form.email} onChange={cambiar} />\n<input name='password' type='password' value={form.password} onChange={cambiar} />\n```\n\n## Envío del formulario\n\n```jsx\nfunction onSubmit(e) {\n  e.preventDefault();          // evita recargar la página\n  console.log(form);\n}\n<form onSubmit={onSubmit}>...</form>\n```\n\n## Actualizaciones inmutables\n\nNunca mutes el estado. Crea un valor nuevo:\n\n```jsx\nsetLista([...lista, item]);            // agregar\nsetLista(lista.filter((t) => t.id !== id)); // quitar\nsetObjeto({ ...objeto, activo: true });       // cambiar un campo\n```\n\n## El estado es asíncrono\n\n```jsx\nsetCuenta(cuenta + 1);\nconsole.log(cuenta);   // todavía el valor viejo\n\n// Para calcular sobre el valor más reciente, usa la función:\nsetCuenta((c) => c + 1);\n```\n\n## Buenas prácticas\n\n- Estado mínimo: solo lo que cambia y afecta la UI.\n- No derives estado de props si puedes calcularlo.\n- Actualizá siempre de forma inmutable.\n- Deshabilita el botón mientras se envía.\n\n> Error común: mutar el array (`lista.push(...)`) y no ver cambios. React necesita una referencia nueva para detectar el cambio.\n\n## Resumen y práctica\n\nAprendiste estado y formularios controlados. Practica un formulario que valide en vivo.",
          exercises: [
            {
              title: "Formulario controlado",
              description: "Captura y valida datos con estado.",
              instructions:
                "Crea un formulario con inputs controlados por useState para email y contraseña. Muestra en vivo lo que se escribe y deshabilita el botón de envío si algún campo está vacío o el email no tiene formato válido. En onSubmit, previene la recarga y muestra los datos por consola. Actualiza el estado de forma inmutable.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "Inputs controlados con useState.",
                "Botón disabled si algún campo es inválido.",
                "Usás preventDefault en el submit.",
                "Actualizás el estado de forma inmutable.",
              ],
              tests: ["Inputs controlados", "Botón se habilita al completar", "Validación en vivo"],
            },
          ],
        },
        {
          slug: "use-effect-datos",
          title: "useEffect y datos remotos",
          order: 2,
          durationMinutes: 50,
          markdown:
            "# useEffect y datos remotos\n\n`useEffect` sincroniza tu componente con algo **externo**: un fetch, una suscripción, un temporizador, el DOM. Es el lugar correcto para los efectos secundarios.\n\n## Cargar datos al montar\n\n```jsx\nimport { useEffect, useState } from 'react';\n\nfunction Lista() {\n  const [tareas, setTareas] = useState([]);\n  const [cargando, setCargando] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    let activo = true;\n    fetch('/api/tareas')\n      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Error de red'))))\n      .then((datos) => { if (activo) setTareas(datos); })\n      .catch((e) => { if (activo) setError(e.message); })\n      .finally(() => { if (activo) setCargando(false); });\n    return () => { activo = false; };   // cleanup: evita setState tras desmontar\n  }, []);   // [] = solo al montar\n\n  if (cargando) return <p>Cargando…</p>;\n  if (error) return <p>Error: {error}</p>;\n  return <ul>{tareas.map((t) => <li key={t.id}>{t.titulo}</li>)}</ul>;\n}\n```\n\n## El array de dependencias\n\n- `[]`: se ejecuta una vez, al montar.\n- `[id]`: se ejecuta al montar y cada vez que cambia `id`.\n- Sin array: se ejecuta tras **cada** render (rara vez lo quieres).\n\n```jsx\nuseEffect(() => {\n  fetch(`/api/tareas/${id}`).then((r) => r.json()).then(setTarea);\n}, [id]);\n```\n\n## Tres estados de la UI\n\nToda carga remota debería manejar: **cargando**, **error** y **datos**. Mostrar \"Cargando…\" y luego el contenido (o un error claro) es la experiencia esperada.\n\n## Cleanup\n\nLa función que devuelve el effect se ejecuta al desmontar o antes de la próxima ejecución. Úsala para cancelar timers, suscripciones o para marcar que el componente se desmontó (como arriba).\n\n## Buenas prácticas\n\n- Un effect, una responsabilidad.\n- Declara todas las dependencias que usás.\n- Cancela o ignora respuestas cuando el componente puede desmontarse.\n- No uses effects para calcular valores derivados: eso se hace en el render.\n\n> Error común: hacer fetch en el cuerpo del componente (se dispara en cada render). Los efectos secundarios van en `useEffect`.\n\n## Resumen y práctica\n\nAprendiste useEffect, dependencias y limpieza. Practica cargando una lista con estados de carga y error.",
          exercises: [
            {
              title: "Carga datos con efecto",
              description: "Fetch y estados de UI con useEffect.",
              instructions:
                "Cargá una lista desde /api/tareas con useEffect y mostrá un mensaje mientras carga, la lista cuando llega y un mensaje de error si falla. Agregá un detalle: cuando el usuario selecciona una tarea, cargá su detalle en otro effect que dependa del id seleccionado. Incluí cleanup para evitar setState tras desmontar.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 3,
              requirements: [
                "Usás useEffect para el fetch.",
                "Hay un estado de carga visible.",
                "Hay un estado de error.",
                "Declarás dependencias correctas y cleanup.",
              ],
              tests: ["Verificar useEffect", "Verificar estado de carga", "Verificar dependencias"],
            },
          ],
        },
        {
          slug: "estado-compartido",
          title: "Estado compartido: lifting y refs",
          order: 3,
          durationMinutes: 45,
          markdown:
            "# Compartir estado entre componentes\n\nCuando dos componentes necesitan el mismo dato, el patrón es **levantar el estado** (*lifting state up*) al ancestro común y pasarlo hacia abajo por props, junto con los callbacks para cambiarlo.\n\n## Lifting state up\n\n```jsx\nfunction App() {\n  const [contador, setContador] = useState(0);\n  return (\n    <>\n      <Boton onIncrementar={() => setContador(contador + 1)} />\n      <Resultado valor={contador} />\n    </>\n  );\n}\n```\n\nEl estado vive en el ancestro; los hijos son \"tontos\" y solo reciben datos y callbacks. Esto hace los datos fáciles de rastrear.\n\n## Levantar vs duplicar\n\nSi dos componentes mantienen copias del mismo dato, tarde o temprano se desincronizan. Un único origen de verdad evita ese problema.\n\n## Callbacks como props\n\n```jsx\nfunction Buscador({ onBuscar }) {\n  const [texto, setTexto] = useState('');\n  return (\n    <form onSubmit={(e) => { e.preventDefault(); onBuscar(texto); }}>\n      <input value={texto} onChange={(e) => setTexto(e.target.value)} />\n    </form>\n  );\n}\n```\n\n## useRef: valores sin re-render\n\n`useRef` guarda un valor mutable que **no dispara re-render**. Ideal para referencias al DOM:\n\n```jsx\nconst inputRef = useRef(null);\nuseEffect(() => { inputRef.current?.focus(); }, []);\nreturn <input ref={inputRef} />;\n```\n\nTambién sirve para guardar valores entre renders que no afectan la UI (por ejemplo, el id de un timer).\n\n## Cuándo usar estado y cuándo ref\n\n- ¿El valor afecta lo que se ve? **Estado**.\n- ¿Es un detalle técnico (timer, foco, valor previo) que no debe re-renderizar? **Ref**.\n\n## Buenas prácticas\n\n- Un único origen de verdad por dato.\n- No dupliques estado que puede derivarse.\n- Pasa callbacks en vez de exponer setters crudos.\n- Usa refs solo cuando realmente necesitas evitar re-render o acceder al DOM.\n\n> Error común: guardar en ref algo que la UI debe mostrar. Si cambia la pantalla, debe ser estado.\n\n## Resumen y práctica\n\nAprendiste lifting state up y useRef. Practica compartiendo un contador entre dos componentes hermanos.",
          exercises: [
            {
              title: "Lifting state up y ref",
              description: "Comparte estado entre hermanos y usa un ref.",
              instructions:
                "Crea un botón que incrementa un contador y un componente que muestre el valor, con el estado viviendo en el ancestro común. Además, agregá un input que reciba el foco automáticamente al montar usando useRef. Verificá que el valor mostrado se actualiza al presionar el botón.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "El estado vive en el ancestro común.",
                "El valor se muestra en un hijo distinto.",
                "Usás useRef para enfocar un input.",
                "El contador se actualiza correctamente.",
              ],
              tests: ["Verificar lifting", "El contador se actualiza", "Verificar ref y foco"],
            },
          ],
        },
        {
          slug: "hooks-personalizados",
          title: "Hooks personalizados",
          order: 4,
          durationMinutes: 45,
          markdown:
            "# Hooks personalizados\n\nLos **hooks personalizados** extraen y reutilizan lógica con estado. Son funciones que empiezan con `use` y pueden llamar a otros hooks.\n\n## Extraer lógica de fetch\n\nEn vez de repetir cargando/error/datos en cada componente, se centraliza:\n\n```jsx\nimport { useEffect, useState } from 'react';\n\nfunction useFetch(url) {\n  const [datos, setDatos] = useState(null);\n  const [cargando, setCargando] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    let activo = true;\n    setCargando(true);\n    fetch(url)\n      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Error de red'))))\n      .then((d) => activo && setDatos(d))\n      .catch((e) => activo && setError(e.message))\n      .finally(() => activo && setCargando(false));\n    return () => { activo = false; };\n  }, [url]);\n\n  return { datos, cargando, error };\n}\n```\n\nSe usa igual que un hook nativo:\n\n```jsx\nconst { datos, cargando, error } = useFetch('/api/tareas');\n```\n\n## Otro ejemplo: useForm\n\n```jsx\nfunction useForm(valorInicial) {\n  const [valores, setValores] = useState(valorInicial);\n  const cambiar = (e) => setValores({ ...valores, [e.target.name]: e.target.value });\n  return { valores, cambiar };\n}\n```\n\n## Reglas de los hooks\n\n- Llamalos siempre en el **nivel superior** del componente o de otro hook.\n- Nunca dentro de condicionales, bucles o funciones anidadas.\n- El nombre empieza con `use`.\n\n## Cuándo crear un hook\n\n- Cuando la misma lógica con estado se repite en varios componentes.\n- Cuando un componente se vuelve difícil de leer por demasiada lógica.\n\n## Buenas prácticas\n\n- Un hook, una responsabilidad, y con nombre descriptivo.\n- Devuelve un objeto con nombres claros.\n- Documenta los estados que expone (cargando, error, etc.).\n- Los hooks no son para compartir estado, sino lógica: el estado sigue siendo local a cada llamada.\n\n> Los hooks personalizados no comparten estado entre componentes: cada uso tiene su propio estado. Para estado compartido se usa contexto o un estado levantado.\n\n## Resumen y práctica\n\nAprendiste a extraer y reutilizar lógica con hooks. Practica un hook useFetch que centralice carga y error.",
          exercises: [
            {
              title: "Hook useFetch reutilizable",
              description: "Extrae la lógica de carga a un hook.",
              instructions:
                "Creá un hook useFetch(url) que devuelva datos, cargando y error, maneje la respuesta, use cleanup para evitar setState tras desmontar y vuelva a cargar cuando cambie la url. Usalo en al menos dos componentes distintos para demostrar la reutilización.",
              difficulty: "ADVANCED",
              maxAttempts: 2,
              requirements: [
                "El hook empieza con use y llama a otros hooks en el nivel superior.",
                "Devuelve datos, cargando y error.",
                "Vuelve a cargar cuando cambia la url.",
                "Está reutilizado en al menos dos componentes.",
              ],
              tests: ["Verificar hook", "Verificar reutilización", "Verificar recarga por dependencia"],
            },
          ],
        },
      ],
    },
    {
      slug: "react-datos-routing",
      title: "Datos, rutas y despliegue",
      description: "Consumo de APIs, manejo de errores, contexto global, enrutado y despliegue.",
      order: 3,
      estimatedHours: 7,
      lessons: [
        {
          slug: "fetch-y-errores",
          title: "Manejo de errores en fetch",
          order: 1,
          durationMinutes: 45,
          markdown:
            "# Errores en el frontend\n\nTodo lo que viene de la red puede fallar: el servidor cae, la conexión se corta, la API devuelve un error o cambia su forma. Manejar esos casos es lo que separa una app sólida de una frágil.\n\n## fetch NO rechaza en errores HTTP\n\nEste es el error más común: `fetch` solo rechaza si falla la red. Un 404 o un 500 llegan como respuesta normal.\n\n```jsx\nasync function cargar() {\n  setCargando(true);\n  setError(null);\n  try {\n    const r = await fetch('/api/tareas');\n    if (!r.ok) throw new Error(`Error ${r.status}`);\n    setTareas(await r.json());\n  } catch (e) {\n    setError(e.message);\n  } finally {\n    setCargando(false);\n  }\n}\n```\n\n## Timeout con AbortController\n\nUna petición puede quedar colgada; cortá con un timeout:\n\n```jsx\nasync function cargar() {\n  const controller = new AbortController();\n  const timer = setTimeout(() => controller.abort(), 10000);\n  try {\n    const r = await fetch('/api/tareas', { signal: controller.signal });\n    if (!r.ok) throw new Error('Error de red');\n    setTareas(await r.json());\n  } catch (e) {\n    setError(e.name === 'AbortError' ? 'La petición tardó demasiado' : e.message);\n  } finally {\n    clearTimeout(timer);\n  }\n}\n```\n\n## Mensajes útiles y botón de reintento\n\nA la persona le importa una acción clara, no detalles técnicos:\n\n```jsx\nif (error) {\n  return (\n    <div role='alert'>\n      <p>No se pudieron cargar las tareas. Reintentá.</p>\n      <button onClick={cargar}>Reintentar</button>\n    </div>\n  );\n}\n```\n\n## Errores por componente y error boundaries\n\nUn error de render no debería tumbar toda la app. Los **error boundaries** capturan errores de un subárbol y muestran una alternativa.\n\n## Buenas prácticas\n\n- Manejá SIEMPRE `r.ok`.\n- Estados distintos: cargando, error, vacío, datos.\n- No muestres detalles internos en la UI; registralos en consola.\n- Ofrecé reintentar cuando el fallo es transitorio.\n\n> Un `catch` que se traga el error en silencio es peor que no tenerlo: el usuario se queda esperando y nadie sabe qué pasó.\n\n## Resumen y práctica\n\nAprendiste a detectar, comunicar y recuperarte de errores de red. Practica un fetch con reintento.",
          exercises: [
            {
              title: "Fetch con manejo de errores y reintento",
              description: "Estado de error claro y recuperación.",
              instructions:
                "Cargá datos con fetch manejando r.ok y mostrá un mensaje de error claro cuando falla. Agregá un botón que reintente la carga y un timeout con AbortController. Diferenciá el estado de carga, error y éxito. No muestres detalles técnicos en la UI.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "Manejás r.ok.",
                "Hay un botón de reintentar.",
                "Usás AbortController para timeout.",
                "El error no se traga en silencio.",
              ],
              tests: ["Verificar manejo de error", "Verificar botón de reintento", "Verificar timeout"],
            },
          ],
        },
        {
          slug: "rutas-y-navegacion",
          title: "Enrutado y navegación",
          order: 2,
          durationMinutes: 45,
          markdown:
            "# Enrutado y navegación\n\nUna SPA no recarga la página entre pantallas: el **router** cambia la vista. En Next.js (App Router), cada carpeta dentro de `app/` es una ruta.\n\n## Rutas por carpetas\n\n```\napp/\n  layout.tsx            -> estructura común (nav, footer)\n  page.tsx              -> /\n  tareas/page.tsx       -> /tareas\n  tareas/[id]/page.tsx  -> /tareas/1 (dinámica)\n```\n\n## Navegar con Link\n\n```jsx\nimport Link from 'next/link';\n\n<Link href='/tareas'>Tareas</Link>\n<Link href={`/tareas/${tarea.id}`}>{tarea.titulo}</Link>\n```\n\n`Link` hace navegación del lado del cliente, sin recargar todo. Para navegar por código:\n\n```jsx\nimport { useRouter } from 'next/navigation';\nconst router = useRouter();\nrouter.push('/login');\n```\n\n## Leer parámetros\n\n```jsx\n// En un componente client con params asíncronos (Next 15+)\nexport default function Page({ params }) {\n  // params es una promesa en App Router reciente\n  return <Detalle params={params} />;\n}\n\n// O con useParams en client component\nimport { useParams } from 'next/navigation';\nconst { id } = useParams();\n```\n\n## Server vs Client components\n\n- **Server component** (por defecto): se renderiza en el servidor; ideal para datos y contenido. No puede usar estado ni eventos.\n- **Client component** (`'use client'`): interactivo, con estado y efectos.\n\nRegla práctica: mantén como server lo que puedas y aislá la interactividad en componentes client pequeños.\n\n## Layouts y rutas anidadas\n\nUn `layout.tsx` envuelve todas las rutas de su carpeta y se mantiene entre navegaciones (por ejemplo, el nav no se desmonta).\n\n## Rutas de grupo y anidadas\n\nLos grupos `(auth)` agrupan rutas sin afectar la URL; sirven para compartir un layout. Las rutas anidadas heredan los layouts superiores.\n\n## Buenas prácticas\n\n- Usa `Link` en vez de `<a>` para navegación interna.\n- Organiza por funcionalidad, no por tipo de archivo.\n- Mantén los layouts con lo compartido (nav, footer).\n- Maneja la ruta 404 (`not-found.tsx`).\n\n> Error común: usar `<a href>` para rutas internas y forzar una recarga completa, perdiendo el estado y la velocidad de la SPA.\n\n## Resumen y práctica\n\nAprendiste rutas por carpeta, Link y componentes server/client. Practica una ruta dinámica de detalle.",
          exercises: [
            {
              title: "Página de detalle con ruta dinámica",
              description: "Crea una ruta dinámica y navega con Link.",
              instructions:
                "Creá una ruta dinámica tareas/[id] que lea el id de la URL y muestre el detalle de esa tarea. Desde la lista de tareas, enlazá cada item con Link hacia su detalle. Agregá un layout que envuelva las rutas con un nav común y una página not-found personalizada.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "Existe la ruta dinámica tareas/[id].",
                "Leés el id de la URL.",
                "Usás Link para navegar desde la lista.",
                "Existe un layout común.",
              ],
              tests: ["Verificar ruta dinámica", "Verificar Link", "Verificar layout"],
            },
          ],
        },
        {
          slug: "contexto-global",
          title: "Contexto global y estado de la app",
          order: 3,
          durationMinutes: 45,
          markdown:
            "# Contexto global\n\nPassar props por muchos niveles (\"prop drilling\") se vuelve insostenible. El **Context** permite compartir un valor con todo un subárbol sin pasarlo por cada componente intermedio.\n\n## Crear un contexto\n\n```jsx\nimport { createContext, useContext, useState } from 'react';\n\nconst TemaContext = createContext(null);\n\nexport function TemaProvider({ children }) {\n  const [tema, setTema] = useState('claro');\n  const alternar = () => setTema((t) => (t === 'claro' ? 'oscuro' : 'claro'));\n  return (\n    <TemaContext.Provider value={{ tema, alternar }}>\n      {children}\n    </TemaContext.Provider>\n  );\n}\n\nexport function useTema() {\n  const ctx = useContext(TemaContext);\n  if (!ctx) throw new Error('useTema debe usarse dentro de TemaProvider');\n  return ctx;\n}\n```\n\n## Usar el contexto\n\n```jsx\nfunction ToggleTema() {\n  const { tema, alternar } = useTema();\n  return <button onClick={alternar}>Tema: {tema}</button>;\n}\n```\n\n## Cuándo usar contexto\n\n- Datos realmente globales: usuario autenticado, tema, idioma, carrito.\n- Cuando muchos componentes distantes necesitan el mismo dato.\n\n## Cuándo NO usar contexto\n\n- Para estado que solo comparten dos componentes cercanos: usar props es más simple.\n- Para todo el estado de la app: puede causar re-renders innecesarios.\n\n## Contexto + reducer\n\nPara estados complejos se combina con `useReducer`: el reducer concentra las transiciones y el contexto las reparte.\n\n## Buenas prácticas\n\n- Un contexto por dominio (tema, auth, carrito), no un contexto gigante.\n- Expón un hook (`useTema`) con validación, no el contexto crudo.\n- Envuelve solo el subárbol que lo necesita.\n- Memoiza el valor del provider si es costoso.\n\n> El contexto resuelve el pasamanos de props, no el problema de estado global por sí mismo. Úsalo con criterio.\n\n## Resumen y práctica\n\nAprendiste a crear y consumir contexto. Practica un contexto de tema con alternar claro/oscuro.",
          exercises: [
            {
              title: "Contexto de tema o usuario",
              description: "Comparte un valor global sin prop drilling.",
              instructions:
                "Creá un contexto (por ejemplo, de tema claro/oscuro o del usuario autenticado) con su Provider y un hook useX con validación. Envolvé la app con el Provider y consumí el valor en al menos dos componentes distantes (por ejemplo, el nav y una página) sin pasar props por el medio. Implementá una acción para modificar el valor.",
              difficulty: "ADVANCED",
              maxAttempts: 2,
              requirements: [
                "Creás un contexto con Provider y hook.",
                "El hook valida que se use dentro del Provider.",
                "Consumís el valor en dos componentes distantes sin prop drilling.",
                "Hay una acción que modifica el valor.",
              ],
              tests: ["Verificar contexto", "Verificar hook", "Verificar consumo sin prop drilling"],
            },
          ],
        },
        {
          slug: "entorno-y-despliegue",
          title: "Variables de entorno y despliegue",
          order: 4,
          durationMinutes: 40,
          markdown:
            "# Variables de entorno y despliegue\n\nUna app se ejecuta en distintos entornos: local, staging y producción. Las **variables de entorno** separan la configuración del código.\n\n## Variables en Next.js\n\n```bash\n# .env.local  (nunca se sube a Git)\nNEXT_PUBLIC_API_URL=https://api.tu-proyecto.com\nJWT_SECRET=secreto-solo-servidor\n```\n\n- `NEXT_PUBLIC_*` se expone al navegador. Lo que empieza así es **público**: nunca pongas secretos.\n- Las variables sin ese prefijo solo existen en el servidor.\n\n## Usarlas en el código\n\n```jsx\nconst apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '/api';\n```\n\n## .env.example\n\nVersioná un archivo `.env.example` con las claves necesarias (sin valores reales) para que cualquiera sepa qué configurar. Asegurate de que `.env*` esté en `.gitignore`.\n\n## Antes de desplegar\n\n```bash\nnpm run build     # compila y detecta errores\nnpm run start     # ejecuta la versión de producción\n```\n\nEl build falla si hay errores de tipos, imports rotos o variables mal usadas: por eso se corre en CI.\n\n## Checklist de despliegue\n\n- Variables de entorno configuradas en la plataforma.\n- HTTPS activo.\n- Build de producción sin errores.\n- Logs y monitoreo de errores.\n- Backups de la base de datos.\n- Dominio y DNS apuntando al servicio.\n\n## Plataformas comunes\n\n- **Vercel / Netlify**: ideales para frontend Next.js; deploy por push.\n- **Fly.io / Railway / Render**: para APIs y servicios.\n- **Docker**: empaqueta la app y sus dependencias para correr en cualquier lado.\n\n## Buenas prácticas\n\n- Nunca commitees secretos.\n- Distintas variables por entorno.\n- Valida que las variables existan al arrancar: si falta una crítica, la app no debe arrancar.\n- Rota los secretos si alguna vez se filtraron.\n\n> Error común: prefijar un secreto con NEXT_PUBLIC_ y exponerlo al navegador. Revisa dos veces qué variables son públicas.\n\n## Resumen y práctica\n\nAprendiste variables de entorno, build y checklist de deploy. Practica moviendo la URL de tu API a una variable.",
          exercises: [
            {
              title: "Configura el entorno y prepara el deploy",
              description: "Aísla la configuración y compila para producción.",
              instructions:
                "Movés la URL de tu API a una variable NEXT_PUBLIC_ en un archivo .env.local, creás un .env.example versionado y verificás que .env.local está en .gitignore. Corré npm run build sin errores y documentá en un DEPLOY.md el checklist de despliegue que aplicarías.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "La URL vive en una variable de entorno.",
                "El .env.local está en .gitignore.",
                "Existe un .env.example.",
                "El build de producción pasa sin errores.",
              ],
              tests: ["Verificar variable de entorno", "Verificar .gitignore", "Verificar build de producción"],
            },
          ],
        },
      ],
    },
  ],
};
