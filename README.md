# CV Platform API

TypeScript REST API for a personal **CV / resume platform**.

Phone OTP login → JWT → manage profile, experience, education, skills, projects → publish a public CV at `/api/cv/public/:slug`.

## Stack

- Node.js + Express + TypeScript
- Prisma + SQLite (swap `DATABASE_URL` for Postgres in production)
- Zod validation, JWT auth, Swagger UI
- Jest + Supertest
- Docker Compose

## Quick start

```bash
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

- API: http://localhost:4000/api  
- Docs: http://localhost:4000/api/docs  
- Demo public CV (after seed): http://localhost:4000/api/cv/public/hesam-demo  

## Auth flow

1. `POST /api/auth/register` `{ "name", "phone" }`
2. `POST /api/auth/login` `{ "phone" }` → returns OTP session `token` (and `devCode` when `OTP_DEV_MODE=true`)
3. `POST /api/auth/login/verify-phone` `{ "token", "code" }` → JWT
4. Send `Authorization: Bearer <jwt>` on protected routes

Iranian phone formats accepted: `09xxxxxxxxx`, `+989...`, `00989...`.

## Main endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/cv/public/:slug` | no | Public CV |
| GET | `/api/cv/me` | yes | Full owner CV |
| PATCH | `/api/cv/me/profile` | yes | Update headline/summary/... |
| POST | `/api/cv/me/experiences` | yes | Add job |
| POST | `/api/cv/me/educations` | yes | Add education |
| POST | `/api/cv/me/skills` | yes | Add skill |
| POST | `/api/cv/me/projects` | yes | Add project |
| GET/PATCH | `/api/users/me` | yes | Account + slug |

## Docker

```bash
export TOKEN_KEY=some-long-secret
docker compose up --build
```

## Tests

```bash
npm test
```

## Project layout

```
src/
  modules/auth|users|cv
  middleware/
  services/
  docs/swagger.ts
prisma/schema.prisma
tests/
```
