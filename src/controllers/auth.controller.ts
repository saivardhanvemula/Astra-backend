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
