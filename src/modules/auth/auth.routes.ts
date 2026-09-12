import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { loginSchema, registerSchema, verifyPhoneSchema } from './auth.schema';
import * as authService from './auth.service';

const router = Router();

router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const result = await authService.register(req.body.name, req.body.phone);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const result = await authService.requestLogin(req.body.phone);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/login/verify-phone', validate(verifyPhoneSchema), async (req, res, next) => {
  try {
    const result = await authService.verifyLogin(req.body.token, req.body.code);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/logout', auth, async (req, res, next) => {
  try {
    const result = await authService.logout(req.user!.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
