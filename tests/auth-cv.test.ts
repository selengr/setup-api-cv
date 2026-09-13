import request from 'supertest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { createApp } from '../src/app';
import { prisma } from '../src/db/prisma';

const dbPath = path.join(__dirname, '..', 'prisma', 'test.db');

beforeAll(() => {
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
  execSync('npx prisma db push --force-reset --skip-generate', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: 'file:./test.db' },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
});

const app = createApp();

describe('auth + public CV flow', () => {
  const phone = '09121234567';
  let jwt = '';
  let slug = '';

  it('registers a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Reza Test', phone });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
  });

  it('logs in with OTP', async () => {
    const login = await request(app).post('/api/auth/login').send({ phone });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();
    expect(login.body.devCode).toBeDefined();

    const verify = await request(app).post('/api/auth/login/verify-phone').send({
      token: login.body.token,
      code: login.body.devCode,
    });
    expect(verify.status).toBe(200);
    jwt = verify.body.user.token;
    slug = verify.body.user.slug;
    expect(jwt).toBeTruthy();
  });

  it('updates profile and adds experience', async () => {
    const profile = await request(app)
      .patch('/api/cv/me/profile')
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        headline: 'Backend developer',
        summary: 'Building APIs',
        email: 'reza@example.com',
      });
    expect(profile.status).toBe(200);

    const exp = await request(app)
      .post('/api/cv/me/experiences')
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        company: 'Acme',
        title: 'Engineer',
        startDate: '2022-01',
        description: 'APIs and auth',
      });
    expect(exp.status).toBe(201);
  });

  it('serves public CV by slug', async () => {
    const res = await request(app).get(`/api/cv/public/${slug}`);
    expect(res.status).toBe(200);
    expect(res.body.cv.name).toBe('Reza Test');
    expect(res.body.cv.headline).toBe('Backend developer');
    expect(res.body.cv.experiences.length).toBe(1);
  });

  it('health endpoint works', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
