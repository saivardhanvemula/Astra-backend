import { AppError } from "../middlewares/errorMiddleware";
import * as planDb from "../dbhelpers/plan.db";

export async function getAllPlans() {
  return planDb.getAllPlans();
}

export async function createPlan(data: {
  name: string;
  price: number;
  duration_days: number;
}) {
  if (!data.name || data.price == null || data.duration_days == null) {
    throw new AppError("name, price, and duration_days are required", 400);
  }
  return planDb.createPlan({
    name: data.name,
    price: data.price,
    duration: `${data.duration_days} days`,
    duration_days: data.duration_days,
  });
}
