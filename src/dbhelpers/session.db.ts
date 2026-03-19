import prisma from "../config/db";

export async function createSession(member_id: string) {
  return prisma.session.create({
    data: {
      member_id,
      check_in_time: new Date(),
    },
  });
}

export async function getActiveSession(member_id: string) {
  return prisma.session.findFirst({
    where: {
      member_id,
      check_out_time: null,
    },
  });
}

export async function closeSession(session_id: string) {
  const session = await prisma.session.findUnique({ where: { id: session_id } });
  if (!session) return null;

  const checkOutTime = new Date();
  const durationMinutes = Math.round(
    (checkOutTime.getTime() - session.check_in_time.getTime()) / 60000
  );

  return prisma.session.update({
    where: { id: session_id },
    data: {
      check_out_time: checkOutTime,
      duration_minutes: durationMinutes,
    },
  });
}

export async function getTodaySession(member_id: string) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return prisma.session.findFirst({
    where: {
      member_id,
      check_in_time: { gte: startOfDay, lte: endOfDay },
    },
    orderBy: { check_in_time: "desc" },
  });
}

export async function getSessions() {
  return prisma.session.findMany({
    include: {
      member: {
        select: { name: true },
      },
    },
    orderBy: { check_in_time: "desc" },
  });
}
