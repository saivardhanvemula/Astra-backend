import prisma from '../config/db';

export const transformationService = {
  async getAllTransformations() {
    return prisma.transformation.findMany({
      orderBy: { member_name: 'asc' },
    });
  },
};
