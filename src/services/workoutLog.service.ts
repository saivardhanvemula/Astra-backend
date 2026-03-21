import { getMemberByEmail } from "../dbhelpers/member.db";
import {
  createWorkoutLog,
  addExerciseLogs,
  findOrCreateExercise,
  getWorkoutLogs,
  getExerciseProgress,
  findSession,
  findWorkoutLogBySession,
} from "../dbhelpers/workoutLog.db";
import { AppError } from "../middlewares/errorMiddleware";

async function resolveMemberId(email: string): Promise<string> {
  const member = await getMemberByEmail(email);
  if (!member) throw new AppError("Member not found", 404);
  return (member as any).id;
}

export interface SetInput {
  set_number?: number;
  weight?: number;
  reps: number | string;
}

export interface ExerciseInput {
  exercise_name: string;
  muscle_group?: string;
  sets: SetInput[];
}

export interface WorkoutLogInput {
  session_id?: string;
  workout_day?: number;
  day_title?: string;
  exercises: ExerciseInput[];
}

export async function createLog(email: string, body: WorkoutLogInput) {
  const { session_id, workout_day, day_title, exercises } = body;

  if (!Array.isArray(exercises) || exercises.length === 0) {
    throw new AppError("Invalid data: exercises array is required", 400);
  }

  const member_id = await resolveMemberId(email);

  if (session_id) {
    const session = await findSession(session_id, member_id);
    if (!session) throw new AppError("Session not found", 404);

    const existing = await findWorkoutLogBySession(session_id);
    if (existing) throw new AppError("Workout log already exists for this session", 409);
  }

  const workoutLog = await createWorkoutLog(member_id, session_id, workout_day, day_title);

  const exerciseLogs: { exercise_id: string; set_number?: number; reps?: string; weight?: number }[] = [];

  for (const ex of exercises) {
    if (!ex.exercise_name) throw new AppError("Each exercise must have an exercise_name", 400);
    if (!Array.isArray(ex.sets) || ex.sets.length === 0) {
      throw new AppError(`Exercise "${ex.exercise_name}" must have at least one set`, 400);
    }

    const exercise = await findOrCreateExercise(ex.exercise_name, ex.muscle_group);

    for (const set of ex.sets) {
      exerciseLogs.push({
        exercise_id: exercise.id,
        set_number: set.set_number,
        reps: set.reps !== undefined ? String(set.reps) : undefined,
        weight: set.weight,
      });
    }
  }

  await addExerciseLogs(workoutLog.id, exerciseLogs);

  return workoutLog;
}

export async function getLogs(email: string) {
  const member_id = await resolveMemberId(email);
  const logs = await getWorkoutLogs(member_id);

  return logs.map((log: any) => ({
    id: log.id,
    workout_day: log.workout_day,
    day_title: log.day_title,
    date: log.session?.check_in_time?.toISOString().slice(0, 10) ?? log.created_at.toISOString().slice(0, 10),
    exercises: log.exercise_logs.map((el: any) => ({
      name: el.exercise?.name,
      muscle_group: el.exercise?.muscle_group,
      set_number: el.set_number,
      reps: el.reps,
      weight: el.weight !== null ? Number(el.weight) : null,
    })),
  }));
}

export async function getExerciseHistory(email: string, exercise_id: string) {
  const member_id = await resolveMemberId(email);
  const rows = await getExerciseProgress(member_id, exercise_id);

  return rows.map((r: any) => ({
    date: r.created_at.toISOString().slice(0, 10),
    set_number: r.set_number,
    reps: r.reps,
    weight: r.weight !== null ? Number(r.weight) : null,
  }));
}
