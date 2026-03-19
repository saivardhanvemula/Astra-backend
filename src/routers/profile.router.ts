import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getProfile, updateProfile } from "../controllers/profile.controller";

const router = Router();

// All profile routes require authentication
router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);

export default router;
