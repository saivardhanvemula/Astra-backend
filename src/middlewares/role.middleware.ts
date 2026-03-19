import { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user || user.role !== "admin") return res.status(401).json({ error: "Unauthorized" });
  next();
}

export function requireMember(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user || user.role !== "member") return res.status(401).json({ error: "Unauthorized" });
  next();
}
