import { randomInt } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env';
import { prisma } from '../db/prisma';

export async function createOtp(phone: string): Promise<{ id: string; code: string }> {
  const code = String(randomInt(100000, 999999));
  const id = uuidv4();
  const expiresAt = new Date(Date.now() + env.otpTtlSeconds * 1000);

  await prisma.phoneVerification.create({
    data: { id, phone, code, expiresAt },
  });

  if (env.otpDevMode) {
    // Dev/demo only — never log OTPs in real production SMS flow
    console.log(`[OTP] phone=${phone} code=${code} (expires in ${env.otpTtlSeconds}s)`);
  }

  return { id, code };
}

export async function verifyOtp(token: string, code: string) {
  const record = await prisma.phoneVerification.findUnique({ where: { id: token } });
  if (!record) return null;
  if (record.expiresAt.getTime() < Date.now()) {
    await prisma.phoneVerification.delete({ where: { id: token } }).catch(() => undefined);
    return null;
  }
  if (record.code !== code) return null;
  return record;
}

export async function deleteOtp(id: string) {
  await prisma.phoneVerification.delete({ where: { id } }).catch(() => undefined);
}
