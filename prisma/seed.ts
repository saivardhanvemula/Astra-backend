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

  console.log('\n✅  Created membership for ' + member.name + ' — membership id already logged above');
  }

  // ─── Exercises ────────────────────────────────────────────────────────────
  const exerciseData = [
    // Chest
    { name: 'Bench Press',              muscle_group: 'Chest' },
    { name: 'Incline Dumbbell Press',   muscle_group: 'Chest' },
    { name: 'Cable Fly',                muscle_group: 'Chest' },
    { name: 'Decline Bench Press',      muscle_group: 'Chest' },
    { name: 'Dumbbell Pullover',        muscle_group: 'Chest' },
    // Back
    { name: 'Pull-Up',                  muscle_group: 'Back' },
    { name: 'Bent Over Row',            muscle_group: 'Back' },
    { name: 'Lat Pulldown',             muscle_group: 'Back' },
    { name: 'Seated Cable Row',         muscle_group: 'Back' },
    { name: 'Face Pull',                muscle_group: 'Back' },
    { name: 'Deadlift',                 muscle_group: 'Back' },
    // Legs
    { name: 'Squat',                    muscle_group: 'Legs' },
    { name: 'Leg Press',                muscle_group: 'Legs' },
    { name: 'Romanian Deadlift',        muscle_group: 'Legs' },
    { name: 'Leg Curl',                 muscle_group: 'Legs' },
    { name: 'Leg Extension',            muscle_group: 'Legs' },
    { name: 'Calf Raise',               muscle_group: 'Legs' },
    { name: 'Bulgarian Split Squat',    muscle_group: 'Legs' },
    // Shoulders
    { name: 'Overhead Press',           muscle_group: 'Shoulders' },
    { name: 'Lateral Raise',            muscle_group: 'Shoulders' },
    { name: 'Front Raise',              muscle_group: 'Shoulders' },
    { name: 'Rear Delt Fly',            muscle_group: 'Shoulders' },
    { name: 'Arnold Press',             muscle_group: 'Shoulders' },
    // Arms
    { name: 'Barbell Curl',             muscle_group: 'Biceps' },
    { name: 'Hammer Curl',              muscle_group: 'Biceps' },
    { name: 'Incline Dumbbell Curl',    muscle_group: 'Biceps' },
    { name: 'Tricep Pushdown',          muscle_group: 'Triceps' },
    { name: 'Skull Crusher',            muscle_group: 'Triceps' },
    { name: 'Overhead Tricep Extension',muscle_group: 'Triceps' },
    // Core
    { name: 'Plank',                    muscle_group: 'Core' },
    { name: 'Crunch',                   muscle_group: 'Core' },
    { name: 'Leg Raise',                muscle_group: 'Core' },
    { name: 'Russian Twist',            muscle_group: 'Core' },
    { name: 'Cable Crunch',             muscle_group: 'Core' },
  ];

  const exercises: Record<string, string> = {};
  for (const ex of exerciseData) {
    const existing = await prisma.exercise.findFirst({ where: { name: ex.name } });
    const record = existing ?? await prisma.exercise.create({ data: ex });
    exercises[ex.name] = record.id;
  }

  console.log(`\n✅  Seeded ${Object.keys(exercises).length} exercises`);

  // ─── Workout Plan (5-day PPL split) ───────────────────────────────────────
  const existingPlan = await prisma.workoutPlan.findFirst({ where: { name: 'Beginner 5-Day Split' } });

  let workoutPlan = existingPlan;
  if (!workoutPlan) {
    workoutPlan = await prisma.workoutPlan.create({
      data: {
        name: 'Beginner 5-Day Split',
        created_by: null,
        days: {
          create: [
            {
              day_number: 1,
              title: 'Chest',
              exercises: {
                create: [
                  { exercise_id: exercises['Bench Press'],          sets: 4, reps: '10' },
                  { exercise_id: exercises['Incline Dumbbell Press'],sets: 3, reps: '12' },
                  { exercise_id: exercises['Cable Fly'],             sets: 3, reps: '15' },
                ],
              },
            },
            {
              day_number: 2,
              title: 'Back',
              exercises: {
                create: [
                  { exercise_id: exercises['Pull-Up'],         sets: 4, reps: '8'  },
                  { exercise_id: exercises['Bent Over Row'],   sets: 4, reps: '10' },
                  { exercise_id: exercises['Lat Pulldown'],    sets: 3, reps: '12' },
                ],
              },
            },
            {
              day_number: 3,
              title: 'Legs',
              exercises: {
                create: [
                  { exercise_id: exercises['Squat'],             sets: 4, reps: '10' },
                  { exercise_id: exercises['Leg Press'],         sets: 3, reps: '12' },
                  { exercise_id: exercises['Romanian Deadlift'], sets: 3, reps: '10' },
                ],
              },
            },
            {
              day_number: 4,
              title: 'Shoulders',
              exercises: {
                create: [
                  { exercise_id: exercises['Overhead Press'], sets: 4, reps: '10' },
                  { exercise_id: exercises['Lateral Raise'],  sets: 3, reps: '15' },
                  { exercise_id: exercises['Front Raise'],    sets: 3, reps: '15' },
                ],
              },
            },
            {
              day_number: 5,
              title: 'Arms & Core',
              exercises: {
                create: [
                  { exercise_id: exercises['Barbell Curl'],    sets: 3, reps: '12' },
                  { exercise_id: exercises['Hammer Curl'],     sets: 3, reps: '12' },
                  { exercise_id: exercises['Tricep Pushdown'], sets: 3, reps: '12' },
                  { exercise_id: exercises['Skull Crusher'],   sets: 3, reps: '10' },
                  { exercise_id: exercises['Plank'],           sets: 3, reps: '60s' },
                  { exercise_id: exercises['Leg Raise'],       sets: 3, reps: '15' },
                ],
              },
            },
          ],
        },
      },
    });
    console.log(`\n✅  Created workout plan: ${workoutPlan.name} — id: ${workoutPlan.id}`);
  } else {
    console.log(`\nℹ️  Workout plan already exists: ${workoutPlan.name} — id: ${workoutPlan.id}`);
  }

  // ─── Workout Plan (6-day PPL split) ───────────────────────────────────────
  const existingPPL = await prisma.workoutPlan.findFirst({ where: { name: 'Advanced 6-Day PPL Split' } });

  if (!existingPPL) {
    const pplPlan = await prisma.workoutPlan.create({
      data: {
        name: 'Advanced 6-Day PPL Split',
        created_by: null,
        days: {
          create: [
            {
              day_number: 1,
              title: 'Push A (Chest & Shoulders)',
              exercises: {
                create: [
                  { exercise_id: exercises['Bench Press'],            sets: 4, reps: '8'  },
                  { exercise_id: exercises['Overhead Press'],         sets: 4, reps: '8'  },
                  { exercise_id: exercises['Incline Dumbbell Press'], sets: 3, reps: '10' },
                  { exercise_id: exercises['Lateral Raise'],          sets: 3, reps: '15' },
                  { exercise_id: exercises['Tricep Pushdown'],        sets: 3, reps: '12' },
                  { exercise_id: exercises['Skull Crusher'],          sets: 3, reps: '10' },
                ],
              },
            },
            {
              day_number: 2,
              title: 'Pull A (Back & Biceps)',
              exercises: {
                create: [
                  { exercise_id: exercises['Deadlift'],           sets: 4, reps: '6'  },
                  { exercise_id: exercises['Pull-Up'],            sets: 4, reps: '8'  },
                  { exercise_id: exercises['Bent Over Row'],      sets: 4, reps: '10' },
                  { exercise_id: exercises['Face Pull'],          sets: 3, reps: '15' },
                  { exercise_id: exercises['Barbell Curl'],       sets: 3, reps: '12' },
                  { exercise_id: exercises['Hammer Curl'],        sets: 3, reps: '12' },
                ],
              },
            },
            {
              day_number: 3,
              title: 'Legs A (Quads Focus)',
              exercises: {
                create: [
                  { exercise_id: exercises['Squat'],                 sets: 4, reps: '8'  },
                  { exercise_id: exercises['Leg Press'],             sets: 4, reps: '12' },
                  { exercise_id: exercises['Leg Extension'],         sets: 3, reps: '15' },
                  { exercise_id: exercises['Romanian Deadlift'],     sets: 3, reps: '10' },
                  { exercise_id: exercises['Calf Raise'],            sets: 4, reps: '20' },
                ],
              },
            },
            {
              day_number: 4,
              title: 'Push B (Chest & Triceps)',
              exercises: {
                create: [
                  { exercise_id: exercises['Decline Bench Press'],          sets: 4, reps: '8'  },
                  { exercise_id: exercises['Arnold Press'],                  sets: 4, reps: '10' },
                  { exercise_id: exercises['Cable Fly'],                     sets: 3, reps: '15' },
                  { exercise_id: exercises['Front Raise'],                   sets: 3, reps: '15' },
                  { exercise_id: exercises['Overhead Tricep Extension'],     sets: 3, reps: '12' },
                  { exercise_id: exercises['Rear Delt Fly'],                 sets: 3, reps: '15' },
                ],
              },
            },
            {
              day_number: 5,
              title: 'Pull B (Back & Rear Delts)',
              exercises: {
                create: [
                  { exercise_id: exercises['Lat Pulldown'],          sets: 4, reps: '10' },
                  { exercise_id: exercises['Seated Cable Row'],      sets: 4, reps: '10' },
                  { exercise_id: exercises['Dumbbell Pullover'],     sets: 3, reps: '12' },
                  { exercise_id: exercises['Face Pull'],             sets: 3, reps: '15' },
                  { exercise_id: exercises['Incline Dumbbell Curl'], sets: 3, reps: '12' },
                  { exercise_id: exercises['Hammer Curl'],           sets: 3, reps: '12' },
                ],
              },
            },
            {
              day_number: 6,
              title: 'Legs B (Hamstrings & Core)',
              exercises: {
                create: [
                  { exercise_id: exercises['Bulgarian Split Squat'], sets: 4, reps: '10' },
                  { exercise_id: exercises['Leg Curl'],              sets: 4, reps: '12' },
                  { exercise_id: exercises['Romanian Deadlift'],     sets: 4, reps: '10' },
                  { exercise_id: exercises['Calf Raise'],            sets: 4, reps: '20' },
                  { exercise_id: exercises['Cable Crunch'],          sets: 3, reps: '15' },
                  { exercise_id: exercises['Russian Twist'],         sets: 3, reps: '20' },
                ],
              },
            },
          ],
        },
      },
    });
    console.log(`\n✅  Created workout plan: ${pplPlan.name} — id: ${pplPlan.id}`);
  } else {
    console.log(`\nℹ️  Workout plan already exists: ${existingPPL.name} — id: ${existingPPL.id}`);
  }

  // ─── Assign workout plan to demo member ───────────────────────────────────
  const existingAssignment = await prisma.memberWorkoutPlan.findFirst({ where: { member_id: member.id } });
  if (!existingAssignment) {
    await prisma.memberWorkoutPlan.create({
      data: { member_id: member.id, plan_id: workoutPlan.id, current_day: 1 },
    });
    console.log(`\n✅  Assigned "${workoutPlan.name}" to ${member.name}`);
  } else {
    console.log(`\nℹ️  Workout already assigned to ${member.name}`);
  }

  console.log('\n🎉  Database seeded successfully!\n');
}

main()
  .catch((err) => {
    console.error('❌  Seed failed:', err);
  })
  .finally(() => prisma.$disconnect());
