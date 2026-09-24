-- AlterTable
ALTER TABLE "SubmissionFile" ADD COLUMN IF NOT EXISTS "content" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SubmissionFile" ALTER COLUMN "content" TYPE TEXT USING "content"::text;
ALTER TABLE "SubmissionFile" ALTER COLUMN "content" SET NOT NULL;
ALTER TABLE "SubmissionFile" ALTER COLUMN "content" SET DEFAULT '';
ALTER TABLE "SubmissionFile" ALTER COLUMN "sha256" SET DEFAULT '';