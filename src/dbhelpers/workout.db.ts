import prisma from "../config/db";

export async function getAllWorkoutPlans() {
  return prisma.workoutPlan.findMany({
    include: {
      days: {
        include: {
          exercises: {
            include: { exercise: true },
          },
        },
        orderBy: { day_number: "asc" },
      },
    },
    orderBy: { created_at: "desc" },
  });
}

export async function getAllExercises() {
  return prisma.exercise.findMany({ orderBy: { muscle_group: "asc" } });
}

export async function createWorkoutPlan(data: {
  name: string;
  created_by?: string;
  days: {
    day_number: number;
    title?: string;
    exercises: { exercise_id: string; sets?: number; reps?: string }[];
  }[];
}) {
  return prisma.workoutPlan.create({
    data: {
      name: data.name,
      created_by: data.created_by ?? null,
      days: {
        create: data.days.map((d) => ({
          day_number: d.day_number,
          title: d.title ?? null,
          exercises: {
            create: d.exercises.map((e) => ({
              exercise_id: e.exercise_id,
              sets: e.sets ?? null,
              reps: e.reps ?? null,
            })),
          },
        })),
      },
    },
    include: {
      days: {
        include: { exercises: true },
        orderBy: { day_number: "asc" },
      },
    },
  });
}

export async function assignWorkoutPlan(member_id: string, plan_id: string) {
  // Remove any existing assignment for this member
  await prisma.memberWorkoutPlan.deleteMany({ where: { member_id } });

  return prisma.memberWorkoutPlan.create({
    data: { member_id, plan_id, current_day: 1 },
  });
}

export async function getMemberWorkout(member_id: string) {
  const assignment = await prisma.memberWorkoutPlan.findFirst({
    where: { member_id },
    include: {
      plan: {
        include: {
          days: {
            include: {
              exercises: {
                include: { exercise: true },
              },
            },
            orderBy: { day_number: "asc" },
          },
        },
      },
    },
  });

  return assignment;
}

export async function getTotalDays(plan_id: string) {
  return prisma.workoutDay.count({ where: { plan_id } });
}

export async function updateCurrentDay(member_id: string, new_day: number) {
  return prisma.memberWorkoutPlan.updateMany({
    where: { member_id },
    data: { current_day: new_day },
  });
}
