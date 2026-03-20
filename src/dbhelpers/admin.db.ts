import prisma from "../config/db";

export async function getDashboardSummary() {
  const [
    totalMembers,
    activeMembers,
    expiredMembers,
    todayCheckins,
    currentlyInGym,
  ] = await Promise.all([
    prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) FROM members
    `,
    prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) FROM memberships WHERE status = 'active'
    `,
    prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) FROM memberships WHERE status = 'expired'
    `,
    prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) FROM sessions WHERE DATE(check_in_time) = CURRENT_DATE
    `,
    prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) FROM sessions WHERE check_out_time IS NULL
    `,
  ]);

  return {
    total_members: Number(totalMembers[0].count),
    active_members: Number(activeMembers[0].count),
    expired_members: Number(expiredMembers[0].count),
    today_checkins: Number(todayCheckins[0].count),
    currently_in_gym: Number(currentlyInGym[0].count),
  };
}

export async function getExpiringMembers() {
  const rows = await prisma.$queryRaw<{ name: string; end_date: Date }[]>`
    SELECT m.name, ms.end_date
    FROM memberships ms
    JOIN members m ON m.id = ms.member_id
    WHERE ms.end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '3 days'
    ORDER BY ms.end_date ASC
  `;

  return rows.map((r) => ({
    name: r.name,
    end_date: r.end_date.toISOString().split("T")[0],
  }));
}

export async function getRecentMembers() {
  const rows = await prisma.$queryRaw<{ name: string; created_at: Date }[]>`
    SELECT name, created_at
    FROM members
    ORDER BY created_at DESC
    LIMIT 5
  `;

  return rows.map((r) => ({
    name: r.name,
    created_at: r.created_at,
  }));
}

export async function getWeeklyCheckins() {
  const rows = await prisma.$queryRaw<{ date: Date; count: bigint }[]>`
    SELECT DATE(check_in_time) AS date, COUNT(*) AS count
    FROM sessions
    WHERE check_in_time >= CURRENT_DATE - INTERVAL '7 days'
    GROUP BY date
    ORDER BY date
  `;

  return rows.map((r) => ({
    date: r.date.toISOString().split("T")[0],
    count: Number(r.count),
  }));
}
