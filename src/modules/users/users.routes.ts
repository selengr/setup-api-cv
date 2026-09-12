import { Router } from 'express';
import { z } from 'zod';
import { auth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { prisma } from '../../db/prisma';
import { AppError } from '../../middleware/errorHandler';

const router = Router();

const updateMeSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z
    .string()
    .min(3)
    .max(60)
    .regex(/^[a-z0-9-]+$/, 'slug must be lowercase letters, numbers, dashes')
    .optional(),
});

router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        phone: true,
        slug: true,
        createdAt: true,
        loggedInAt: true,
      },
    });
    res.json({ status: 'success', user });
  } catch (err) {
    next(err);
  }
});

router.patch('/me', auth, validate(updateMeSchema), async (req, res, next) => {
  try {
    if (req.body.slug) {
      const taken = await prisma.user.findFirst({
        where: { slug: req.body.slug, NOT: { id: req.user!.id } },
      });
      if (taken) throw new AppError('slug already taken', 409);
    }

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(req.body.name ? { name: req.body.name } : {}),
        ...(req.body.slug ? { slug: req.body.slug } : {}),
      },
      select: { id: true, name: true, phone: true, slug: true },
    });

    res.json({ status: 'success', user });
  } catch (err) {
    next(err);
  }
});

export default router;
