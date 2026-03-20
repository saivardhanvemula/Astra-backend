import { Request, Response, NextFunction } from "express";
import * as adminService from "../services/admin.service";
import * as authService from "../services/auth.service";

// GET /api/admin/dashboard/summary
export async function getDashboardSummary(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminService.getDashboardSummary();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/dashboard/expiring
export async function getExpiringMembers(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminService.getExpiringMembers();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/dashboard/recent-members
export async function getRecentMembers(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminService.getRecentMembers();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/dashboard/weekly-checkins
export async function getWeeklyCheckins(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await adminService.getWeeklyCheckins();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/members/:id/reset-password
export async function resetMemberPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.adminResetPassword(req.params.id);
    res.json({ success: true, ...result });
  } catch (err: any) {
    if (err.message === "Member not found" || err.message === "No login account found for this member") {
      return res.status(404).json({ error: err.message });
    }
    if (err.message === "Member has no email, cannot reset password") {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
}
