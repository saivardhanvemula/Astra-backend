import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

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

  // ─── Users ────────────────────────────────────────────────────────────────
  const [memberHash, adminHash] = await Promise.all([
    bcrypt.hash('member@123', 10),
    bcrypt.hash('admin@123', 10),
  ]);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'member@astragym.com' },
      update: {
        name: 'Demo Member',
        password: memberHash,
        role: 'member',
        age: 25,
        gender: 'female',
        height: 170.5,
        weight: 65.0,
        fitness_goal: 'General fitness',
        profile_picture: 'profiles/demo.jpg',
      },
      create: {
        id: '0768fbec-767f-43b1-95c3-65a2f614c710',
        name: 'Demo Member',
        email: 'member@astragym.com',
        password: memberHash,
        role: 'member',
        age: 25,
        gender: 'female',
        height: 170.5,
        weight: 65.0,
        fitness_goal: 'General fitness',
        profile_picture: 'profiles/demo.jpg',
        created_at: new Date('2026-03-19T09:53:27.748Z'),
      },
    }),
    prisma.user.upsert({
      where: { email: 'admin@astragym.com' },
      update: {},
      create: {
        name: 'Admin',
        email: 'admin@astragym.com',
        password: adminHash,
        role: 'admin',
      },
    }),
  ]);

  console.log(`\n✅  Seeded ${users.length} users:`);
  users.forEach((u) => console.log(`    - ${u.name} (${u.role}) — ${u.email}`));

  // ─── Use existing plan for memberships (use Monthly) ───────────────────────
  const membershipPlanName = 'Monthly';
  let membershipPlan = await prisma.plan.findFirst({ where: { name: membershipPlanName } });
  if (!membershipPlan) {
    // fallback: create a monthly plan if it somehow doesn't exist
    membershipPlan = await prisma.plan.create({
      data: {
        name: membershipPlanName,
        price: 999,
        duration: '1 month',
        duration_days: 30,
        features: ['Full gym access', 'Locker room access'],
      },
    });
  }

  console.log(`\n✅  Ensured membership plan: ${membershipPlan.name} — id: ${membershipPlan.id}`);

  // ─── Members and Memberships ───────────────────────────────────────────────
  const member = await prisma.member.upsert({
    where: { email: 'member@astragym.com' },
    update: {
      name: 'Demo Member',
      phone: '9999999999',
      gender: 'female',
    },
    create: {
      name: 'Demo Member',
      email: 'member@astragym.com',
      phone: '9999999999',
      date_of_birth: new Date('1998-01-01'),
      gender: 'female',
    },
  });

  // Create a membership for the seeded member if none exists
  const existingMembership = await prisma.membership.findFirst({ where: { member_id: member.id, plan_id: membershipPlan.id } });
  if (!existingMembership) {
    const start = new Date();
    const end = new Date(start);
    end.setDate(end.getDate() + (membershipPlan.duration_days ?? 30));

    const membership = await prisma.membership.create({
      data: {
        member_id: member.id,
        plan_id: membershipPlan.id,
        start_date: start,
        end_date: end,
        status: 'active',
      },
    });

    console.log(`\n✅  Created membership for ${member.name} — membership id: ${membership.id}`);
  } else {
    console.log(`\nℹ️  Membership already exists for ${member.name} — id: ${existingMembership.id}`);
  }

  console.log('\n🎉  Database seeded successfully!\n');
}

main()
  .catch((err) => {
    console.error('❌  Seed failed:', err);
  })
  .finally(() => prisma.$disconnect());
