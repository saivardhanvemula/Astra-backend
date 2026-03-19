import * as userDb from "../dbhelpers/user.db";
import { comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

export async function validateUser(email: string, password: string) {
  const user = await userDb.getUserByEmail(email);
  if (!user) return null;

  const ok = await comparePassword(password, user.password);
  if (!ok) return null;

  return user;
}

export async function generateLoginResponse(user: any) {
  const payload = { id: user.id, email: user.email, role: user.role };
  const token = generateToken(payload);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
