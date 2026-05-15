import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../lib/auth.js';

const profileSchema = z.object({
  height: z.number().int().min(100).max(230).nullable().optional(),
  weight: z.number().int().min(30).max(200).nullable().optional(),
  bodyType: z.enum(['slim', 'normal', 'curvy']).nullable().optional(),
  style: z.string().max(40).nullable().optional(),
  favorites: z.array(z.string()).optional(),
});

const SELECT = {
  id: true,
  email: true,
  role: true,
  height: true,
  weight: true,
  bodyType: true,
  style: true,
  favorites: true,
} as const;

export async function meRoutes(app: FastifyInstance) {
  app.get('/me/profile', { preHandler: requireAuth }, async (req, reply) => {
    const user = await prisma.user.findUnique({ where: { id: req.user.sub }, select: SELECT });
    if (!user) return reply.code(404).send({ error: 'not_found' });
    return user;
  });

  app.put('/me/profile', { preHandler: requireAuth }, async (req, reply) => {
    const parsed = profileSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_input' });
    const user = await prisma.user.update({
      where: { id: req.user.sub },
      data: parsed.data,
      select: SELECT,
    });
    return user;
  });

  app.get('/me/photos', { preHandler: requireAuth }, async (req) => {
    const photos = await prisma.photo.findMany({
      where: { userId: req.user.sub },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return { photos };
  });

  app.get('/me/tryons', { preHandler: requireAuth }, async (req) => {
    const limit = Math.min(Number((req.query as { limit?: string }).limit ?? 30), 100);
    const jobs = await prisma.tryOnJob.findMany({
      where: { userId: req.user.sub },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        catalogItem: true,
        photo: { select: { id: true, url: true } },
      },
    });
    return { jobs };
  });
}
