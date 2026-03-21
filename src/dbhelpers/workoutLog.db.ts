import prisma from "../config/db";

export async function createWorkoutLog(
  member_id: string,
  session_id?: string,
  workout_day?: number,
  day_title?: string
) {
  return prisma.workoutLog.create({
    data: { member_id, session_id, workout_day, day_title },
  });
}

export async function findOrCreateExercise(name: string, muscle_group?: string) {
  let exercise = await prisma.exercise.findFirst({ where: { name } });
  if (!exercise) {
    exercise = await prisma.exercise.create({ data: { name, muscle_group } });
  }
  return exercise;
}

export async function addExerciseLogs(
  workout_log_id: string,
  exercises: { exercise_id: string; set_number?: number; reps?: string; weight?: number }[]
) {
  return prisma.exerciseLog.createMany({
    data: exercises.map((e) => ({ workout_log_id, ...e })),
  });
}

export async function getWorkoutLogs(member_id: string) {
  return prisma.workoutLog.findMany({
    where: { member_id },
    orderBy: { created_at: "desc" },
    include: {
      session: { select: { check_in_time: true } },
      exercise_logs: {
        include: { exercise: { select: { name: true, muscle_group: true } } },
        orderBy: [{ exercise_id: "asc" }, { set_number: "asc" }],
      },
    },
  });
}

export async function getExerciseProgress(member_id: string, exercise_id: string) {
  return prisma.exerciseLog.findMany({
    where: {
      exercise_id,
      workout_log: { member_id },
    },
    orderBy: { created_at: "asc" },
    select: {
      set_number: true,
      reps: true,
      weight: true,
      created_at: true,
    },
  });
}

export async function findSession(session_id: string, member_id: string) {
  return prisma.session.findFirst({ where: { id: session_id, member_id } });
}

export async function findWorkoutLogBySession(session_id: string) {
  return prisma.workoutLog.findUnique({ where: { session_id } });
}
