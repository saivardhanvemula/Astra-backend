import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";

import authRouter from "./routers/auth.router";
import memberRouter from "./routers/member.router";
import membershipPlanRouter from "./routers/plan.router";
import profileRouter from "./routers/profile.router";
import sessionRouter from "./routers/session.router";
import adminRouter from "./routers/admin.router";
import workoutRouter from "./routers/workout.router";
import paymentRouter from "./routers/payment.router";
import progressRouter from "./routers/progress.router";
import workoutLogRouter from "./routers/workoutLog.router";
import memberDashboardRouter from "./routers/member.dashboard.router";
import loggerMiddleware from "./middlewares/loggerMiddleware";
import errorMiddleware from "./middlewares/errorMiddleware";

import trainerRoutes from "./routes/trainerRoutes";
import transformationRoutes from "./routes/transformationRoutes";

const app = express();

// Razorpay webhook — must receive raw body before express.json() parses it
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

// Global middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// Root
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Astra Gym API is up and running." });
});

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", service: "Astra Gym API", timestamp: new Date() });
});

// Auth
app.use("/api/auth", authRouter);

// Member Management
app.use("/api/members", memberRouter);
app.use("/api/plans", membershipPlanRouter);
app.use("/api/profile", profileRouter);
app.use("/api/trainers", trainerRoutes);
app.use("/api/transformations", transformationRoutes);
app.use("/api/sessions", sessionRouter);
app.use("/api/admin", adminRouter);
app.use("/api/workouts", workoutRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/progress", progressRouter);
app.use("/api/workout-logs", workoutLogRouter);
app.use("/api/member", memberDashboardRouter);

// 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// Global error handler
app.use(errorMiddleware);

export default app;
