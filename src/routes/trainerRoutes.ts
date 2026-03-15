import { Router } from 'express';
import { trainerController } from '../controllers/trainerController';

const router = Router();

// GET /api/trainers – list all trainers
router.get('/', trainerController.getAllTrainers);

export default router;
