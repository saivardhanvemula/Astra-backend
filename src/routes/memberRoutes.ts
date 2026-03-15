import { Router } from 'express';
import { memberController } from '../controllers/memberController';
import validate from '../middlewares/validateMiddleware';
import { createMemberSchema } from '../services/memberService';

const router = Router();

// POST /api/members – register a new member
router.post('/', validate(createMemberSchema), memberController.createMember);

// GET /api/members – list all members
router.get('/', memberController.getAllMembers);

export default router;
