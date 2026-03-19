import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";

import authRouter from "./routers/auth.router";
import loggerMiddleware from "./middlewares/loggerMiddleware";
import errorMiddleware from "./middlewares/errorMiddleware";

import memberRoutes from "./routes/memberRoutes";
import planRoutes from "./routes/planRoutes";
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

// Auth
app.use("/api/auth", authRouter);

// Existing API routes
app.use("/api/members", memberRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/trainers", trainerRoutes);
app.use("/api/transformations", transformationRoutes);

// 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// Global error handler
app.use(errorMiddleware);

export default app;
