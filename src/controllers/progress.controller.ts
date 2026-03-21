import { Request, Response, NextFunction } from "express";
import * as progressService from "../services/progress.service";

// POST /api/progress/weight
export async function addWeight(req: Request, res: Response, next: NextFunction) {
  try {
    const email = (req as any).user?.email;
    if (!email) return res.status(401).json({ success: false, message: "Unauthorized" });
    const { weight } = req.body;
    const log = await progressService.addWeight(email, Number(weight));
    return res.status(201).json({ success: true, data: log });
  } catch (err: any) {
    if (err.code === "INVALID_WEIGHT")  return res.status(400).json({ success: false, message: "Invalid weight" });
    if (err.code === "ALREADY_LOGGED")  return res.status(400).json({ success: false, message: "Weight already logged today" });
    next(err);
  }
}

// GET /api/progress/weight
export async function getWeightHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const email = (req as any).user?.email;
    if (!email) return res.status(401).json({ success: false, message: "Unauthorized" });
    const raw = await progressService.getHistory(email);
    const data = raw.map((h: any) => ({
      date: h.recorded_at?.toISOString().slice(0, 10),
      weight: Number(h.weight),
    }));
    return res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// GET /api/progress/summary
export async function getProgressSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const email = (req as any).user?.email;
    if (!email) return res.status(401).json({ success: false, message: "Unauthorized" });
    const summary = await progressService.getSummary(email);
    return res.json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
}

// GET /api/progress/streak
export async function getStreak(req: Request, res: Response, next: NextFunction) {
  try {
    const email = (req as any).user?.email;
    if (!email) return res.status(401).json({ success: false, message: "Unauthorized" });
    const data = await progressService.getStreak(email);
    return res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
