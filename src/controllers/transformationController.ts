import { Request, Response, NextFunction } from 'express';
import { transformationService } from '../services/transformationService';

export const transformationController = {
  async getAllTransformations(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const transformations = await transformationService.getAllTransformations();
      res.status(200).json({
        success: true,
        count: transformations.length,
        data: transformations,
      });
    } catch (err) {
      next(err);
    }
  },
};
