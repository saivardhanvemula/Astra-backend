import { Request, Response, NextFunction } from 'express';
import { planService } from '../services/planService';

export const planController = {
  async getAllPlans(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const plans = await planService.getAllPlans();
      res.status(200).json({
        success: true,
        count: plans.length,
        data: plans,
      });
    } catch (err) {
      next(err);
    }
  },
};
