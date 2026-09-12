import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export type TokenPayload = {
  userId: number;
  name: string;
  phone: string;
};

export function createToken(data: TokenPayload, expiresIn = '24h'): string {
  return jwt.sign(data, env.tokenKey, { expiresIn });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, env.tokenKey) as TokenPayload;
}
