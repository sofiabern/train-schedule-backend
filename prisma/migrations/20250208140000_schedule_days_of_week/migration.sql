-- AlterTable: add daysOfWeek for recurring schedules (0=Sun, 1=Mon, ..., 6=Sat)
ALTER TABLE "schedules" ADD COLUMN IF NOT EXISTS "daysOfWeek" INTEGER[] DEFAULT ARRAY[1, 2, 3, 4, 5, 6, 0];

-- Backfill: existing rows get all days
UPDATE "schedules" SET "daysOfWeek" = ARRAY[0, 1, 2, 3, 4, 5, 6] WHERE "daysOfWeek" IS NULL;
