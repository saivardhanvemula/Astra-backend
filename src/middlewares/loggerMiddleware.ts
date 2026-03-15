import morgan from 'morgan';
import { Request, Response } from 'express';

// Custom token: request body (sanitised – never logs passwords)
morgan.token('body', (req: Request) => {
  const body = { ...(req.body as Record<string, unknown>) };
  if (body.password) body.password = '***';
  return Object.keys(body).length ? JSON.stringify(body) : '';
});

const format =
  process.env.NODE_ENV === 'production'
    ? 'combined'
    : ':method :url :status :response-time ms - :res[content-length] :body';

const loggerMiddleware = morgan(format);

export default loggerMiddleware;
