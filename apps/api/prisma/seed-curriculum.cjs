"use strict";
/* ===========================================================================
 * seed-curriculum.cjs — SCRIPT DE CARGA DEL CURRÍCULUM (SEED)
 * ---------------------------------------------------------------------------
 * PROPÓSITO:
 *   Leer todo el contenido del curso (tracks -> módulos -> lecciones ->
 *   ejercicios) desde los archivos de ./content/*.cjs y volcarlo en la base de
 *   datos PostgreSQL de forma IDEMPOTENTE: correrlo una o mil veces debe dejar
 *   la base en el mismo estado, sin duplicar filas.
 *
 *   No hay que ejecutarlo con prisma migrate ni con npm; se corre directamente
 *   con Node:  node prisma/seed-curriculum.cjs
 *   y necesita DATABASE_URL disponible en el archivo .env del proyecto (una
 *   carpeta arriba de prisma/).
 *
 * IDEA CLAVE (por qué es idempotente):
 *   Cada entidad se actualiza con "upsert" usando una clave natural estable
 *   (track.slug, módulo por [trackId, order], lección por [moduleId, slug]) y
 *   los ejercicios por (lección + título). Así el seed actualiza el contenido
 *   existente en lugar de borrarlo y recrearlo, y sobre todo NO destruye las
 *   entregas (submissions) que los usuarios ya hicieron (ver más abajo).
 * ===========================================================================
 */
// Seed del currículum StackForge (curso 100% texto).
// Uso: node prisma/seed-curriculum.cjs  (requiere DATABASE_URL en .env)
//
// El contenido vive en ./content/*.cjs (un archivo por track). Este loader lo
// recorre y lo sincroniza con la base de forma idempotente.
//
// Importante: los ejercicios se actualizan por (lección + título) en lugar de
// borrarse y recrearse, para NO eliminar las entregas (submissions) ya hechas
// por los usuarios, que referencian al ejercicio por su id.
const fs = require("fs");           // leer archivos y directorios
const path = require("path");       // construir rutas seguras entre sistemas
const { PrismaPg } = require("@prisma/adapter-pg");                      // adaptador PostgreSQL para Prisma 7
const { PrismaClient } = require("../dist/generated/prisma/client.js");  // cliente generado en build (dist)

/**
 * envFromDotEnv — lee la variable DATABASE_URL directamente del archivo .env.
 *
 * ¿Por qué no usar dotenv? Porque este script se ejecuta con Node "pelado" como
 * un seed independiente, así que parsea el .env a mano para no depender de esa
 * librería. Soporta el valor entre comillas dobles o simples.
 *
 * Orden de búsqueda:
 *   1) DATABASE_URL="..."   (comillas dobles)
 *   2) DATABASE_URL='...'   (comillas simples)
 *   3) process.env.DATABASE_URL como respaldo (variable de entorno del sistema)
 *
 * @returns {string} la cadena de conexión encontrada, o "" si no existe.
 */
function envFromDotEnv() {
  const file = path.join(__dirname, "..", ".env");      // el .env está un nivel arriba de prisma/
  const raw = fs.readFileSync(file, "utf8");            // contenido completo del .env
  const match = raw.match(/^\s*DATABASE_URL\s*=\s*"([^"]+)"\s*$/m);
  if (match) return match[1];
  const match2 = raw.match(/^\s*DATABASE_URL\s*=\s*'([^']+)'\s*$/m);
  if (match2) return match2[1];
  return process.env.DATABASE_URL ?? "";
}

// Sin cadena de conexión no se puede sembrar: se aborta con un error claro.
const DATABASE_URL = envFromDotEnv();
if (!DATABASE_URL) {
  console.error("Falta DATABASE_URL en .env");
  process.exit(1);
}

// Cliente de Prisma usando el driver adapter de PostgreSQL (Prisma 7 no usa url en el schema).
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: DATABASE_URL }),
});

// ---------------------------------------------------------------------------
// CARGA DEL CONTENIDO desde prisma/content/*.cjs
// ---------------------------------------------------------------------------
// Cada archivo .cjs exporta un objeto "track" (ver cabecera de cada uno).
// Se leen todos, se ordenan por nombre y se cargan en memoria en `course`.
const CONTENT_DIR = path.join(__dirname, "content");
const course = fs
  .readdirSync(CONTENT_DIR)               // lista de archivos del directorio
  .filter((f) => f.endsWith(".cjs"))      // solo los .cjs (un archivo por track)
  .sort()                                 // orden alfabético determinista
  .map((f) => require(path.join(CONTENT_DIR, f)));  // require -> objeto del track

/**
 * syncExercise — crea o actualiza UN ejercicio de una lección, sin perder sus entregas.
 *
 * Recibe:
 *   lessonId -> id de la lección dueña del ejercicio
 *   ex       -> objeto ejercicio del contenido (title, description, instructions,
 *               difficulty, maxAttempts, requirements[], tests[])
 *   order    -> posición del ejercicio dentro de la lección (1, 2, 3...)
 *
 * ESTRATEGIA (muy importante):
 *   Se busca el ejercicio existente por (lessonId + title), NO por id. Esta es la
 *   "clave natural" del contenido. Si existe, se ACTUALIZA; si no, se CREA.
 *
 *   ¿Por qué upsert por título y no borrar+recrear?
 *   Porque la tabla Submission (entregas de los usuarios) apunta al ejercicio por
 *   su id. Si borráramos y volviéramos a crear el ejercicio, cambiaría su id y las
 *   entregas ya realizadas quedarían huérfanas o se perderían. Al conservar el id
 *   del ejercicio existente, el historial de entregas de los estudiantes se mantiene.
 *
 *   Los requirements y tests SÍ son solo contenido: no tienen entregas asociadas,
 *   así que se regeneran (deleteMany + createMany) en cada corrida sin riesgo.
 *
 * @returns {Promise<string>} el id del ejercicio (existente o recién creado).
 */
async function syncExercise(lessonId, ex, order) {
  const data = {
    lessonId,
    description: ex.description,
    instructions: ex.instructions,
    order,
    difficulty: ex.difficulty,
    maxAttempts: ex.maxAttempts,
  };

  // Clave natural del ejercicio dentro de su lección: el título.
  const existing = await prisma.exercise.findFirst({
    where: { lessonId, title: ex.title },
    select: { id: true },   // solo necesitamos el id para decidir update vs create
  });

  let exerciseId;
  if (existing) {
    // Ya existe: actualizamos sus campos CONSERVANDO el id (y por tanto sus entregas).
    await prisma.exercise.update({ where: { id: existing.id }, data });
    exerciseId = existing.id;
  } else {
    // No existe: lo creamos con su título (la clave natural para futuras corridas).
    const created = await prisma.exercise.create({
      data: { ...data, title: ex.title },
      select: { id: true },
    });
    exerciseId = created.id;
  }

  // Requisitos y tests son solo contenido: se regeneran.
  await prisma.exerciseRequirement.deleteMany({ where: { exerciseId } });
  await prisma.exerciseTest.deleteMany({ where: { exerciseId } });
  await prisma.exerciseRequirement.createMany({
    data: ex.requirements.map((r, ri) => ({
      exerciseId,
      description: r,
      order: ri + 1,        // el orden empieza en 1 para mostrarlo al estudiante
      isMandatory: true,    // en el seed todos los requisitos son obligatorios
    })),
  });
  await prisma.exerciseTest.createMany({
    data: ex.tests.map((n, ri) => ({ exerciseId, name: n, order: ri + 1 })),
  });

  return exerciseId;
}

/**
 * upsertCourse — recorre todo el contenido en memoria y lo sincroniza con la base.
 *
 * Jerarquía que se recorre:
 *   track  -> modules[] -> lessons[] -> exercises[]
 *
 * En cada nivel se usa UPSERT (crea si no existe, actualiza si existe) apoyado en
 * una clave natural, para poder correr el seed muchas veces sin duplicar datos:
 *   - Track:   clave = slug
 *   - Module:  clave = (trackId, order)   [índice único @@unique([trackId, order])]
 *   - Lesson:  clave = (moduleId, slug)   [índice único @@unique([moduleId, slug])]
 *   - Exercise: clave = (lessonId, title) [resuelto dentro de syncExercise]
 *
 * De nuevo: los ejercicios NO se borran y recrean, porque las entregas de los
 * usuarios (Submission) referencian al ejercicio por id. Solo se actualizan.
 *
 * Única excepción: si un ejercicio que existía en la base ya NO aparece en el
 * contenido (se renombró o se quitó), se elimina junto con sus entregas; eso se
 * hace al final del bucle de lecciones con deleteMany(title notIn keepTitles).
 */
async function upsertCourse() {
  // `ti` es solo el índice para el log; `track` es el objeto de contenido.
  for (const [ti, track] of course.entries()) {
    // Track: upsert por slug (clave natural estable y única).
    const t = await prisma.track.upsert({
      where: { slug: track.slug },
      update: {
        title: track.title,
        description: track.description,
        type: track.type,
        order: track.order,
      },
      create: {
        slug: track.slug,
        title: track.title,
        description: track.description,
        type: track.type,
        order: track.order,
      },
    });
    console.log(`track ${ti + 1}/${course.length}: ${t.slug}`);

    for (const mod of track.modules) {
      // Module: upsert por la clave compuesta (trackId, order).
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
        // Lesson: upsert por la clave compuesta (moduleId, slug).
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

        // Títulos que SÍ deben quedarse: sirven para detectar ejercicios obsoletos.
        const keepTitles = new Set(lesson.exercises.map((e) => e.title));
        for (const [ei, ex] of lesson.exercises.entries()) {
          // syncExercise conserva el id del ejercicio (y sus entregas) y devuelve el id.
          const id = await syncExercise(l.id, ex, ei + 1);
          console.log(`      ejercicio: ${id} ${ex.title}`);
        }

        // Ejercicios que ya no están en el contenido: se eliminan (con sus entregas).
        await prisma.exercise.deleteMany({
          where: { lessonId: l.id, title: { notIn: [...keepTitles] } },
        });
      }
    }
  }
}

// Punto de entrada: ejecuta el sembrado, informa el resultado y cierra la conexión.
upsertCourse()
  .then(() => {
    console.log("SEED OK");
  })
  .catch((err) => {
    console.error("SEED FAIL", err);
    process.exitCode = 1;   // marca el proceso como fallido sin tumbar el cierre
  })
  .finally(() => prisma.$disconnect());   // libera siempre la conexión a la base
