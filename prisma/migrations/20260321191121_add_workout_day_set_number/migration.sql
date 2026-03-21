/*
  Warnings:

  - You are about to drop the column `sets` on the `exercise_logs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "exercise_logs" DROP COLUMN "sets",
ADD COLUMN     "set_number" INTEGER;

-- AlterTable
ALTER TABLE "workout_logs" ADD COLUMN     "day_title" TEXT,
ADD COLUMN     "workout_day" INTEGER;
