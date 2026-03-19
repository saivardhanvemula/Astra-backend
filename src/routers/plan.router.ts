import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/role.middleware";
import { getAllPlans, createPlan } from "../controllers/plan.controller";

const router = Router();

// GET /api/plans  — public
router.get("/", getAllPlans);

// POST /api/plans — admin only
router.post("/", authMiddleware, requireAdmin, createPlan);

export default router;
