"use strict";
// Contenido del track: Backend con Node.

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
  slug: "backend-api-node",
  title: "Backend con Node",
  description:
    "APIs REST profesionales con Node y TypeScript: diseño de endpoints, middlewares, validación, autenticación con JWT, base de datos con PostgreSQL y Prisma, testing y documentación.",
  type: "MID",
  order: 2,
  modules: [
    {
      slug: "apis-rest",
      title: "APIs REST",
      description: "Diseño de endpoints, request/response, middlewares, validación y estructura del proyecto.",
      order: 1,
      estimatedHours: 9,
      lessons: [
        {
          slug: "rutas-y-status",
          title: "Rutas y códigos de estado",
          order: 1,
          durationMinutes: 45,
          markdown:
            "# Rutas y códigos de estado\n\nUna API REST expone **recursos** mediante rutas y verbos HTTP. El código de estado comunica el resultado de cada operación.\n\n## Los verbos HTTP\n\n- `GET`: leer. No modifica nada.\n- `POST`: crear.\n- `PUT`: reemplazar por completo.\n- `PATCH`: actualizar parcialmente.\n- `DELETE`: borrar.\n\n## Códigos de estado clave\n\n- `200 OK`: operación exitosa con contenido.\n- `201 Created`: recurso creado (devuelve la ubicación o los datos).\n- `204 No Content`: éxito sin cuerpo (típico en DELETE).\n- `400 Bad Request`: datos inválidos.\n- `401 Unauthorized`: falta autenticación o es inválida.\n- `403 Forbidden`: autenticado pero sin permisos.\n- `404 Not Found`: el recurso no existe.\n- `409 Conflict`: conflicto (por ejemplo, email ya registrado).\n- `422 Unprocessable Entity`: validación semántica fallida.\n- `500 Internal Server Error`: falla del servidor.\n\n## Diseño de recursos\n\n- Usa sustantivos en plural para colecciones: `/tareas`, `/usuarios`.\n- Identifica un elemento con su id: `/tareas/:id`.\n- Anida subrecursos cuando aporta claridad: `/tareas/:id/comentarios`.\n- Usa query params para filtrar y paginar: `/tareas?estado=pendiente&page=2`.\n\n```\nGET    /api/tareas           -> 200 lista\nPOST   /api/tareas           -> 201 creada\nGET    /api/tareas/12        -> 200 o 404\nPUT    /api/tareas/12        -> 200\nDELETE /api/tareas/12        -> 204\n```\n\n## Contrato consistente\n\nResponde siempre con la misma forma: éxito con los datos; error con un objeto que incluya un mensaje.\n\n```json\n{ \"error\": \"La tarea no existe\" }\n```\n\nUn contrato estable hace que el cliente sea simple y predecible.\n\n## Idempotencia\n\n`GET`, `PUT` y `DELETE` son idempotentes: repetir la misma petición no cambia el resultado más allá de la primera vez. `POST` no lo es (crea un recurso nuevo cada vez). Diseñar pensando en esto evita duplicados.\n\n## Buenas prácticas\n\n- Usa el verbo correcto: no hagas `GET /borrar-tarea`.\n- Devuelve 201 con el recurso creado.\n- Devuelve 404 real, no 200 con un mensaje de error.\n- Versiona tu API si va a cambiar (`/api/v1/...`).\n\n> Error común: responder 200 cuando hubo un error. El cliente no puede distinguir éxito de fallo. Usa siempre el código correcto.\n\n## Resumen y práctica\n\nAprendiste verbos, códigos y diseño de recursos. Practica implementando las 4 operaciones básicas con sus códigos.",
          exercises: [
            {
              title: "CRUD de tareas",
              description: "Implementa las 4 operaciones básicas.",
              instructions:
                "Crea endpoints para listar, crear, actualizar y eliminar tareas en memoria, con los status codes correctos para cada caso: GET 200, POST 201 devolviendo la tarea creada, PUT 200 y DELETE 204. Devuelve 404 cuando el id no existe.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 3,
              requirements: [
                "GET devuelve 200 y la lista.",
                "POST crea y devuelve 201 con la tarea.",
                "PUT actualiza y devuelve 200.",
                "DELETE devuelve 204.",
                "Un id inexistente devuelve 404.",
              ],
              tests: ["GET /tareas -> 200", "POST /tareas -> 201", "DELETE -> 204", "GET inexistente -> 404"],
            },
          ],
        },
        {
          slug: "request-response",
          title: "Request y respuesta HTTP",
          order: 2,
          durationMinutes: 45,
          markdown:
            "# Request y respuesta HTTP\n\nEl servidor lee la petición entrante y construye una respuesta. Conocer las partes de cada una es fundamental.\n\n## Partes de la request\n\n- **Método y URL**: `GET /api/tareas/12?estado=pendiente`.\n- **Headers**: metadatos como `Content-Type`, `Authorization`, `Cookie`.\n- **Body**: datos en JSON para POST/PUT/PATCH.\n- **Params de ruta**: `/tareas/:id` -> `req.params.id`.\n- **Query params**: `?estado=pendiente` -> `req.query.estado`.\n\n## Leer datos en Express\n\n```js\napp.use(express.json());   // habilita parsear JSON del body\n\napp.get('/tareas/:id', (req, res) => {\n  const { id } = req.params;\n  const tarea = buscarPorId(id);\n  if (!tarea) return res.status(404).json({ error: 'No encontrada' });\n  res.json(tarea);\n});\n\napp.post('/tareas', (req, res) => {\n  const { titulo } = req.body;\n  const tarea = crear({ titulo });\n  res.status(201).json(tarea);\n});\n```\n\n## Partes de la respuesta\n\n- **Status code**: el resultado.\n- **Headers**: `Content-Type: application/json`, caché, etc.\n- **Body**: los datos en JSON.\n\n## Query params para filtrar y paginar\n\n```js\napp.get('/tareas', (req, res) => {\n  const { estado, page = 1, limit = 10 } = req.query;\n  const filtros = estado ? { estado } : {};\n  const items = listar(filtros, Number(page), Number(limit));\n  res.json(items);\n});\n```\n\n## Headers importantes\n\n- `Authorization: Bearer <token>`: autenticación.\n- `Content-Type: application/json`: formato del body.\n- `Cookie`: cookies de sesión (httpOnly).\n\n## Buenas prácticas\n\n- Valida y convierte los tipos de `req.query` (llegan como string).\n- No confíes en el body: siempre valida.\n- Responde siempre JSON en una API JSON.\n- Usa headers para metadatos, no metas el status en el body.\n\n> Error común: olvidar `express.json()` y recibir `req.body` vacío en un POST.\n\n## Resumen y práctica\n\nAprendiste a leer params, query y body, y a construir respuestas. Practica un endpoint que sirva un recurso por id.",
          exercises: [
            {
              title: "Endpoint con params y 404",
              description: "Sirve un recurso por id con 404.",
              instructions:
                "Implementa GET /tareas/:id que devuelva la tarea indicada o responda 404 con un JSON de error si no existe. Agrega también soporte para filtrar la lista con un query param estado en GET /tareas.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "Leés el id desde req.params.",
                "Devolvés 404 con JSON de error si no existe.",
                "Soportás un query param para filtrar.",
                "Configurás express.json() para el body.",
              ],
              tests: ["GET con id existente -> 200", "GET con id inexistente -> 404", "Filtro por query"],
            },
          ],
        },
        {
          slug: "middlewares-y-errores",
          title: "Middlewares y manejo de errores",
          order: 3,
          durationMinutes: 50,
          markdown:
            "# Middlewares y manejo de errores\n\nUn **middleware** es una función que se ejecuta antes de llegar a la ruta (o después, si maneja errores). Permite reutilizar lógica transversal: logging, autenticación, CORS, validación, límites de tasa.\n\n## Anatomía de un middleware\n\nUn middleware recibe `(req, res, next)`. Si no llama a `next()`, la petición se corta.\n\n```js\nfunction logger(req, res, next) {\n  console.log(`${req.method} ${req.url}`);\n  next();\n}\napp.use(logger);\n```\n\n## Middleware de autenticación\n\n```js\nfunction requiereAuth(req, res, next) {\n  const token = req.headers.authorization?.replace('Bearer ', '');\n  if (!token) return res.status(401).json({ error: 'Falta token' });\n  try {\n    req.user = verificarToken(token);\n    next();\n  } catch {\n    res.status(401).json({ error: 'Token inválido' });\n  }\n}\n\napp.get('/perfil', requiereAuth, (req, res) => res.json(req.user));\n```\n\n## Middlewares por ruta y globales\n\n- `app.use(fn)`: se aplica a todas las rutas.\n- `app.get('/ruta', fn, handler)`: se aplica solo a esa ruta.\n- Los middlewares se ejecutan en orden de registro.\n\n## Manejo central de errores\n\nExpress reconoce un middleware de error por tener **cuatro** argumentos:\n\n```js\napp.use((err, req, res, next) => {\n  console.error(err);                 // logging del lado del servidor\n  const status = err.status ?? 500;\n  res.status(status).json({ error: err.mensajePublico ?? 'Error interno' });\n});\n```\n\n## Errores operacionales vs de programación\n\n- **Operacionales**: esperados (recurso no encontrado, validación). Se responden con 4xx.\n- **De programación**: bugs (null inesperado). Se registran y responden 500 sin filtrar detalles.\n\nNunca devuelvas el stack trace al cliente: expone rutas y datos internos.\n\n## Lanzar errores en handlers async\n\nLos handlers `async` no llegan solos al error handler en Express 4. Envuelve con un helper o usa `next(err)`:\n\n```js\nconst asyncHandler = (fn) => (req, res, next) =>\n  Promise.resolve(fn(req, res, next)).catch(next);\n```\n\n## Buenas prácticas\n\n- Un middleware, una responsabilidad.\n- Registra el error handler al final, después de todas las rutas.\n- No expongas detalles internos; regístralos en el servidor.\n- Usa códigos correctos: 400 para validación, 401 para auth, 500 para bugs.\n\n> Error común: poner el error handler antes de las rutas y que nunca se ejecute.\n\n## Resumen y práctica\n\nAprendiste middlewares, orden de ejecución y manejo central de errores. Practica agregando logging y un error handler.",
          exercises: [
            {
              title: "Middleware de logging y error handler",
              description: "Registra peticiones y maneja errores.",
              instructions:
                "Agrega un middleware global que imprima método y ruta por cada petición y llame a next(). Agrega un middleware de autenticación que devuelva 401 si falta el header Authorization. Finalmente, agrega un error handler de cuatro argumentos al final que responda 500 en JSON sin filtrar el stack.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "Existe middleware de logging con next().",
                "Existe middleware de auth que responde 401.",
                "El error handler tiene 4 argumentos y responde JSON.",
                "El error handler está registrado al final.",
              ],
              tests: ["Verificar middleware", "Verificar auth 401", "Verificar error handler"],
            },
          ],
        },
        {
          slug: "validacion-entrada",
          title: "Validación de entrada",
          order: 4,
          durationMinutes: 50,
          markdown:
            "# Validación de entrada\n\nValidar es no confiar en el cliente. Un dato mal formado puede romper tu base de datos, generar errores 500 o abrir vulnerabilidades.\n\n## Qué validar\n\n- **Obligatoriedad**: campos requeridos que faltan.\n- **Formato**: email, URL, UUID, fecha.\n- **Longitud**: títulos largos, contraseñas débiles.\n- **Tipo**: número donde se esperaba número.\n- **Rango**: precios positivos, edad válida.\n- **Negocio**: cupones vigentes, stock disponible.\n\n## Validación manual\n\n```js\nfunction validarTarea(datos) {\n  const errores = [];\n  if (!datos.titulo || !datos.titulo.trim()) {\n    errores.push('El título es obligatorio');\n  }\n  if (datos.titulo && datos.titulo.length > 120) {\n    errores.push('El título no puede superar 120 caracteres');\n  }\n  if (datos.prioridad && !['baja', 'media', 'alta'].includes(datos.prioridad)) {\n    errores.push('Prioridad inválida');\n  }\n  return { valido: errores.length === 0, errores };\n}\n```\n\n## Responder 400 con detalle\n\n```js\napp.post('/tareas', (req, res) => {\n  const { valido, errores } = validarTarea(req.body);\n  if (!valido) return res.status(400).json({ error: 'Datos inválidos', errores });\n  res.status(201).json(crear(req.body));\n});\n```\n\n## Librerías: Zod o class-validator\n\nCon esquemas declaras las reglas y el tipado de una vez:\n\n```js\nimport { z } from 'zod';\nconst TareaSchema = z.object({\n  titulo: z.string().min(1).max(120),\n  prioridad: z.enum(['baja', 'media', 'alta']).default('media'),\n});\nconst resultado = TareaSchema.safeParse(req.body);\nif (!resultado.success) return res.status(400).json({ errores: resultado.error.issues });\n```\n\nEn NestJS se usan DTOs con `class-validator` y un `ValidationPipe` global: el framework valida y transforma automáticamente.\n\n## Validación y seguridad\n\n- Valida en el servidor siempre, aunque haya validación del navegador.\n- Escapa o parametriza para evitar inyección (Prisma lo hace por ti).\n- Limita el tamaño del body (`express.json({ limit: '100kb' })`).\n- Normaliza (trim, lowercase de emails) antes de guardar.\n\n## Buenas prácticas\n\n- Devuelve todos los errores juntos, no solo el primero.\n- Mensajes claros y accionables.\n- Valida también los query params y headers.\n- Centraliza los esquemas para reusarlos en tests.\n\n> Error común: validar solo en el frontend. Cualquiera puede llamar a tu API directamente; el servidor es la última línea de defensa.\n\n## Resumen y práctica\n\nAprendiste qué validar y cómo responder 400 con detalle. Practica validando el título de una tarea.",
          exercises: [
            {
              title: "Valida la creación de tareas",
              description: "Rechaza datos inválidos con 400.",
              instructions:
                "En POST /tareas valida que el título es obligatorio y de menos de 120 caracteres, y que la prioridad, si viene, sea baja, media o alta. Responde 400 con el listado de errores si algo falla y 201 si todo está correcto. Normaliza el título con trim antes de guardar.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "Falta título -> 400 con mensaje.",
                "Título mayor a 120 caracteres -> 400.",
                "Prioridad inválida -> 400.",
                "Datos válidos -> 201.",
              ],
              tests: ["POST sin título -> 400", "POST título largo -> 400", "POST válido -> 201"],
            },
          ],
        },
        {
          slug: "estructura-de-proyecto",
          title: "Estructura de un proyecto backend",
          order: 5,
          durationMinutes: 45,
          markdown:
            "# Estructura de un proyecto backend\n\nUn proyecto ordenado se entiende, se prueba y escala mejor. La idea es separar responsabilidades por **capas**.\n\n## Separación en capas\n\n- **Rutas**: definen los endpoints y delegan.\n- **Controladores/handlers**: leen la request, llaman al servicio y devuelven la respuesta.\n- **Servicios**: la lógica de negocio (reglas de la aplicación).\n- **Acceso a datos**: consultas a la base de datos (repositorios con Prisma).\n- **Modelos/esquemas**: tipos y validaciones de datos.\n\n```\nsrc/\n  config/         variables de entorno y configuración\n  modules/\n    tareas/\n      tareas.controller.ts\n      tareas.service.ts\n      tareas.dto.ts\n  middlewares/\n  app.ts\n  server.ts\n```\n\n## Por qué no todo en un archivo\n\n- Testear servicios aislados es fácil; testear rutas mezcladas con SQL es un dolor.\n- Cambiar de base de datos o de framework afecta menos capas.\n- Varias personas pueden trabajar sin chocar en el mismo archivo.\n\n## Variables de entorno\n\nNunca hardcodees configuración. Cárgala del entorno y valídala al arrancar:\n\n```js\nconst config = {\n  port: Number(process.env.PORT ?? 4000),\n  databaseUrl: process.env.DATABASE_URL,\n  jwtSecret: process.env.JWT_SECRET,\n};\nif (!config.databaseUrl || !config.jwtSecret) {\n  throw new Error('Faltan variables de entorno obligatorias');\n}\n```\n\nFalla rápido: si falta configuración, mejor que la app no arranque a que falle en producción.\n\n## Manejo de configuración\n\n- `.env` en local, **fuera** de Git.\n- `.env.example` versionado con las claves necesarias (sin valores reales).\n- Variables distintas por entorno: local, staging, producción.\n\n## Buenas prácticas\n\n- Una responsabilidad por archivo.\n- Los controladores delgados: poca lógica, delegan a servicios.\n- Los servicios no conocen HTTP (no reciben `req`/`res`).\n- Los tipos/DTOs compartidos entre capas.\n- Arranque explícito que valida configuración.\n\n> Una buena estructura hace que encontrar dónde vive cada cosa sea obvio. Si dudas dónde poner algo, probablemente esté en la capa equivocada.\n\n## Resumen y práctica\n\nAprendiste a separar rutas, servicios y acceso a datos. Practica reorganizando tu CRUD en capas.",
          exercises: [
            {
              title: "Separa tu CRUD en capas",
              description: "Organiza el proyecto por responsabilidades.",
              instructions:
                "Reorganiza tu API de tareas en al menos tres capas: archivos de rutas, un servicio con la lógica de negocio y una capa de acceso a datos. Mueve la configuración (puerto, URL de base de datos) a variables de entorno leídas desde config, y crea un .env.example. Verifica que la app arranca y que las rutas siguen funcionando.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "Separas rutas, servicio y acceso a datos.",
                "Usás variables de entorno para la configuración.",
                "Existe un .env.example versionado.",
                "La app arranca y las rutas funcionan.",
              ],
              tests: ["Verificar capas", "Verificar variables de entorno", "Verificar .env.example"],
            },
          ],
        },
      ],
    },
    {
      slug: "autenticacion-jwt",
      title: "Autenticación JWT",
      description: "Contraseñas con hash, access y refresh tokens, autorización por roles y buenas prácticas de seguridad.",
      order: 2,
      estimatedHours: 9,
      lessons: [
        {
          slug: "contrasenas-y-bcrypt",
          title: "Contraseñas con hash",
          order: 1,
          durationMinutes: 45,
          markdown:
            "# Hash de contraseñas\n\nNunca guardes contraseñas en texto plano. Se guardan con **hash + salt**, una transformación irreversible.\n\n## Hash vs cifrado\n\n- **Cifrado**: reversible con una clave; sirve para transmitir, no para guardar contraseñas.\n- **Hash**: de un solo sentido. No se puede volver atrás; solo se compara.\n\n## Salt\n\nEl **salt** es un valor aleatorio único por usuario que se combina con la contraseña antes de hashear. Sin salt, dos usuarios con la misma contraseña tendrían el mismo hash y una tabla precalculada (rainbow table) podría romperlos.\n\n```js\nimport bcrypt from 'bcryptjs';\n\nconst hash = await bcrypt.hash(password, 12);        // al registrar\nconst ok = await bcrypt.compare(password, hash);     // al iniciar sesión\n```\n\n## Rondas de trabajo (cost)\n\nEl número de rondas (10-12) hace el hash lento a propósito. Eso encarece muchísimo el ataque por fuerza bruta. Ajusta el costo para que un login tarde ~100ms en tu hardware.\n\n## Flujo de registro y login\n\n1. Registro: valida datos, hashea la contraseña, guarda el usuario.\n2. Login: busca por email, compara con `bcrypt.compare`, nunca compares strings.\n\n```js\nconst usuario = await prisma.user.findUnique({ where: { email } });\nif (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });\nconst ok = await bcrypt.compare(password, usuario.passwordHash);\nif (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });\n```\n\n## No filtrar el hash\n\nAl devolver el usuario, excluye siempre `passwordHash`:\n\n```js\nconst { passwordHash, ...safeUser } = usuario;\nres.json(safeUser);\n```\n\n## Mensajes de error genéricos\n\nResponde siempre el mismo mensaje para usuario inexistente y contraseña incorrecta: evita que alguien descubra qué emails están registrados.\n\n## Buenas prácticas\n\n- Hash con bcrypt o argon2, nunca MD5/SHA1 solos.\n- Coste alto y salt automático.\n- Nunca loguear contraseñas ni hashes.\n- Exigir contraseñas fuertes (longitud, variedad) y usar HTTPS.\n\n> Si te llega una contraseña en texto plano, ese sistema ya es vulnerable. El hash es una capa más junto a HTTPS, límites de intentos y tokens.\n\n## Resumen y práctica\n\nAprendiste hash, salt y verificación segura. Practica el registro con hash y el login con compare.",
          exercises: [
            {
              title: "Registro y login con hash",
              description: "Guarda y verifica contraseñas de forma segura.",
              instructions:
                "En POST /register hashea la contraseña con bcrypt antes de guardar y nunca devuelvas el hash en la respuesta. En POST /login busca el usuario, compara con bcrypt.compare y responde 401 con mensaje genérico si las credenciales fallan. Excluye passwordHash de todas las respuestas.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "Usás bcrypt para el hash al registrar.",
                "La respuesta no incluye passwordHash.",
                "El login usa bcrypt.compare.",
                "Las credenciales inválidas devuelven 401 genérico.",
              ],
              tests: ["Verificar bcrypt", "Verificar que no se expone el hash", "Verificar login 401"],
            },
          ],
        },
        {
          slug: "jwt-access-refresh",
          title: "Access y refresh tokens",
          order: 2,
          durationMinutes: 50,
          markdown:
            "# Access y refresh tokens\n\nUn **token** prueba que ya iniciaste sesión. En vez de mandar usuario y contraseña en cada petición, el cliente envía un token firmado.\n\n## JWT: qué es\n\nUn **JSON Web Token** tiene tres partes: cabecera, payload (claims) y firma. El servidor lo firma con un secreto; el cliente no puede modificarlo sin invalidar la firma.\n\n```js\nimport jwt from 'jsonwebtoken';\n\nconst accessToken = jwt.sign({ sub: user.id, rol: user.rol }, SECRET, { expiresIn: '15m' });\nconst refreshToken = jwt.sign({ sub: user.id }, REFRESH_SECRET, { expiresIn: '30d' });\n```\n\n## Access vs refresh\n\n- **Access token**: vida corta (minutos). Viaja en cada petición.\n- **Refresh token**: vida larga (días). Se usa solo para pedir un access nuevo.\n\nAsí, si un access se filtra, el daño es breve; el refresh puede revocarse.\n\n## Dónde guardar los tokens\n\n- **Cookie httpOnly**: el JavaScript del navegador no puede leerla; protege contra robo por XSS. Es la opción recomendada para web.\n- **localStorage**: accesible por JS, más expuesto a XSS. Evítalo para tokens.\n\n```js\nres.cookie('access_token', accessToken, {\n  httpOnly: true,\n  secure: true,          // solo HTTPS en producción\n  sameSite: 'lax',       // protege de CSRF\n  maxAge: 15 * 60 * 1000,\n});\n```\n\n## Proteger rutas\n\n```js\nfunction requiereAuth(req, res, next) {\n  const token = req.cookies.access_token;\n  if (!token) return res.status(401).json({ error: 'No autenticado' });\n  try {\n    req.user = jwt.verify(token, SECRET);\n    next();\n  } catch {\n    res.status(401).json({ error: 'Token inválido o expirado' });\n  }\n}\n```\n\n## Renovar la sesión\n\nCuando el access expira, el cliente llama a `POST /refresh` con el refresh token y recibe un access nuevo, sin volver a pedir credenciales.\n\n## Buenas prácticas\n\n- Secretos largos y distintos para access y refresh.\n- Access de vida corta, refresh de vida larga y revocable.\n- Cookies httpOnly, secure y sameSite.\n- Nunca pongas el secreto en el cliente ni en el repositorio.\n\n> Un JWT no está cifrado, solo firmado: cualquiera puede leer su payload. No metas datos sensibles dentro.\n\n## Resumen y práctica\n\nAprendiste a firmar, verificar y renovar tokens con cookies seguras. Practica protegiendo una ruta privada.",
          exercises: [
            {
              title: "Login con cookie httpOnly y ruta protegida",
              description: "Protege una ruta privada con JWT.",
              instructions:
                "Implementa POST /login que firme un access token y lo guarde en una cookie httpOnly, y POST /refresh que renueve el access usando un refresh token. Protege GET /me con un middleware que verifique el token y devuelva el usuario; sin token debe responder 401.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 3,
              requirements: [
                "Firmás un JWT al hacer login.",
                "La cookie es httpOnly y sameSite.",
                "GET /me sin token responde 401.",
                "POST /refresh renueva el access token.",
              ],
              tests: ["Login firma un token", "Cookie httpOnly", "/me sin token -> 401", "Refresh renueva"],
            },
          ],
        },
        {
          slug: "autorizacion-roles",
          title: "Autorización y roles",
          order: 3,
          durationMinutes: 45,
          markdown:
            "# Autorización y roles\n\n**Autenticación** es *quién es la persona*. **Autorización** es *qué puede hacer*. Son problemas distintos y se resuelven en capas separadas.\n\n## Roles\n\n- `admin`: gestiona usuarios, configuración y recursos globales.\n- `usuario`: accede a sus propios recursos.\n\n## Middleware de autorización por rol\n\n```js\nfunction autorizar(...roles) {\n  return (req, res, next) => {\n    if (!req.user) return res.status(401).json({ error: 'No autenticado' });\n    if (!roles.includes(req.user.rol)) {\n      return res.status(403).json({ error: 'Sin permisos' });\n    }\n    next();\n  };\n}\n\napp.delete('/tareas/:id', requiereAuth, autorizar('admin'), eliminarTarea);\n```\n\n## Acceso por propiedad (ownership)\n\nAdemás del rol, verifica que el recurso sea del usuario. Un usuario común no debe poder tocar los datos de otro:\n\n```js\nconst tarea = await prisma.tarea.findUnique({ where: { id } });\nif (tarea.usuarioId !== req.user.sub) {\n  return res.status(403).json({ error: 'Sin permisos sobre esta tarea' });\n}\n```\n\n## Distinguir 401 y 403\n\n- **401**: no hay identidad válida (falta token o es inválido).\n- **403**: hay identidad, pero no tiene permiso.\n\nUsarlos mal confunde al cliente y complica la depuración.\n\n## Permisos más finos\n\nCuando los roles se quedan cortos, se usan permisos (`tarea:crear`, `tarea:borrar`) o *scopes*. La idea es separar la regla de autorización del handler.\n\n## Buenas prácticas\n\n- Autoriza en el servidor, nunca solo en el cliente (ocultar un botón no es seguridad).\n- Verifica siempre la propiedad del recurso.\n- Centraliza las reglas en un middleware reutilizable.\n- Devuelve 403 sin filtrar si el recurso existe o no.\n\n> Error común: validar el rol en el frontend y creer que estás protegido. Cualquiera puede llamar a la API directo.\n\n## Resumen y práctica\n\nAprendiste roles, ownership y la diferencia entre 401 y 403. Practica protegiendo un endpoint solo para admins.",
          exercises: [
            {
              title: "Ruta solo para administradores",
              description: "Bloquea un endpoint por rol y propiedad.",
              instructions:
                "Protege DELETE /tareas/:id para que solo el rol admin pueda usarla (403 para otros roles autenticados, 401 sin token). Además, permite que un usuario no admin borre únicamente sus propias tareas y devuelva 403 si intenta borrar la de otro.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "Sin token -> 401.",
                "Token sin rol admin -> 403.",
                "Admin -> 204.",
                "Un usuario no puede borrar tareas ajenas.",
              ],
              tests: ["401 sin token", "403 con rol usuario", "204 con admin", "403 al borrar ajeno"],
            },
          ],
        },
        {
          slug: "seguridad-buenas-practicas",
          title: "Buenas prácticas de seguridad en APIs",
          order: 4,
          durationMinutes: 45,
          markdown:
            "# Seguridad en APIs\n\nLa seguridad no es una capa que se agrega al final: son decisiones que se toman en cada endpoint. Este es el checklist esencial.\n\n## Nunca filtrar datos sensibles\n\n- Excluye `passwordHash`, tokens y campos internos en `select`.\n- No devuelvas stack traces ni mensajes internos de la base de datos.\n- Registra los detalles en el servidor, no en la respuesta.\n\n```js\nconst usuario = await prisma.user.findUnique({\n  where: { id },\n  select: { id: true, email: true, name: true },   // sin passwordHash\n});\n```\n\n## Rate limiting\n\nLimita intentos por IP en login y endpoints sensibles para frenar fuerza bruta:\n\n```js\nimport rateLimit from 'express-rate-limit';\napp.use('/api/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }));\n```\n\n## Headers de seguridad con helmet\n\n```js\nimport helmet from 'helmet';\napp.use(helmet());   // cabeceras seguras y CSP por defecto\n```\n\n## CORS correcto\n\nPermite solo los orígenes de confianza y las credenciales necesarias:\n\n```js\napp.use(cors({ origin: 'https://tu-app.com', credentials: true }));\n```\n\nNo uses `origin: true` con credenciales en producción sin control.\n\n## Inyección y validación\n\n- Usa consultas parametrizadas (Prisma lo hace). Nunca concatenes SQL.\n- Valida y limita el tamaño del body.\n- Escapa contenido si lo insertas en HTML.\n\n## Secretos y HTTPS\n\n- Secretos en variables de entorno, nunca en el código ni en Git.\n- HTTPS obligatorio en producción; cookies `secure`.\n- Rota claves si alguna se filtra.\n\n## Checklist rápido\n\n- ¿Valido toda la entrada? ¿Devuelvo solo lo necesario?\n- ¿Tengo rate limiting en login? ¿HTTPS? ¿CORS restringido?\n- ¿Mis dependencias están actualizadas (`npm audit`)?\n\n> La seguridad es defensa en profundidad: varias capas, cada una reduce el riesgo. Ninguna alcanza sola.\n\n## Resumen y práctica\n\nRepasaste el checklist de seguridad de una API. Practica aplicando helmet, rate limiting y selects seguros a tu proyecto.",
          exercises: [
            {
              title: "Endurece tu API",
              description: "Aplica el checklist de seguridad.",
              instructions:
                "Aplica a tu proyecto: helmet para cabeceras, rate limiting en el endpoint de login, CORS restringido a un origen y selects que excluyan datos sensibles. Documenta en un archivo seguridad.md cada medida y por qué la aplicaste.",
              difficulty: "ADVANCED",
              maxAttempts: 2,
              requirements: [
                "Usás helmet.",
                "Aplicás rate limiting en login.",
                "Restringís CORS a un origen.",
                "Excluís datos sensibles con select.",
              ],
              tests: ["Verificar helmet", "Verificar rate limiting", "Verificar selects seguros"],
            },
          ],
        },
      ],
    },
    {
      slug: "base-de-datos",
      title: "Base de datos con PostgreSQL",
      description: "Modelado, consultas, relaciones y migraciones con Prisma y PostgreSQL.",
      order: 3,
      estimatedHours: 9,
      lessons: [
        {
          slug: "postgres-y-prisma",
          title: "PostgreSQL y Prisma",
          order: 1,
          durationMinutes: 45,
          markdown:
            "# PostgreSQL y Prisma\n\nPostgreSQL es una base de datos **relacional**: guarda datos en tablas con columnas tipadas y relaciones entre ellas. **Prisma** es el ORM que te da un cliente tipado para consultarla.\n\n## Por qué una base relacional\n\n- Integridad: las relaciones y restricciones evitan datos inconsistentes.\n- Consultas potentes: filtros, joins, agregaciones.\n- Transacciones: varias operaciones que se confirman o se deshacen juntas.\n\n## El esquema de Prisma\n\nDefines tus modelos en `schema.prisma` y Prisma genera el cliente:\n\n```prisma\nmodel Tarea {\n  id        Int      @id @default(autoincrement())\n  titulo    String\n  estado    String   @default(\"pendiente\")\n  creadaEn  DateTime @default(now())\n}\n```\n\n- `@id` marca la clave primaria.\n- `@default` define valores por defecto.\n- Cada campo tiene un tipo: `String`, `Int`, `Boolean`, `DateTime`, `Json`.\n\n## Generar y usar el cliente\n\n```bash\nnpx prisma generate\n```\n\n```js\nimport { PrismaClient } from '@prisma/client';\nconst prisma = new PrismaClient();\nconst tareas = await prisma.tarea.findMany();\n```\n\n## Migraciones\n\nUna **migración** es un archivo versionado que describe cómo cambia el esquema. Se aplican de forma reproducible en cualquier entorno:\n\n```bash\nnpx prisma migrate dev --name crear_tarea\n```\n\nEn producción se aplican con `prisma migrate deploy`.\n\n## Ventajas del cliente tipado\n\n```js\n// TypeScript conoce los campos y sus tipos\nconst tarea = await prisma.tarea.create({ data: { titulo: 'Comprar pan' } });\ntarea.titulo;   // string, autocompletado\n```\n\nMuchos errores de datos se detectan en tiempo de compilación.\n\n## Buenas prácticas\n\n- Un `PrismaClient` compartido para toda la app.\n- Migraciones versionadas en Git, nunca cambiar el esquema a mano en la base.\n- Nombres claros para modelos y campos.\n- Índices en columnas que filtras seguido.\n\n> Prisma traduce tus consultas a SQL parametrizado: evita inyección SQL de forma nativa.\n\n## Resumen y práctica\n\nAprendiste a modelar con Prisma y a generar migraciones. Practica definiendo y migrando un modelo Tarea.",
          exercises: [
            {
              title: "Modelo Tarea y primera migración",
              description: "Define y migra tu primera tabla.",
              instructions:
                "Define en schema.prisma un modelo Tarea con id, titulo String, estado String con valor por defecto pendiente y creadaEn DateTime. Genera el cliente con prisma generate y ejecuta una migración inicial con prisma migrate dev. Verifica en la base que la tabla existe.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "El modelo Tarea existe en el schema con los tipos correctos.",
                "Generás el cliente con prisma generate.",
                "Ejecutás una migración con prisma migrate dev.",
              ],
              tests: ["Verificar modelo", "Verificar migración aplicada"],
            },
          ],
        },
        {
          slug: "modelos-y-consultas",
          title: "Consultas: create, findMany, update y delete",
          order: 2,
          durationMinutes: 50,
          markdown:
            "# Consultas con Prisma Client\n\nPrisma mapea cada modelo a un objeto con métodos CRUD tipados.\n\n## Crear\n\n```js\nconst tarea = await prisma.tarea.create({\n  data: { titulo: 'Comprar pan', estado: 'pendiente' },\n});\n```\n\n## Leer\n\n```js\nconst todas = await prisma.tarea.findMany();\nconst una = await prisma.tarea.findUnique({ where: { id: 1 } });\nconst primera = await prisma.tarea.findFirst({ where: { estado: 'pendiente' } });\n```\n\n## Actualizar\n\n```js\nconst actualizada = await prisma.tarea.update({\n  where: { id: 1 },\n  data: { estado: 'hecha' },\n});\n```\n\n## Borrar\n\n```js\nawait prisma.tarea.delete({ where: { id: 1 } });\n```\n\n## Filtros, orden y paginación\n\n```js\nconst tareas = await prisma.tarea.findMany({\n  where: {\n    estado: 'pendiente',\n    titulo: { contains: 'comprar', mode: 'insensitive' },\n  },\n  orderBy: { creadaEn: 'desc' },\n  skip: 0,\n  take: 10,\n  select: { id: true, titulo: true, estado: true },\n});\n```\n\n- `where` filtra; combina con `AND`, `OR`, `NOT`.\n- `orderBy` ordena.\n- `skip`/`take` paginan.\n- `select` limita campos (rendimiento y seguridad).\n\n## Contar y agregar\n\n```js\nconst total = await prisma.tarea.count({ where: { estado: 'pendiente' } });\nconst grupos = await prisma.tarea.groupBy({ by: ['estado'], _count: true });\n```\n\n## Upsert y transacciones\n\n```js\nawait prisma.tarea.upsert({\n  where: { id: 1 },\n  update: { estado: 'hecha' },\n  create: { titulo: 'Nueva', estado: 'pendiente' },\n});\n\nawait prisma.$transaction([\n  prisma.tarea.create({ data: { titulo: 'A' } }),\n  prisma.tarea.update({ where: { id: 2 }, data: { estado: 'hecha' } }),\n]);\n```\n\n`upsert` crea o actualiza según exista; las transacciones agrupan operaciones atómicas.\n\n## Buenas prácticas\n\n- Selecciona solo lo necesario con `select`.\n- Maneja el caso \"no existe\": `findUnique` devuelve `null`, `update`/`delete` lanzan error.\n- Pagina siempre las listas grandes.\n- Índices en los campos que filtrás.\n\n> Error común: hacer `findMany()` sin `take` en tablas grandes y traer toda la base a memoria.\n\n## Resumen y práctica\n\nDominaste el CRUD y los filtros de Prisma. Practica moviendo tu CRUD en memoria a PostgreSQL.",
          exercises: [
            {
              title: "CRUD persistente con Prisma",
              description: "Mueve tu CRUD a PostgreSQL.",
              instructions:
                "Reemplaza el array en memoria por consultas de Prisma: listar con findMany y paginación, crear con create, actualizar con update y eliminar con delete. Agrega un filtro por estado y un endpoint que devuelva el conteo de tareas por estado. Si el id no existe en update/delete, responde 404.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 3,
              requirements: [
                "Listar usa findMany con take.",
                "Crear usa create.",
                "Actualizar usa update.",
                "Borrar usa delete.",
                "Un id inexistente devuelve 404.",
              ],
              tests: ["GET lista de la DB", "POST persiste", "DELETE afecta la DB", "404 en id inexistente"],
            },
          ],
        },
        {
          slug: "relaciones-y-cascada",
          title: "Relaciones y borrado en cascada",
          order: 3,
          durationMinutes: 50,
          markdown:
            "# Relaciones y borrado en cascada\n\nLas entidades se relacionan: un usuario tiene muchas tareas, una tarea tiene muchos comentarios. Modelar esas relaciones (y qué pasa al borrar) es parte central del diseño.\n\n## Relación uno-a-muchos\n\n```prisma\nmodel Usuario {\n  id     Int     @id @default(autoincrement())\n  email  String  @unique\n  tareas Tarea[]\n}\n\nmodel Tarea {\n  id        Int     @id @default(autoincrement())\n  titulo    String\n  usuario   Usuario @relation(fields: [usuarioId], references: [id])\n  usuarioId Int\n}\n```\n\n- El lado `1` tiene un array `Tarea[]`.\n- El lado `N` tiene la clave foránea `usuarioId`.\n\n## Consultar datos relacionados\n\n```js\nconst usuario = await prisma.usuario.findUnique({\n  where: { id: 1 },\n  include: { tareas: true },\n});\n\nconst tarea = await prisma.tarea.findMany({\n  where: { usuarioId: 1 },\n  include: { usuario: { select: { email: true } } },\n});\n```\n\n`include` trae las relaciones; `select` elige campos.\n\n## Crear con relación\n\n```js\nawait prisma.tarea.create({\n  data: {\n    titulo: 'Nueva',\n    usuario: { connect: { id: 1 } },   // conecta a un usuario existente\n  },\n});\n```\n\n## OnDelete: qué pasa al borrar\n\n- `Cascade`: borra los hijos automáticamente.\n- `Restrict`: impide borrar si hay hijos (por defecto en algunos casos).\n- `SetNull`: pone la clave foránea en null.\n\n```prisma\nmodel Comentario {\n  id     Int   @id @default(autoincrement())\n  tarea  Tarea @relation(fields: [tareaId], references: [id], onDelete: Cascade)\n  tareaId Int\n}\n```\n\nSin `Cascade`, borrar una tarea con comentarios puede fallar por la restricción de integridad. Decide siempre qué debe pasar con los hijos.\n\n## Muchos-a-muchos\n\n```prisma\nmodel Etiqueta {\n  id      Int      @id @default(autoincrement())\n  nombre  String\n  tareas  Tarea[]\n}\nmodel Tarea {\n  id        Int        @id @default(autoincrement())\n  etiquetas Etiqueta[]\n}\n```\n\nPrisma crea la tabla intermedia automáticamente.\n\n## Buenas prácticas\n\n- Define `onDelete` en cada relación según la regla de negocio.\n- Indexa las claves foráneas (Prisma suele hacerlo).\n- Evita consultas N+1: usa `include` bien.\n- Los nombres de relación deben leerse claros.\n\n> Error común: borrar un padre sin definir `onDelete` y romper la integridad referencial.\n\n## Resumen y práctica\n\nAprendiste a modelar relaciones y a decidir el borrado. Practica relacionando Usuario y Tarea.",
          exercises: [
            {
              title: "Relación Usuario-Tarea",
              description: "Modela y consulta datos relacionados.",
              instructions:
                "Agrega un modelo Usuario, relacionalo con Tarea mediante una clave foránea y define onDelete. Escribe una consulta que traiga un usuario con sus tareas usando include, y crea una tarea conectándola a un usuario existente con connect. Verifica el borrado en cascada de las tareas al eliminar un usuario.",
              difficulty: "ADVANCED",
              maxAttempts: 2,
              requirements: [
                "Existe la relación Usuario-Tarea con onDelete definido.",
                "Usás include para traer las tareas del usuario.",
                "Creás una tarea con connect.",
                "El borrado en cascada funciona.",
              ],
              tests: ["Verificar relación", "Verificar include", "Verificar cascade"],
            },
          ],
        },
        {
          slug: "migraciones-y-seed",
          title: "Migraciones, seed y datos iniciales",
          order: 4,
          durationMinutes: 45,
          markdown:
            "# Migraciones, seed y datos iniciales\n\nEl esquema cambia con el tiempo. Las migraciones llevan ese cambio de forma controlada a cada entorno, y el **seed** carga datos iniciales reproducibles.\n\n## El ciclo de migraciones\n\n```bash\nnpx prisma migrate dev --name agrega_prioridad   # desarrollo\nnpx prisma migrate deploy                          # producción\nnpx prisma migrate status                          # estado\nnpx prisma migrate resolve --rolled-back <mig>     # revertir una fallida\n```\n\n- En desarrollo, `migrate dev` crea el archivo SQL y lo aplica.\n- En producción, `migrate deploy` aplica las migraciones pendientes sin crear nuevas.\n\n## Nunca edites a mano la base\n\nCambiar el esquema directamente en la base rompe la coherencia con las migraciones. Siempre: editas `schema.prisma` -> generas migración -> Prisma aplica.\n\n## Seed: datos iniciales\n\nUn script de seed crea datos base (roles, categorías, un admin) de forma idempotente:\n\n```js\n// prisma/seed.js\nasync function main() {\n  await prisma.estado.upsert({\n    where: { nombre: 'pendiente' },\n    update: {},\n    create: { nombre: 'pendiente' },\n  });\n}\nmain().finally(() => prisma.$disconnect());\n```\n\nConfigúralo en `package.json`:\n\n```json\n{ \"prisma\": { \"seed\": \"node prisma/seed.js\" } }\n```\n\n## Idempotencia\n\nEl seed debe poder correrse muchas veces sin duplicar datos. Usa `upsert` (crea si no existe, actualiza si existe) en lugar de `create` ciego.\n\n## Buenas prácticas\n\n- Una migración por cambio lógico, con nombre descriptivo.\n- Migraciones en control de versiones.\n- Seed idempotente y separado por entorno.\n- Nunca siembres datos reales de producción en local ni al revés.\n\n> Las migraciones son el historial del esquema, igual que los commits lo son del código. Trátalas con el mismo cuidado.\n\n## Resumen y práctica\n\nAprendiste el ciclo de migraciones y a escribir un seed idempotente. Practica agregando un campo y migrando, más un seed de datos base.",
          exercises: [
            {
              title: "Agrega un campo con migración y un seed",
              description: "Evoluciona el esquema de forma controlada.",
              instructions:
                "Agrega un campo prioridad al modelo Tarea (con default). Genera y aplica la migración con prisma migrate dev. Escribe un seed idempotente que inserte los estados base o un usuario admin, configúralo en package.json y córrelo dos veces para verificar que no duplica datos.",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "Agregás el campo con una migración nueva.",
                "El seed usa upsert y es idempotente.",
                "Configurás el seed en package.json.",
                "Corrés el seed dos veces sin duplicar.",
              ],
              tests: ["Verificar migración", "Verificar seed idempotente"],
            },
          ],
        },
      ],
    },
    {
      slug: "testing-y-documentacion",
      title: "Testing y documentación",
      description: "Pruebas automatizadas y documentación de la API.",
      order: 4,
      estimatedHours: 6,
      lessons: [
        {
          slug: "testing-con-vitest",
          title: "Testing con Vitest",
          order: 1,
          durationMinutes: 50,
          markdown:
            "# Testing con Vitest\n\nLas **pruebas automatizadas** te permiten cambiar el código sin miedo: si rompes algo, el test falla antes de llegar a producción.\n\n## La pirámide de pruebas\n\n- **Unitarias**: prueban una función o servicio aislado. Rápidas y muchas.\n- **De integración**: prueban varias capas juntas (servicio + base de datos).\n- **End-to-end**: simulan la API completa con peticiones reales. Pocas y lentas.\n\n## Tu primer test con Vitest\n\n```js\nimport { describe, it, expect } from 'vitest';\nimport { calcularTotal } from '../src/carrito.js';\n\ndescribe('calcularTotal', () => {\n  it('suma precios con cantidad', () => {\n    const items = [{ precio: 10, cantidad: 2 }, { precio: 5, cantidad: 1 }];\n    expect(calcularTotal(items)).toBe(25);\n  });\n\n  it('devuelve 0 con carrito vacío', () => {\n    expect(calcularTotal([])).toBe(0);\n  });\n});\n```\n\n## Assertions comunes\n\n```js\nexpect(valor).toBe(3);            // igualdad estricta\nexpect(objeto).toEqual({ a: 1 }); // igualdad profunda\nexpect(arr).toHaveLength(2);\nexpect(fn).toThrow();\nexpect(valor).toBeTruthy();\n```\n\n## Probar la API (integración)\n\n```js\nimport request from 'supertest';\nimport { app } from '../src/app.js';\n\nit('POST /tareas responde 201', async () => {\n  const res = await request(app).post('/api/tareas').send({ titulo: 'Comprar pan' });\n  expect(res.status).toBe(201);\n  expect(res.body.titulo).toBe('Comprar pan');\n});\n```\n\n## Qué probar\n\n- Caminos felices: lo que debería funcionar.\n- Casos borde: vacío, cero, máximo, nulo.\n- Errores: validación, 401, 403, 404.\n\n## Buenas prácticas\n\n- Un test, una idea; nombres descriptivos.\n- Testea comportamiento, no implementación.\n- Aísla: cada test limpio antes/después (base de datos de prueba).\n- Corré los tests en cada push (CI).\n\n> Una suite que tarda demasiado deja de correrse. Mantén los tests unitarios rápidos y reserva los e2e para lo crítico.\n\n## Resumen y práctica\n\nAprendiste unitarias e integración con Vitest. Practica testeando un servicio y un endpoint.",
          exercises: [
            {
              title: "Prueba un servicio y un endpoint",
              description: "Escribe tests unitarios y de integración.",
              instructions:
                "Escribe al menos tres tests unitarios para una función de tu proyecto (casos feliz, borde y error) con Vitest. Agrega un test de integración con supertest que verifique que POST /tareas devuelve 201 y que un título vacío devuelve 400. Configura npm test para correr la suite.",
              difficulty: "ADVANCED",
              maxAttempts: 2,
              requirements: [
                "Tenés al menos 3 tests unitarios.",
                "Tenés un test de integración con supertest.",
                "Cubrís un caso de error (400).",
                "npm test corre la suite.",
              ],
              tests: ["Verificar tests unitarios", "Verificar test de integración", "Verificar npm test"],
            },
          ],
        },
        {
          slug: "documentacion-con-swagger",
          title: "Documentación de la API con Swagger/OpenAPI",
          order: 2,
          durationMinutes: 45,
          markdown:
            "# Documentación de la API con Swagger/OpenAPI\n\nUna API sin documentación es una API que nadie quiere usar. **OpenAPI** es el estándar para describir APIs REST, y **Swagger UI** genera una página interactiva a partir de esa descripción.\n\n## Qué documenta OpenAPI\n\n- Rutas y métodos.\n- Parámetros, query y body de cada endpoint.\n- Respuestas y códigos de estado.\n- Autenticación.\n\n## Ejemplo de especificación (YAML)\n\n```yaml\nopenapi: 3.0.0\ninfo:\n  title: API de Tareas\n  version: 1.0.0\npaths:\n  /tareas:\n    get:\n      summary: Lista las tareas\n      responses:\n        '200':\n          description: Lista de tareas\n    post:\n      summary: Crea una tarea\n      requestBody:\n        required: true\n        content:\n          application/json:\n            schema:\n              type: object\n              required: [titulo]\n              properties:\n                titulo: { type: string }\n      responses:\n        '201':\n          description: Tarea creada\n        '400':\n          description: Datos inválidos\n```\n\n## En NestJS con decoradores\n\nNestJS genera Swagger desde el código:\n\n```ts\n@ApiTags('tareas')\n@Controller('tareas')\nexport class TareasController {\n  @Get()\n  @ApiOperation({ summary: 'Lista las tareas' })\n  listar() { return this.servicio.listar(); }\n}\n```\n\nY se sirve la UI en `/api/docs`.\n\n## Por qué documentar\n\n- El frontend y otros equipos entienden el contrato sin preguntarte.\n- Permite probar endpoints desde el navegador.\n- Facilita generar clientes tipados automáticamente.\n- La documentación y el código evolucionan juntos.\n\n## Buenas prácticas\n\n- Documenta todos los códigos de respuesta posibles.\n- Incluye ejemplos de request y response.\n- Marca qué endpoints requieren autenticación.\n- Mantén la documentación junto al código (decoradores o comentarios), no en un archivo aparte que se desactualiza.\n\n> Si documentás con decoradores junto al endpoint, es mucho más difícil que la documentación quede desfasada.\n\n## Resumen y práctica\n\nAprendiste a describir tu API con OpenAPI y a servir Swagger UI. Practica documentando tus endpoints.",
          exercises: [
            {
              title: "Documenta tus endpoints",
              description: "Genera documentación interactiva de la API.",
              instructions:
                "Documenta al menos tres endpoints de tu API con OpenAPI: usando decoradores (si usás NestJS) o una especificación YAML. Incluye método, ruta, parámetros, body, y todas las respuestas posibles (200, 201, 400, 404). Expone la documentación en una ruta accesible (/api/docs).",
              difficulty: "INTERMEDIATE",
              maxAttempts: 2,
              requirements: [
                "Documentás al menos 3 endpoints.",
                "Incluís request body y respuestas.",
                "Documentás los códigos de error.",
                "La documentación es accesible desde una URL.",
              ],
              tests: ["Verificar endpoints documentados", "Verificar Swagger UI accesible"],
            },
          ],
        },
      ],
    },
  ],
};
