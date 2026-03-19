import { Request, Response, NextFunction } from "express";
import * as planService from "../services/plan.service";

export async function getAllPlans(_req: Request, res: Response, next: NextFunction) {
  try {
    const plans = await planService.getAllPlans();
    res.json({ success: true, data: plans });
  } catch (err) {
    next(err);
  }
}

export async function createPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const plan = await planService.createPlan(req.body);
    res.status(201).json({ success: true, data: plan });
  } catch (err) {
    next(err);
  }
}
