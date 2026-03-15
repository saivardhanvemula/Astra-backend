import { Router } from 'express';
import { transformationController } from '../controllers/transformationController';

const router = Router();

// GET /api/transformations – list all transformation entries
router.get('/', transformationController.getAllTransformations);

export default router;
