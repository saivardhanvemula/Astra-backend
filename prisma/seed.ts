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

  // ─── Trainers ─────────────────────────────────────────────────────────────
  const trainerData = [
    {
      name: 'Arjun Mehta',
      image: 'https://example.com/trainers/arjun.jpg',
      specialization: 'Strength & Conditioning',
      experience: 7,
      bio: 'Certified strength coach with 7 years of experience helping clients build lean muscle and improve athletic performance.',
    },
    {
      name: 'Priya Sharma',
      image: 'https://example.com/trainers/priya.jpg',
      specialization: 'Yoga & Flexibility',
      experience: 5,
      bio: 'Internationally certified yoga instructor specialising in functional flexibility and stress-relief programmes.',
    },
    {
      name: 'Vikram Nair',
      image: 'https://example.com/trainers/vikram.jpg',
      specialization: 'Weight Loss & Cardio',
      experience: 9,
      bio: 'Former marathon runner turned fitness coach. Expert at designing high-intensity cardio and fat-loss programmes.',
    },
    {
      name: 'Sneha Kapoor',
      image: 'https://example.com/trainers/sneha.jpg',
      specialization: 'Nutrition & Wellness',
      experience: 6,
      bio: 'Certified nutritionist and wellness coach focused on sustainable lifestyle changes and holistic health.',
    },
  ];

  // Trainers – create only if the table has no rows (idempotent)
  const existingTrainerCount = await prisma.trainer.count();
  let trainers: Awaited<ReturnType<typeof prisma.trainer.findMany>> = [];
  if (existingTrainerCount === 0) {
    await prisma.trainer.createMany({ data: trainerData });
    trainers = await prisma.trainer.findMany();
  } else {
    trainers = await prisma.trainer.findMany();
    console.log('   (trainers already seeded, skipping)');
  }

  console.log(`\n✅  ${trainers.length} trainers in DB:`);
  trainers.forEach((t) => console.log(`    - ${t.name} (${t.specialization})`));

  // ─── Transformations ──────────────────────────────────────────────────────
  const transformationData = [
    {
      member_name: 'Rohan Verma',
      before_image: 'https://example.com/transformations/rohan_before.jpg',
      after_image: 'https://example.com/transformations/rohan_after.jpg',
      description: 'Lost 18 kg in 6 months through consistent training and diet.',
    },
    {
      member_name: 'Ananya Singh',
      before_image: 'https://example.com/transformations/ananya_before.jpg',
      after_image: 'https://example.com/transformations/ananya_after.jpg',
      description: 'Gained 8 kg of lean muscle in 5 months with a structured strength programme.',
    },
    {
      member_name: 'Karan Patel',
      before_image: 'https://example.com/transformations/karan_before.jpg',
      after_image: 'https://example.com/transformations/karan_after.jpg',
      description: 'Transformed from sedentary lifestyle to running 10k in under 55 minutes.',
    },
  ];

  const existingTransformationCount = await prisma.transformation.count();
  let transformations: Awaited<ReturnType<typeof prisma.transformation.findMany>> = [];
  if (existingTransformationCount === 0) {
    await prisma.transformation.createMany({ data: transformationData });
    transformations = await prisma.transformation.findMany();
  } else {
    transformations = await prisma.transformation.findMany();
    console.log('   (transformations already seeded, skipping)');
  }

  console.log(`\n✅  ${transformations.length} transformations in DB.`);
  console.log('\n🎉  Database seeded successfully!\n');
}

main()
  .catch((err) => {
    console.error('❌  Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
