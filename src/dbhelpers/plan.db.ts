import prisma from "../config/db";

export async function getAllPlans() {
  return prisma.plan.findMany({ orderBy: { price: "asc" } });
}

export async function getPlanById(id: string) {
  return prisma.plan.findUnique({ where: { id } });
}

export async function createPlan(data: {
  name: string;
  price: number;
  duration: string;
  duration_days?: number;
  features?: string[];
}) {
  return prisma.plan.create({ data });
}

export default null as never;
