import { getMemberByEmail } from "../dbhelpers/member.db";
import { getStreak, getHistory, getSummary } from "./progress.service";
import { getMemberWorkout } from "./workout.service";
import { countMemberSessions } from "../dbhelpers/session.db";
import { AppError } from "../middlewares/errorMiddleware";

export async function getMemberDashboard(email: string) {
  const member = await getMemberByEmail(email);
  if (!member) throw new AppError("Member not found", 404);
  const member_id = (member as any).id;

  // Run all data fetches in parallel; use allSettled so one failure doesn't break the rest
  const [streakResult, workoutResult, summaryResult, sessionCountResult, historyResult] =
    await Promise.allSettled([
      getStreak(email),
      getMemberWorkout(member_id),
      getSummary(email),
      countMemberSessions(member_id),
      getHistory(email),
    ]);

  const streakData =
    streakResult.status === "fulfilled" ? streakResult.value : { current_streak: 0 };

  const workoutData =
    workoutResult.status === "fulfilled" ? workoutResult.value : null;

  const summaryData =
    summaryResult.status === "fulfilled"
      ? summaryResult.value
      : { current_weight: null, weight_change: null };

  const sessionTotal =
    sessionCountResult.status === "fulfilled" ? sessionCountResult.value : 0;

  const rawHistory =
    historyResult.status === "fulfilled" ? (historyResult.value as any[]) : [];

  return {
    streak: (streakData as any).current_streak ?? 0,
    today_workout: workoutData
      ? {
          day: workoutData.day,
          title: workoutData.title,
          exercises: workoutData.exercises,
        }
      : null,
    progress: {
      current_weight: (summaryData as any).current_weight,
      weight_change: (summaryData as any).weight_change,
    },
    sessions: {
      total: sessionTotal,
    },
    weight_history: rawHistory.map((r: any) => ({
      date: new Date(r.recorded_at).toISOString().slice(0, 10),
      weight: Number(r.weight),
    })),
  };
}
