import { AppError } from "../middlewares/errorMiddleware";
import * as memberDb from "../dbhelpers/member.db";
import * as membershipDb from "../dbhelpers/membership.db";
import * as planDb from "../dbhelpers/plan.db";

export interface CreateMemberInput {
  name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  plan_id: string;
  start_date: string;
  created_by?: string;
}

export async function createMember(input: CreateMemberInput) {
  const { plan_id, start_date, date_of_birth, ...memberData } = input;

  if (!memberData.name || !plan_id || !start_date) {
    throw new AppError("name, plan_id, and start_date are required", 400);
  }

  const plan = await planDb.getPlanById(plan_id);
  if (!plan) throw new AppError("Plan not found", 400);

  const member = await memberDb.createMember({
    ...memberData,
    date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
  });

  const start = new Date(start_date);
  const end = new Date(start);
  const planDays = (plan as any).duration_days ?? 30;
  end.setDate(end.getDate() + planDays);

  await membershipDb.createMembership({
    member_id: member.id,
    plan_id,
    start_date: start,
    end_date: end,
  });

  return getMemberById(member.id);
}

export async function getAllMembers() {
  const members = await memberDb.getAllMembers();
  return members.map(formatMember);
}

export async function getMemberById(id: string) {
  const member = await memberDb.getMemberById(id);
  if (!member) throw new AppError("Member not found", 404);
  return formatMember(member);
}

function formatMember(member: Awaited<ReturnType<typeof memberDb.getMemberById>> & object) {
  const m = member as any;
  const latest = m.memberships?.[0] ?? null;
  const now = new Date();

  let status: string = "no_plan";
  if (latest) {
    status = new Date(latest.end_date) < now ? "expired" : "active";
  }

  return {
    id: m.id,
    name: m.name,
    email: m.email,
    phone: m.phone,
    gender: m.gender,
    join_date: m.join_date,
    plan_name: latest?.plan?.name ?? null,
    start_date: latest?.start_date ?? null,
    end_date: latest?.end_date ?? null,
    status,
  };
}

// ─── GET /api/members/me ──────────────────────────────────────────────────
export async function getMyMembership(email: string) {
  const member = await memberDb.getMemberByEmail(email);
  if (!member) throw new AppError("No membership record found for this account", 404);

  const m = member as any;
  const latest = m.memberships?.[0] ?? null;
  const now = new Date();

  let status = "no_plan";
  let days_remaining: number | null = null;
  if (latest) {
    const end = new Date(latest.end_date);
    if (end < now) {
      status = "expired";
      days_remaining = 0;
    } else {
      status = "active";
      days_remaining = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }
  }

  return {
    id: m.id,
    name: m.name,
    email: m.email,
    phone: m.phone,
    gender: m.gender,
    join_date: m.join_date,
    plan_name: latest?.plan?.name ?? null,
    start_date: latest?.start_date ?? null,
    end_date: latest?.end_date ?? null,
    days_remaining,
    status,
  };
}

// ─── POST /api/members/join (public join form) ────────────────────────────
export interface JoinGymInput {
  name: string;
  phone?: string;
  email?: string;
  age?: number;
  gender?: string;
  fitness_goal?: string;
  selected_plan?: string;
}

export async function joinGym(input: JoinGymInput) {
  if (!input.name) throw new AppError("name is required", 400);
  const member = await memberDb.createMember({
    name: input.name,
    email: input.email,
    phone: input.phone,
    gender: input.gender,
  });
  return member;
}

// ─── PUT /api/members/:id ─────────────────────────────────────────────────
export interface UpdateMemberInput {
  name?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
}

export async function updateMember(id: string, input: UpdateMemberInput) {
  const existing = await memberDb.getMemberById(id);
  if (!existing) throw new AppError("Member not found", 404);

  const { date_of_birth, ...rest } = input;
  const updated = await memberDb.updateMember(id, {
    ...rest,
    date_of_birth: date_of_birth ? new Date(date_of_birth) : undefined,
  });
  return getMemberById(updated.id);
}

// ─── DELETE /api/members/:id ──────────────────────────────────────────────
export async function deleteMember(id: string) {
  const existing = await memberDb.getMemberById(id);
  if (!existing) throw new AppError("Member not found", 404);
  await memberDb.deleteMember(id);
}
