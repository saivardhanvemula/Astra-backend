import prisma from "../config/db";

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  return prisma.user.create({ data });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, created_at: true },
  });
}

export async function updateUserPassword(id: string, hashedPassword: string) {
  return prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });
}
