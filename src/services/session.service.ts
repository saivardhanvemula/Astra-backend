import { AppError } from "../middlewares/errorMiddleware";
import { verifyToken, generateQrToken } from "../utils/jwt";
import * as sessionDb from "../dbhelpers/session.db";
import * as memberDb from "../dbhelpers/member.db";

const AUTO_CLOSE_HOURS = 3;

export function generateCheckinQrToken() {
  return generateQrToken({ type: "checkin" });
}

export async function checkIn(token: string, userEmail: string) {
  // Validate QR token
  let payload: any;
  try {
    payload = verifyToken(token);
  } catch {
    throw new AppError("Invalid QR", 400);
  }

  if (payload?.type !== "checkin") {
    throw new AppError("Invalid QR", 400);
  }

  // Resolve member from logged-in user's email
  const member = await memberDb.getMemberByEmail(userEmail);
  if (!member) throw new AppError("Member not found", 404);

  // Check membership is active
  const now = new Date();
  const activeMembership = (member as any).memberships?.find(
    (m: any) => new Date(m.end_date) >= now && m.status === "active"
  );
  if (!activeMembership) throw new AppError("Membership inactive", 403);

  // Auto-close stale session if it exists and is older than 3 hours
  const existing = await sessionDb.getActiveSession(member.id);
  if (existing) {
    const sessionAge =
      (now.getTime() - new Date(existing.check_in_time).getTime()) / 3600000;
    if (sessionAge >= AUTO_CLOSE_HOURS) {
      await sessionDb.closeSession(existing.id);
    } else {
      throw new AppError("Already checked in", 409);
    }
  }

  const session = await sessionDb.createSession(member.id);
  return session;
}

export async function checkOut(userEmail: string) {
  const member = await memberDb.getMemberByEmail(userEmail);
  if (!member) throw new AppError("Member not found", 404);

  const activeSession = await sessionDb.getActiveSession(member.id);
  if (!activeSession) throw new AppError("No active session", 404);

  const closed = await sessionDb.closeSession(activeSession.id);
  return closed;
}

export async function getTodaySession(userEmail: string) {
  const member = await memberDb.getMemberByEmail(userEmail);
  if (!member) throw new AppError("Member not found", 404);

  const session = await sessionDb.getTodaySession(member.id);
  return {
    checkin_time: session?.check_in_time ?? null,
    checkout_time: session?.check_out_time ?? null,
    duration_minutes: session?.duration_minutes ?? null,
  };
}

export async function getSessions() {
  const sessions = await sessionDb.getSessions();
  return sessions.map((s: any) => ({
    id: s.id,
    member_name: s.member?.name ?? null,
    check_in_time: s.check_in_time,
    check_out_time: s.check_out_time ?? null,
    duration: s.duration_minutes !== null ? `${s.duration_minutes} min` : null,
  }));
}
