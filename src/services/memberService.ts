import { z } from 'zod';
import prisma from '../db';

export const createMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(7, 'Phone number is too short').max(20, 'Phone number is too long'),
  email: z.string().email('Invalid email address'),
  age: z.number().int().min(12, 'Minimum age is 12').max(100, 'Age seems invalid'),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Gender must be male, female, or other' }),
  }),
  fitness_goal: z.string().min(3, 'Fitness goal is required'),
  plan_id: z.string().uuid('plan_id must be a valid UUID'),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;

export const memberService = {
  async createMember(data: CreateMemberInput) {
    const member = await prisma.member.create({
      data,
      include: { plan: true },
    });
    return member;
  },

  async getAllMembers() {
    return prisma.member.findMany({
      include: { plan: true },
      orderBy: { created_at: 'desc' },
    });
  },
};
