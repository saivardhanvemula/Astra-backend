import { addWeightLog, findTodayLog, getWeightLogs, getWeightSummary, getCheckinDates } from "../dbhelpers/progress.db";
import { getMemberByEmail } from "../dbhelpers/member.db";
import { AppError } from "../middlewares/errorMiddleware";

async function resolveMemberId(email: string): Promise<string> {
  const member = await getMemberByEmail(email);
  if (!member) throw new AppError("Member not found", 404);
  return (member as any).id;
}

export async function addWeight(email: string, weight: number) {
  const member_id = await resolveMemberId(email);
  if (typeof weight !== "number" || isNaN(weight) || weight <= 0) {
    const err: any = new Error("Invalid weight");
    err.code = "INVALID_WEIGHT";
    throw err;
  }

  // one-per-day guard
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  const existing = await findTodayLog(member_id, start, end);
  if (existing) {
    const err: any = new Error("Weight already logged today");
    err.code = "ALREADY_LOGGED";
    throw err;
  }

  return addWeightLog(member_id, weight, new Date());
}

export async function getHistory(email: string) {
  const member_id = await resolveMemberId(email);
  return getWeightLogs(member_id);
}

export async function getSummary(email: string) {
  const member_id = await resolveMemberId(email);
  return getWeightSummary(member_id);
}

export async function getStreak(email: string) {
  const member_id = await resolveMemberId(email);
  const dates = await getCheckinDates(member_id);

  if (dates.length === 0) {
    return { current_streak: 0, last_checkin_date: null };
  }

  // Normalise a Date to a plain YYYY-MM-DD string for comparison
  const toDateStr = (d: Date) => new Date(d).toISOString().slice(0, 10);

  const today = toDateStr(new Date());
  const yesterday = toDateStr(new Date(Date.now() - 86_400_000));

  let streak = 0;
  let expected = today;

  for (const d of dates) {
    const dateStr = toDateStr(d);
    if (dateStr === expected) {
      streak++;
      // next expected day is one day earlier
      const prev = new Date(expected);
      prev.setDate(prev.getDate() - 1);
      expected = toDateStr(prev);
    } else if (streak === 0 && dateStr === yesterday) {
      // member hasn't checked in today yet — streak still counts from yesterday
      streak++;
      const prev = new Date(dateStr);
      prev.setDate(prev.getDate() - 1);
      expected = toDateStr(prev);
    } else {
      break;
    }
  }

  return {
    current_streak: streak,
    last_checkin_date: toDateStr(dates[0]),
  };
}
