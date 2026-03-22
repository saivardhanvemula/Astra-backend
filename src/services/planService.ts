import prisma from '../config/db';

export const planService = {
  async getAllPlans() {
    return prisma.plan.findMany({
      orderBy: { price: 'asc' },
    });
  },
};
