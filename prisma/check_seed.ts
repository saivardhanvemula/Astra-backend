import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'member@astragym.com' } });
  const member = await prisma.member.findUnique({
    where: { email: 'member@astragym.com' },
    include: {
      memberships: { include: { plan: true } },
    },
  });

  console.log('\n=== USER ===');
  console.log(JSON.stringify(user, null, 2));
  console.log('\n=== MEMBER ===');
  console.log(JSON.stringify(member, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
