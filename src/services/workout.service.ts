import { AppError } from "../middlewares/errorMiddleware";
import * as workoutDb from "../dbhelpers/workout.db";

export async function getAllWorkoutPlans() {
  return workoutDb.getAllWorkoutPlans();
}

export async function getAllExercises() {
  return workoutDb.getAllExercises();
}

export async function createWorkoutPlan(body: any, adminId: string) {
  const { name, days } = body;
  if (!name || !Array.isArray(days) || days.length === 0) {
    throw new AppError("name and at least one day are required", 400);
  }
  return workoutDb.createWorkoutPlan({ name, created_by: adminId, days });
}

export async function assignWorkoutPlan(member_id: string, plan_id: string) {
  if (!member_id || !plan_id) {
    throw new AppError("member_id and plan_id are required", 400);
  }
  return workoutDb.assignWorkoutPlan(member_id, plan_id);
}

export async function getMemberWorkout(member_id: string) {
  const assignment = await workoutDb.getMemberWorkout(member_id);
  if (!assignment) throw new AppError("No workout assigned", 404);

  const { current_day, plan } = assignment;
  const day = plan.days.find((d) => d.day_number === current_day);

  if (!day) throw new AppError("Workout day not found", 404);

  return {
    day: current_day,
    title: day.title,
    exercises: day.exercises.map((e: any) => ({
      name: e.exercise.name,
      muscle_group: e.exercise.muscle_group,
      sets: e.sets,
      reps: e.reps,
    })),
  };
}

export async function completeWorkout(member_id: string) {
  const assignment = await workoutDb.getMemberWorkout(member_id);
  if (!assignment) throw new AppError("No workout assigned", 404);

  const totalDays = await workoutDb.getTotalDays(assignment.plan_id);
  const next = assignment.current_day >= totalDays ? 1 : assignment.current_day + 1;

  await workoutDb.updateCurrentDay(member_id, next);
  return { next_day: next };
}
