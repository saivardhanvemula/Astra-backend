import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';

import loggerMiddleware from './middlewares/loggerMiddleware';
import errorMiddleware from './middlewares/errorMiddleware';

import memberRoutes from './routes/memberRoutes';
import planRoutes from './routes/planRoutes';
import trainerRoutes from './routes/trainerRoutes';
import transformationRoutes from './routes/transformationRoutes';

import prisma from './db';

const app = express();
const PORT = process.env.PORT ?? 5000;

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

// ─── Start Server ─────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`\n🏋️  Astra Gym API running on http://localhost:${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV ?? 'development'}`);
  console.log(`   Health check: http://localhost:${PORT}/health\n`);
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const shutdown = async (signal: string) => {
  console.log(`\n${signal} received. Closing server…`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log('PostgreSQL connection closed. Bye!');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
