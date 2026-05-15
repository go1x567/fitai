import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import jwt from '@fastify/jwt';
import { config } from './config.js';
import { authRoutes } from './routes/auth.js';
import { catalogRoutes } from './routes/catalog.js';
import { uploadRoutes } from './routes/upload.js';
import { tryOnRoutes } from './routes/tryon.js';
import { outfitRoutes } from './routes/outfits.js';
import { meRoutes } from './routes/me.js';
import { cartRoutes } from './routes/cart.js';
import { adminRoutes } from './routes/admin.js';

const app = Fastify({ logger: true });

await app.register(helmet, { contentSecurityPolicy: false });
await app.register(cors, {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (config.corsOrigins.includes(origin)) return cb(null, true);
    if (config.corsOrigins.some((o) => o.startsWith('*.') && origin.endsWith(o.slice(1)))) return cb(null, true);
    cb(new Error('cors_blocked'), false);
  },
  credentials: true,
});
await app.register(rateLimit, {
  max: 120,
  timeWindow: '1 minute',
  allowList: (req) => req.url === '/health',
});
await app.register(multipart, { limits: { fileSize: 15 * 1024 * 1024 } });
await app.register(jwt, { secret: config.jwtSecret });

app.get('/health', async () => ({ ok: true }));

await app.register(authRoutes);
await app.register(catalogRoutes);
await app.register(uploadRoutes);
await app.register(tryOnRoutes);
await app.register(outfitRoutes);
await app.register(meRoutes);
await app.register(cartRoutes);
await app.register(adminRoutes);

app.listen({ port: config.port, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
