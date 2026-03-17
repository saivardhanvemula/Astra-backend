import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱  Seeding database…\n');

  // ─── Plans ────────────────────────────────────────────────────────────────
  const plans = await Promise.all([
    prisma.plan.upsert({
      where: { name: 'Monthly' },
      update: {},
      create: {
        name: 'Monthly',
        price: 999,
        duration: '1 month',
        features: [
          'Full gym access',
          'Locker room access',
          'Free fitness assessment',
        ],
      },
    }),
    prisma.plan.upsert({
      where: { name: 'Quarterly' },
      update: {},
      create: {
        name: 'Quarterly',
        price: 2499,
        duration: '3 months',
        features: [
          'Full gym access',
          'Locker room access',
          'Free fitness assessment',
          '1 personal trainer session/month',
          'Diet consultation',
        ],
      },
    }),
    prisma.plan.upsert({
      where: { name: 'Yearly' },
      update: {},
      create: {
        name: 'Yearly',
        price: 7999,
        duration: '12 months',
        features: [
          'Full gym access',
          'Locker room access',
          'Free fitness assessment',
          '4 personal trainer sessions/month',
          'Diet consultation',
          'Unlimited group classes',
          'Priority booking',
        ],
      },
    }),
  ]);

  console.log(`✅  Seeded ${plans.length} plans:`);
  plans.forEach((p) => console.log(`    - ${p.name} (₹${p.price}) — id: ${p.id}`));

  console.log('\n🎉  Database seeded successfully!\n');
}

main()
  .catch((err) => {
    console.error('❌  Seed failed:', err);
  })
  .finally(() => prisma.$disconnect());
