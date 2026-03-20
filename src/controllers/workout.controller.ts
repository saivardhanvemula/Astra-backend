import { Request, Response, NextFunction } from "express";
import * as workoutService from "../services/workout.service";

// GET /api/workouts/plans — admin
export async function getAllWorkoutPlans(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await workoutService.getAllWorkoutPlans();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
}

// GET /api/workouts/exercises — admin
export async function getAllExercises(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await workoutService.getAllExercises();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
}

// POST /api/workouts/plans — admin only
export async function createWorkoutPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = (req as any).user?.id;
    const plan = await workoutService.createWorkoutPlan(req.body, adminId);
    res.status(201).json({ success: true, data: plan });
  } catch (err) {
    next(err);
  }
}

// POST /api/workouts/assign — admin only
export async function assignWorkoutPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const { member_id, plan_id } = req.body;
    const assignment = await workoutService.assignWorkoutPlan(member_id, plan_id);
    res.status(201).json({ success: true, data: assignment });
  } catch (err) {
    next(err);
  }
}

// GET /api/workouts/member/:memberId — admin or member
export async function getMemberWorkout(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await workoutService.getMemberWorkout(req.params.memberId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// POST /api/workouts/complete — member only
export async function completeWorkout(req: Request, res: Response, next: NextFunction) {
  try {
    const { member_id } = req.body;
    if (!member_id) return res.status(400).json({ error: "member_id is required" });
    const result = await workoutService.completeWorkout(member_id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
