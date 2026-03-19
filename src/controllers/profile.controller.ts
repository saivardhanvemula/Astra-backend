import { Request, Response, NextFunction } from "express";
import * as profileService from "../services/profile.service";
import * as profileDb from "../dbhelpers/profile.db";
import path from "path";
import fs from "fs";
import multer from "multer";

// ─── Multer setup ─────────────────────────────────────────────────────────────
const uploadDir = path.join(process.cwd(), "uploads", "profiles");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"));
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

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

// ─── POST /api/profile/upload ─────────────────────────────────────────────────
export async function uploadProfilePicture(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const url = `/uploads/profiles/${req.file.filename}`;
    await profileDb.updateUserProfile(userId, { profile_picture: url });
    res.json({ success: true, url });
  } catch (err) {
    next(err);
  }
}
