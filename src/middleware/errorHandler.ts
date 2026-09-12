import { NextFunction, Request, Response } from 'express';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ status: 'fail', message: err.message });
  }

  console.error(err);
  return res.status(500).json({ status: 'error', message: 'internal server error' });
}
