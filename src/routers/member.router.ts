import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/role.middleware";
import {
  createMember,
  getAllMembers,
  getMemberById,
  getMyMembership,
  joinGym,
  updateMember,
  deleteMember,
} from "../controllers/member.controller";

const router = Router();


router.post("/join", joinGym);

// GET /api/members/me   — logged-in member (self)
router.get("/me", authMiddleware, getMyMembership);

// GET /api/members      — admin only
router.get("/", authMiddleware, requireAdmin, getAllMembers);

// GET /api/members/:id  — admin only
router.get("/:id", authMiddleware, requireAdmin, getMemberById);

// POST /api/members     — admin only (create member + assign plan)
router.post("/", authMiddleware, requireAdmin, createMember);

// PUT /api/members/:id  — admin only
router.put("/:id", authMiddleware, requireAdmin, updateMember);

// DELETE /api/members/:id — admin only
router.delete("/:id", authMiddleware, requireAdmin, deleteMember);

export default router;
