import * as userDb from "../dbhelpers/user.db";
import * as memberDb from "../dbhelpers/member.db";
import { comparePassword, hashPassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

export async function validateUser(email: string, password: string) {
  const user = await userDb.getUserByEmail(email);
  if (!user) return null;

  const ok = await comparePassword(password, user.password);
  if (!ok) return null;

  return user;
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  const user = await userDb.getUserByEmail(
    (await userDb.getUserById(userId) as any)?.email
  );
  if (!user) throw new Error("User not found");

  const valid = await comparePassword(currentPassword, user.password);
  if (!valid) throw new Error("Current password is incorrect");

  const hashed = await hashPassword(newPassword);
  await userDb.updateUserPassword(userId, hashed);
}

export async function adminResetPassword(memberId: string) {
  const member = await memberDb.getMemberById(memberId);
  if (!member) throw new Error("Member not found");
  if (!(member as any).email) throw new Error("Member has no email, cannot reset password");

  const user = await userDb.getUserByEmail((member as any).email);
  if (!user) throw new Error("No login account found for this member");

  const defaultPassword = (member as any).phone ?? "Astra@1234";
  const hashed = await hashPassword(defaultPassword);
  await userDb.updateUserPassword(user.id, hashed);

  return { default_password: defaultPassword };
}

export async function generateLoginResponse(user: any) {
  const payload = { id: user.id, email: user.email, role: user.role };
  const token = generateToken(payload);

  // Attach member_id if this user has a linked member record
  let member_id: string | null = null;
  if (user.email) {
    const member = await memberDb.getMemberByEmail(user.email);
    member_id = (member as any)?.id ?? null;
  }

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      member_id,
    },
  };
}
