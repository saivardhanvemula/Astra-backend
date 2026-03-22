import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireMember } from "../middlewares/role.middleware";
import { getDashboard } from "../controllers/dashboard.controller";

const router = Router();

router.get("/dashboard", authMiddleware, requireMember, getDashboard);

export default router;
