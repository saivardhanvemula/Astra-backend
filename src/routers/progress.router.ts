import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireMember } from "../middlewares/role.middleware";
import { addWeight, getWeightHistory, getProgressSummary, getStreak } from "../controllers/progress.controller";

const router = Router();

router.post("/weight",  authMiddleware, requireMember, addWeight);
router.get("/weight",   authMiddleware, requireMember, getWeightHistory);
router.get("/summary",  authMiddleware, requireMember, getProgressSummary);
router.get("/streak",   authMiddleware, requireMember, getStreak);

export default router;
