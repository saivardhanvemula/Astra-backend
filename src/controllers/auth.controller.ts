import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import * as userDb from "../dbhelpers/user.db";

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await authService.validateUser(email, password);
    if (!result) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const response = await authService.generateLoginResponse(result);
    return res.json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const user = await userDb.getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

// POST /api/auth/change-password — logged-in user
export async function changePassword(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ error: "current_password and new_password are required" });
    }
    if (new_password.length < 6) {
      return res.status(400).json({ error: "new_password must be at least 6 characters" });
    }

    await authService.changePassword(userId, current_password, new_password);
    return res.json({ success: true, message: "Password changed successfully" });
  } catch (err: any) {
    if (err.message === "Current password is incorrect") {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
