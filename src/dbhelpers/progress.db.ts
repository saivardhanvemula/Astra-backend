import prisma from "../config/db";

export async function addWeightLog(member_id: string, weight: number, recorded_at: Date) {
  return prisma.weightLog.create({
    data: { member_id, weight, recorded_at },
  });
}

export async function getWeightLogs(member_id: string) {
  return prisma.weightLog.findMany({
    where: { member_id },
    orderBy: { recorded_at: "desc" },
    select: { recorded_at: true, weight: true },
  });
}

export async function getWeightSummary(member_id: string) {
  const latest = await prisma.weightLog.findFirst({
    where: { member_id },
    orderBy: { recorded_at: "desc" },
    select: { weight: true },
  });

  const first = await prisma.weightLog.findFirst({
    where: { member_id },
    orderBy: { recorded_at: "asc" },
    select: { weight: true },
  });

  const total = await prisma.weightLog.count({ where: { member_id } });

  return {
    current_weight:  latest ? Number(latest.weight) : null,
    starting_weight: first  ? Number(first.weight)  : null,
    weight_change:
      latest && first ? Number(latest.weight) - Number(first.weight) : null,
    total_logs: total,
  };
}

export async function findTodayLog(member_id: string, start: Date, end: Date) {
  return prisma.weightLog.findFirst({
    where: { member_id, recorded_at: { gte: start, lt: end } },
  });
}

// Returns distinct check-in dates sorted newest → oldest
export async function getCheckinDates(member_id: string): Promise<Date[]> {
  const rows = await prisma.$queryRaw<{ date: Date }[]>`
    SELECT DISTINCT DATE(check_in_time) AS date
    FROM sessions
    WHERE member_id = ${member_id}::uuid
    ORDER BY date DESC
  `;
  return rows.map((r) => r.date);
}
