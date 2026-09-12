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

  app.use(morgan(env.isTest ? 'tiny' : 'dev'));
  app.use(express.json());
  app.use(cors({ origin: env.corsOrigin }));

  app.get('/api', (_req, res) => {
    res.json({
      status: 'success',
      name: 'CV Platform API',
      docs: '/api/docs',
    });
  });

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/api/auth', authRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/cv', cvRoutes);

  app.use(errorHandler);
  return app;
}
