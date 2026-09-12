import { NextFunction, Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { verifyToken } from '../services/token';

export type AuthUser = {
  id: number;
  name: string;
  phone: string;
  slug: string | null;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ status: 'fail', message: 'unauthorized' });
  }

  const token = header.startsWith('Bearer ') ? header.slice(7) : header;

  try {
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user || user.token !== token) {
      return res.status(401).json({ status: 'fail', message: 'unauthorized' });
    }

    req.user = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      slug: user.slug,
    };
    return next();
  } catch {
    return res.status(401).json({ status: 'fail', message: 'unauthorized' });
  }
}
