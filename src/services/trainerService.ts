import prisma from '../db';

export const trainerService = {
  async getAllTrainers() {
    return prisma.trainer.findMany({
      orderBy: { name: 'asc' },
    });
  },
};
