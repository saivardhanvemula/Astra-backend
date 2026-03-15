import { Request, Response, NextFunction } from 'express';
import { trainerService } from '../services/trainerService';

export const trainerController = {
  async getAllTrainers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const trainers = await trainerService.getAllTrainers();
      res.status(200).json({
        success: true,
        count: trainers.length,
        data: trainers,
      });
    } catch (err) {
      next(err);
    }
  },
};
