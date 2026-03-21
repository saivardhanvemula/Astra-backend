import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireMember } from "../middlewares/role.middleware";
import {
  createWorkoutLog,
  getWorkoutLogs,
  getExerciseProgress,
} from "../controllers/workoutLog.controller";

const router = Router();

router.post("/",                   authMiddleware, requireMember, createWorkoutLog);
router.get("/",                    authMiddleware, requireMember, getWorkoutLogs);
router.get("/exercise/:exerciseId", authMiddleware, requireMember, getExerciseProgress);

export default router;
