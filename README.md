# portfolio-api

Backend API for a personal portfolio / resume page.

I started this a while ago as a small Node API. Later I rewrote it in TypeScript and cleaned it up.
The idea is simple: you sign up with your phone, fill in work history / education / skills / projects,
then share a public link like `/api/cv/public/your-name`.

Right now OTP codes are printed in the server log when `OTP_DEV_MODE=true`.
In a real deploy you'd turn that off and send SMS instead.

Repo: https://github.com/selengr/portfolio-api

## What you can do

- register / login with Iranian phone number (OTP + JWT)
- edit your profile
- add / edit / delete experience, education, skills, projects
- open a public portfolio page by slug (no login needed)

Login is rate limited a bit so people can't spam OTP forever.

## Tech

Node, Express, TypeScript, Prisma, SQLite, Zod, Jest, Docker.

Swagger is at `/api/docs` if you want to click around the endpoints.

## Run it locally

```bash
cp .env.example .env
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Then open:

- http://localhost:4000/api
- http://localhost:4000/api/docs
- http://localhost:4000/api/cv/public/hesam-demo  (demo user from seed)
- http://localhost:4000/api/health

## Quick auth example

```bash
# 1) register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Reza","phone":"09121234567"}'

# 2) login -> get otp session token (+ devCode when OTP_DEV_MODE=true)
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"09121234567"}'

# 3) verify code -> get JWT
curl -X POST http://localhost:4000/api/auth/login/verify-phone \
  -H "Content-Type: application/json" \
  -d '{"token":"OTP_SESSION_ID","code":"123456"}'
```

Put the JWT in header like: `Authorization: Bearer YOUR_TOKEN`

## Docker

```bash
export TOKEN_KEY=some-long-secret
docker compose up --build
```

By default `OTP_DEV_MODE` is off in docker. Set `OTP_DEV_MODE=true` if you still need codes in the logs.

## Tests

```bash
npm test
```

## Notes before you deploy

- change `TOKEN_KEY` to something long and random
- set `CORS_ORIGIN` to your frontend URL
- keep `OTP_DEV_MODE=false` in real environments
- SQLite is fine for demo; use Postgres later if you need it

That's pretty much it.
