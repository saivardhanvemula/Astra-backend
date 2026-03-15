import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Returns an Express middleware that validates req.body against the given
 * Zod schema. On failure the error is forwarded to the global error handler.
 */
const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(result.error);
      return;
    }
    // Replace body with the parsed (stripped / coerced) value
    req.body = result.data;
    next();
  };

export default validate;
