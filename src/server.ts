/**
 * Local development entry point.
 * Vercel uses api/index.ts instead — never calls app.listen() in serverless.
 */
import app from './app';
import prisma from './db';

const PORT = process.env.PORT ?? 5000;

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
