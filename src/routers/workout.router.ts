import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireAdmin, requireMember } from "../middlewares/role.middleware";
import {
  getAllWorkoutPlans,
  getAllExercises,
  createWorkoutPlan,
  assignWorkoutPlan,
  getMemberWorkout,
  completeWorkout,
} from "../controllers/workout.controller";

const router = Router();

// GET /api/workouts/plans — admin gets all plans
router.get("/plans", authMiddleware, requireAdmin, getAllWorkoutPlans);

// GET /api/workouts/exercises — admin gets all exercises
router.get("/exercises", authMiddleware, requireAdmin, getAllExercises);

// POST /api/workouts/plans — admin creates a plan with days + exercises
router.post("/plans", authMiddleware, requireAdmin, createWorkoutPlan);

// POST /api/workouts/assign — admin assigns plan to a member
router.post("/assign", authMiddleware, requireAdmin, assignWorkoutPlan);

// GET /api/workouts/member/:memberId — admin or member views current workout
router.get("/member/:memberId", authMiddleware, getMemberWorkout);

// POST /api/workouts/complete — member marks today's workout done, advances day
router.post("/complete", authMiddleware, requireMember, completeWorkout);

export default router;
