# FitAI Backend

Node.js + Fastify + Postgres + Redis + S3 backend for the FitAI virtual try-on app.

## Stack
- Fastify 5 (TypeScript)
- Prisma + PostgreSQL
- BullMQ + Redis (try-on job queue)
- S3-compatible storage (MinIO locally, R2/S3 in prod)
- JWT auth with scrypt password hashing

## Layout
```
src/
  server.ts            # Fastify entry
  config.ts            # env config
  routes/              # /auth /catalog /upload /tryon /outfits
  services/ai.ts       # AI try-on provider abstraction (stub by default)
  workers/tryon.worker.ts  # BullMQ worker
  lib/                 # prisma, redis, s3, queue, auth helpers
prisma/
  schema.prisma
  seed.ts              # imports CATALOG from fitai/src/data/catalog.js
```

## Quick start

```bash
cd backend
cp .env.example .env
npm install
docker compose up -d            # postgres + redis + minio
npx prisma migrate dev --name init
npm run seed
npm run dev                     # api on :3001
npm run worker                  # in a second terminal
```

Create the MinIO bucket once at http://localhost:9001 (login `minioadmin` / `minioadmin`), bucket name `fitai`, public read.

## API

- `POST /auth/register` `{ email, password }` -> `{ token }`
- `POST /auth/login`    `{ email, password }` -> `{ token }`
- `GET  /catalog?cat=Топы`
- `GET  /catalog/:id`
- `POST /upload/photo`  multipart `file` (jpeg/png/webp, <=10MB) -> `{ photo }`
- `POST /tryon`         `{ photoId, catalogItemId, size? }` -> `{ jobId, status }`
- `GET  /tryon/:id`     -> job with `status` (`pending|processing|done|failed`) and `resultUrl`
- `GET  /outfits`
- `POST /outfits`       `{ name?, itemIds[] }`
- `DELETE /outfits/:id`

All endpoints except `/auth/*` and `/catalog/*` require `Authorization: Bearer <token>`.

## Try-on flow
1. Client uploads photo -> `photoId`.
2. Client calls `POST /tryon` -> `jobId`.
3. Client polls `GET /tryon/:id` until `status === 'done'`, then renders `resultUrl`.

The AI step is abstracted in `src/services/ai.ts`. Default `AI_PROVIDER=stub` echoes the photo back. Swap in Replicate / fal.ai / your own model by adding a branch.
