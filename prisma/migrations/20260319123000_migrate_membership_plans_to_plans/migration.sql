BEGIN;

-- Add duration_days column to plans if missing
ALTER TABLE IF EXISTS "plans" ADD COLUMN IF NOT EXISTS "duration_days" INTEGER;

-- Ensure features column exists (should exist already)
ALTER TABLE IF EXISTS "plans" ADD COLUMN IF NOT EXISTS "features" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Copy rows from membership_plans into plans if they don't already exist
INSERT INTO "plans" (id, name, price, duration, duration_days, features)
SELECT id, name, price, '', duration_days, ARRAY[]::text[]
FROM "membership_plans" mp
WHERE NOT EXISTS (SELECT 1 FROM "plans" p WHERE p.id = mp.id);

-- Replace foreign key on memberships to reference plans
ALTER TABLE IF EXISTS "memberships" DROP CONSTRAINT IF EXISTS "memberships_plan_id_fkey";
ALTER TABLE IF EXISTS "memberships" ADD CONSTRAINT "memberships_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop the old membership_plans table
DROP TABLE IF EXISTS "membership_plans";

COMMIT;
