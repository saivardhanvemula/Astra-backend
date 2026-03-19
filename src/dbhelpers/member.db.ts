import prisma from "../config/db";

export async function createMember(data: {
  name: string;
  email?: string | null;
  phone?: string | null;
  date_of_birth?: Date | null;
  gender?: string | null;
  created_by?: string | null;
}) {
  return prisma.member.create({ data });
}

export async function getAllMembers() {
  return prisma.member.findMany({
    include: {
      memberships: {
        include: { plan: true },
        orderBy: { created_at: "desc" },
        take: 1,
      },
    },
    orderBy: { created_at: "desc" },
  });
}

export async function getMemberById(id: string) {
  return prisma.member.findUnique({
    where: { id },
    include: {
      memberships: {
        include: { plan: true },
        orderBy: { created_at: "desc" },
      },
    },
  });
}

export async function getMemberByEmail(email: string) {
  return prisma.member.findUnique({
    where: { email },
    include: {
      memberships: {
        include: { plan: true },
        orderBy: { created_at: "desc" },
        take: 1,
      },
    },
  });
}
