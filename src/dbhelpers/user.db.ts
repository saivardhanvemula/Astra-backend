import prisma from "../config/db";

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}
