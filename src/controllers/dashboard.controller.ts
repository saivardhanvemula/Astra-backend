import { Request, Response, NextFunction } from "express";
import { getMemberDashboard } from "../services/dashboard.service";

export async function getDashboard(req: Request, res: Response, next: NextFunction) {
  try {
    const email = (req as any).user?.email;
    if (!email) return res.status(401).json({ success: false, message: "Unauthorized" });

    const data = await getMemberDashboard(email);
    return res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
