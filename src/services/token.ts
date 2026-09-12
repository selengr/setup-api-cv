import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export type TokenPayload = {
  userId: number;
  name: string;
  phone: string;
};

export function createToken(data: TokenPayload, expiresIn: SignOptions['expiresIn'] = '24h'): string {
  const options: SignOptions = { expiresIn };
  return jwt.sign(data, env.tokenKey, options);
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, env.tokenKey) as TokenPayload;
}
