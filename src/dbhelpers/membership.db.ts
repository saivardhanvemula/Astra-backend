import prisma from "../config/db";

export async function createMembership(data: {
  member_id: string;
  plan_id: string;
  start_date: Date;
  end_date: Date;
}) {
  return prisma.membership.create({ data });
}
