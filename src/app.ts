import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { swaggerDocument } from './docs/swagger';
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import cvRoutes from './modules/cv/cv.routes';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(morgan(env.isTest ? 'tiny' : 'dev'));
  app.use(express.json({ limit: '100kb' }));
  app.use(
    cors({
      origin: env.corsOrigin === '*' ? true : env.corsOrigin,
    })
  );

  app.get('/api', (_req, res) => {
    res.json({
      status: 'success',
      name: 'portfolio-api',
      docs: '/api/docs',
    });
  });

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/api/auth', authRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/cv', cvRoutes);

  app.use((_req, res) => {
    res.status(404).json({ status: 'fail', message: 'route not found' });
  });

  app.use(errorHandler);
  return app;
}
