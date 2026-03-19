import prisma from "../config/db";

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      age: true,
      gender: true,
      height: true,
      weight: true,
      fitness_goal: true,
      profile_picture: true,
      created_at: true,
    },
  });
}

export async function updateUserProfile(
  id: string,
  data: {
    name?: string;
    age?: number;
    gender?: string;
    height?: number;
    weight?: number;
    fitness_goal?: string;
    profile_picture?: string;
  }
) {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      age: true,
      gender: true,
      height: true,
      weight: true,
      fitness_goal: true,
      profile_picture: true,
      created_at: true,
    },
  });
}
