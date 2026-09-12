import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

type RequestPart = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, part: RequestPart = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req[part]);
    if (!parsed.success) {
      return res.status(400).json({
        status: 'fail',
        message: 'validation error',
        errors: parsed.error.flatten(),
      });
    }
    req[part] = parsed.data;
    return next();
  };
}
