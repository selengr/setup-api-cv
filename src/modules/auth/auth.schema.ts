import { z } from 'zod';
import { IRAN_PHONE_REGEX } from '../../utils/phone';

export const registerSchema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(IRAN_PHONE_REGEX, 'Phone number is not valid'),
});

export const loginSchema = z.object({
  phone: z.string().regex(IRAN_PHONE_REGEX, 'Phone number is not valid'),
});

export const verifyPhoneSchema = z.object({
  token: z.string().uuid(),
  code: z.string().length(6),
});
