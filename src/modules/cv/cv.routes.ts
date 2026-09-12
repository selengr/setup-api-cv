import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  educationSchema,
  experienceSchema,
  profileSchema,
  projectSchema,
  skillSchema,
} from './cv.schema';
import * as cvService from './cv.service';

const router = Router();

/** Public demo endpoint — no auth */
router.get('/public/:slug', async (req, res, next) => {
  try {
    const cv = await cvService.getPublicCv(req.params.slug);
    res.json({ status: 'success', cv });
  } catch (err) {
    next(err);
  }
});

router.get('/me', auth, async (req, res, next) => {
  try {
    const cv = await cvService.getMyCv(req.user!.id);
    res.json({ status: 'success', cv });
  } catch (err) {
    next(err);
  }
});

router.patch('/me/profile', auth, validate(profileSchema), async (req, res, next) => {
  try {
    const profile = await cvService.updateProfile(req.user!.id, req.body);
    res.json({ status: 'success', profile });
  } catch (err) {
    next(err);
  }
});

router.post('/me/experiences', auth, validate(experienceSchema), async (req, res, next) => {
  try {
    const item = await cvService.addExperience(req.user!.id, req.body);
    res.status(201).json({ status: 'success', experience: item });
  } catch (err) {
    next(err);
  }
});

router.delete('/me/experiences/:id', auth, async (req, res, next) => {
  try {
    await cvService.deleteExperience(req.user!.id, Number(req.params.id));
    res.json({ status: 'success' });
  } catch (err) {
    next(err);
  }
});

router.post('/me/educations', auth, validate(educationSchema), async (req, res, next) => {
  try {
    const item = await cvService.addEducation(req.user!.id, req.body);
    res.status(201).json({ status: 'success', education: item });
  } catch (err) {
    next(err);
  }
});

router.delete('/me/educations/:id', auth, async (req, res, next) => {
  try {
    await cvService.deleteEducation(req.user!.id, Number(req.params.id));
    res.json({ status: 'success' });
  } catch (err) {
    next(err);
  }
});

router.post('/me/skills', auth, validate(skillSchema), async (req, res, next) => {
  try {
    const item = await cvService.addSkill(req.user!.id, req.body);
    res.status(201).json({ status: 'success', skill: item });
  } catch (err) {
    next(err);
  }
});

router.delete('/me/skills/:id', auth, async (req, res, next) => {
  try {
    await cvService.deleteSkill(req.user!.id, Number(req.params.id));
    res.json({ status: 'success' });
  } catch (err) {
    next(err);
  }
});

router.post('/me/projects', auth, validate(projectSchema), async (req, res, next) => {
  try {
    const item = await cvService.addProject(req.user!.id, req.body);
    res.status(201).json({ status: 'success', project: item });
  } catch (err) {
    next(err);
  }
});

router.delete('/me/projects/:id', auth, async (req, res, next) => {
  try {
    await cvService.deleteProject(req.user!.id, Number(req.params.id));
    res.json({ status: 'success' });
  } catch (err) {
    next(err);
  }
});

export default router;
