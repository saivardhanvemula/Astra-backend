import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";

import authRouter from "./routers/auth.router";
import memberRouter from "./routers/member.router";
import membershipPlanRouter from "./routers/plan.router";
import profileRouter from "./routers/profile.router";
import loggerMiddleware from "./middlewares/loggerMiddleware";
import errorMiddleware from "./middlewares/errorMiddleware";

import trainerRoutes from "./routes/trainerRoutes";
import transformationRoutes from "./routes/transformationRoutes";

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", service: "Astra Gym API", timestamp: new Date() });
});

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Auth
app.use("/api/auth", authRouter);

// Member Management
app.use("/api/members", memberRouter);
app.use("/api/plans", membershipPlanRouter);
app.use("/api/profile", profileRouter);
app.use("/api/trainers", trainerRoutes);
app.use("/api/transformations", transformationRoutes);

// 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// Global error handler
app.use(errorMiddleware);

export default app;
