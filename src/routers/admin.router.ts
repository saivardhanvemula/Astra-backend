import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/role.middleware";
import {
  getDashboardSummary,
  getExpiringMembers,
  getRecentMembers,
  getWeeklyCheckins,
  resetMemberPassword,
} from "../controllers/admin.controller";

const router = Router();

// All admin routes are protected
router.use(authMiddleware, requireAdmin);

// GET /api/admin/dashboard/summary
router.get("/dashboard/summary", getDashboardSummary);

// GET /api/admin/dashboard/expiring
router.get("/dashboard/expiring", getExpiringMembers);

// GET /api/admin/dashboard/recent-members
router.get("/dashboard/recent-members", getRecentMembers);

// GET /api/admin/dashboard/weekly-checkins
router.get("/dashboard/weekly-checkins", getWeeklyCheckins);

// POST /api/admin/members/:id/reset-password
router.post("/members/:id/reset-password", resetMemberPassword);

export default router;
