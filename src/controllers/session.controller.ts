import { Request, Response, NextFunction } from "express";
import * as sessionService from "../services/session.service";

// GET /api/sessions/qr/checkin — admin only
export async function generateCheckinQR(req: Request, res: Response, next: NextFunction) {
  try {
    const token = sessionService.generateCheckinQrToken();
    res.json({ token });
  } catch (err) {
    next(err);
  }
}

// POST /api/sessions/checkin — member only
export async function checkIn(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: "QR token is required" });

    const email = (req as any).user?.email;
    if (!email) return res.status(401).json({ success: false, message: "Unauthorized" });

    const session = await sessionService.checkIn(token, email);
    res.status(201).json({ success: true, data: session });
  } catch (err) {
    next(err);
  }
}

// POST /api/sessions/checkout — member only
export async function checkOut(req: Request, res: Response, next: NextFunction) {
  try {
    const email = (req as any).user?.email;
    if (!email) return res.status(401).json({ success: false, message: "Unauthorized" });

    const session = await sessionService.checkOut(email);
    res.json({ success: true, data: session });
  } catch (err) {
    next(err);
  }
}

// GET /api/sessions/today — member only
export async function getTodaySession(req: Request, res: Response, next: NextFunction) {
  try {
    const email = (req as any).user?.email;
    if (!email) return res.status(401).json({ success: false, message: "Unauthorized" });

    const data = await sessionService.getTodaySession(email);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// GET /api/sessions — admin only
export async function getSessions(_req: Request, res: Response, next: NextFunction) {
  try {
    const sessions = await sessionService.getSessions();
    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (err) {
    next(err);
  }
}
