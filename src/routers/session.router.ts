import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireAdmin, requireMember } from "../middlewares/role.middleware";
import {
  generateCheckinQR,
  checkIn,
  checkOut,
  getTodaySession,
  getSessions,
} from "../controllers/session.controller";

const router = Router();

// GET /api/sessions/qr/checkin — admin generates the QR token
router.get("/qr/checkin", authMiddleware, requireAdmin, generateCheckinQR);

// POST /api/sessions/checkin — member checks in using QR token
router.post("/checkin", authMiddleware, requireMember, checkIn);

// POST /api/sessions/checkout — member checks out
router.post("/checkout", authMiddleware, requireMember, checkOut);

// GET /api/sessions/today — member views their own today's session
router.get("/today", authMiddleware, requireMember, getTodaySession);

// GET /api/sessions — admin views all sessions
router.get("/", authMiddleware, requireAdmin, getSessions);

export default router;
