import { Router } from 'express';
import { planController } from '../controllers/planController';

const router = Router();

// GET /api/plans – list all plans
router.get('/', planController.getAllPlans);

export default router;
