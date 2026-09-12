import dotenv from 'dotenv';

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  databaseUrl: required('DATABASE_URL', 'file:./dev.db'),
  tokenKey: required('TOKEN_KEY', 'dev-only-secret-change-me'),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  otpTtlSeconds: Number(process.env.OTP_TTL_SECONDS ?? 300),
  otpDevMode: (process.env.OTP_DEV_MODE ?? 'true') === 'true',
  isTest: process.env.NODE_ENV === 'test',
};
