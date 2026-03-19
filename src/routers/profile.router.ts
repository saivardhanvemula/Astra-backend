import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  upload,
} from "../controllers/profile.controller";

const router = Router();

// All profile routes require authentication
router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);
router.post("/upload", authMiddleware, upload.single("picture"), uploadProfilePicture);

export default router;
