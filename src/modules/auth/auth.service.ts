import { AppError } from '../../middleware/errorHandler';
import { env } from '../../config/env';
import { prisma } from '../../db/prisma';
import { createOtp, deleteOtp, verifyOtp } from '../../services/otp';
import { createToken } from '../../services/token';
import { normalizePhone } from '../../utils/phone';

function slugify(name: string, userId: number): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  return `${base || 'user'}-${userId}`;
}

export async function register(name: string, phoneRaw: string) {
  const phone = normalizePhone(phoneRaw);
  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    throw new AppError('the phone is already exists', 409);
  }

  const user = await prisma.user.create({
    data: { name, phone },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { slug: slugify(name, user.id) },
  });

  await prisma.profile.create({
    data: { userId: user.id },
  });

  return { status: 'success' as const };
}

export async function requestLogin(phoneRaw: string) {
  const phone = normalizePhone(phoneRaw);
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    throw new AppError('the phone not exists', 404);
  }

  const otp = await createOtp(phone);
  return {
    status: 'success' as const,
    token: otp.id,
    ...(env.otpDevMode ? { devCode: otp.code } : {}),
  };
}

export async function verifyLogin(token: string, code: string) {
  const record = await verifyOtp(token, code);
  if (!record) {
    throw new AppError('invalid or expired code', 400);
  }

  const user = await prisma.user.findUnique({ where: { phone: record.phone } });
  if (!user) {
    throw new AppError('user not found', 404);
  }

  const jwt = createToken({
    userId: user.id,
    name: user.name,
    phone: user.phone,
  });

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { token: jwt, loggedInAt: new Date() },
  });

  await deleteOtp(record.id);

  return {
    status: 'success' as const,
    user: {
      id: updated.id,
      name: updated.name,
      phone: updated.phone,
      slug: updated.slug,
      token: jwt,
    },
  };
}

export async function logout(userId: number) {
  await prisma.user.update({
    where: { id: userId },
    data: { token: null },
  });
  return { status: 'success' as const };
}
