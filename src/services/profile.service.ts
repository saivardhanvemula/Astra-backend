import { AppError } from "../middlewares/errorMiddleware";
import * as profileDb from "../dbhelpers/profile.db";

export async function getProfile(userId: string) {
  const user = await profileDb.getUserById(userId);
  if (!user) throw new AppError("User not found", 404);
  return user;
}

export async function updateProfile(
  userId: string,
  data: {
    name?: string;
    age?: number;
    gender?: string;
    height?: number;
    weight?: number;
    fitness_goal?: string;
    profile_picture?: string;
  }
) {
  const user = await profileDb.getUserById(userId);
  if (!user) throw new AppError("User not found", 404);
  return profileDb.updateUserProfile(userId, data);
}
