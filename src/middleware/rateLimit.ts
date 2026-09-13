import { NextFunction, Request, Response } from 'express';

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Very small in-memory limiter. Fine for demo / single instance. */
export function rateLimit(options: { windowMs: number; max: number; key?: (req: Request) => string }) {
  const { windowMs, max } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const key = options.key?.(req) ?? req.ip ?? 'unknown';
    const now = Date.now();
    let bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }

    bucket.count += 1;

    if (bucket.count > max) {
      return res.status(429).json({
        status: 'fail',
        message: 'too many requests, try again later',
      });
    }

    return next();
  };
}
