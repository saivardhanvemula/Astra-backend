import { z } from 'zod';
import prisma from '../db';

export const createMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  date_of_birth: z.string().optional(),
  plan_id: z.string().uuid('plan_id must be a valid UUID'),
  start_date: z.string(),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;

export const memberService = {
  async createMember(data: CreateMemberInput) {
    const { plan_id, start_date, date_of_birth, ...rest } = data;
    return prisma.member.create({
      data: {
        ...rest,
        date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
      },
    });
  },

  async getAllMembers() {
    return prisma.member.findMany({ orderBy: { created_at: 'desc' } });
  },
};
