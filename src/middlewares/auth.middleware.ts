import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.headers["authorization"] as string | undefined;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = auth.split(" ")[1];
    const payload: any = verifyToken(token);
    // attach user info to request
    (req as any).user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
