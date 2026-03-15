import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';

import loggerMiddleware from './middlewares/loggerMiddleware';
import errorMiddleware from './middlewares/errorMiddleware';

import memberRoutes from './routes/memberRoutes';
import planRoutes from './routes/planRoutes';
import trainerRoutes from './routes/trainerRoutes';
import transformationRoutes from './routes/transformationRoutes';

const app = express();

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'Astra Gym API', timestamp: new Date() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/members', memberRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/transformations', transformationRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorMiddleware);

export default app;
