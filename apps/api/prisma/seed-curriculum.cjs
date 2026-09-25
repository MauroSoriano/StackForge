"use strict";
// Seed del currículum StackForge (curso 100% texto).
// Uso: node prisma/seed-curriculum.cjs  (requiere DATABASE_URL en .env)
//
// El contenido vive en ./content/*.cjs (un archivo por track). Este loader lo
// recorre y lo sincroniza con la base de forma idempotente.
//
// Importante: los ejercicios se actualizan por (lección + título) en lugar de
// borrarse y recrearse, para NO eliminar las entregas (submissions) ya hechas
// por los usuarios, que referencian al ejercicio por su id.
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

const CONTENT_DIR = path.join(__dirname, "content");
const course = fs
  .readdirSync(CONTENT_DIR)
  .filter((f) => f.endsWith(".cjs"))
  .sort()
  .map((f) => require(path.join(CONTENT_DIR, f)));

async function syncExercise(lessonId, ex, order) {
  const data = {
    lessonId,
    description: ex.description,
    instructions: ex.instructions,
    order,
    difficulty: ex.difficulty,
    maxAttempts: ex.maxAttempts,
  };

  const existing = await prisma.exercise.findFirst({
    where: { lessonId, title: ex.title },
    select: { id: true },
  });

  let exerciseId;
  if (existing) {
    await prisma.exercise.update({ where: { id: existing.id }, data });
    exerciseId = existing.id;
  } else {
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
      order: ri + 1,
      isMandatory: true,
    })),
  });
  await prisma.exerciseTest.createMany({
    data: ex.tests.map((n, ri) => ({ exerciseId, name: n, order: ri + 1 })),
  });

  return exerciseId;
}

async function upsertCourse() {
  for (const [ti, track] of course.entries()) {
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

        const keepTitles = new Set(lesson.exercises.map((e) => e.title));
        for (const [ei, ex] of lesson.exercises.entries()) {
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

upsertCourse()
  .then(() => {
    console.log("SEED OK");
  })
  .catch((err) => {
    console.error("SEED FAIL", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
