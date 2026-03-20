import express from "express";
import { login, getProfile, changePassword } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.post("/change-password", authMiddleware, changePassword);

export default router;
