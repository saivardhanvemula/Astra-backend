import { Request, Response, NextFunction } from "express";
import * as profileService from "../services/profile.service";

// ─── GET /api/profile ─────────────────────────────────────────────────────────
export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    const profile = await profileService.getProfile(userId);
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

// ─── PUT /api/profile ─────────────────────────────────────────────────────────
export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    const { name, age, gender, height, weight, fitness_goal } = req.body;
    const updated = await profileService.updateProfile(userId, {
      name,
      age: age !== undefined ? Number(age) : undefined,
      gender,
      height: height !== undefined ? Number(height) : undefined,
      weight: weight !== undefined ? Number(weight) : undefined,
      fitness_goal,
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}


