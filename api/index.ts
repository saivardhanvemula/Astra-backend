/**
 * Vercel serverless entry point.
 * Vercel's @vercel/node builder imports this file and calls it as an HTTP handler.
 * We simply re-export the configured Express app — no app.listen() needed.
 */
import app from '../src/app';

export default app;
