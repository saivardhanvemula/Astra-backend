import { Request, Response, NextFunction } from "express";
import * as workoutLogService from "../services/workoutLog.service";

// POST /api/workout-logs
export async function createWorkoutLog(req: Request, res: Response, next: NextFunction) {
  try {
    const email = (req as any).user?.email;
    if (!email) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { session_id, workout_day, day_title, exercises } = req.body;
    const log = await workoutLogService.createLog(email, { session_id, workout_day, day_title, exercises });
    return res.status(201).json({ success: true, data: log });
  } catch (err) {
    next(err);
  }
}

// GET /api/workout-logs
export async function getWorkoutLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const email = (req as any).user?.email;
    if (!email) return res.status(401).json({ success: false, message: "Unauthorized" });

    const data = await workoutLogService.getLogs(email);
    return res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// GET /api/workout-logs/exercise/:exerciseId
export async function getExerciseProgress(req: Request, res: Response, next: NextFunction) {
  try {
    const email = (req as any).user?.email;
    if (!email) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { exerciseId } = req.params;
    const data = await workoutLogService.getExerciseHistory(email, exerciseId);
    return res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
