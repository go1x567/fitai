import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { tryOnQueue } from '../lib/queue.js';
import { requireAuth } from '../lib/auth.js';

const createSchema = z.object({
  photoId: z.string(),
  catalogItemId: z.string(),
  size: z.string().optional(),
});

export async function tryOnRoutes(app: FastifyInstance) {
  app.post('/tryon', { preHandler: requireAuth }, async (req, reply) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_input' });
    const { photoId, catalogItemId, size } = parsed.data;

    const photo = await prisma.photo.findFirst({ where: { id: photoId, userId: req.user.sub } });
    if (!photo) return reply.code(404).send({ error: 'photo_not_found' });

    const item = await prisma.catalogItem.findUnique({ where: { id: catalogItemId } });
    if (!item) return reply.code(404).send({ error: 'item_not_found' });

    const job = await prisma.tryOnJob.create({
      data: { userId: req.user.sub, photoId, catalogItemId, size, status: 'pending' },
    });

    await tryOnQueue.add('tryon', {
      jobId: job.id,
      userId: job.userId,
      photoId: job.photoId,
      catalogItemId: job.catalogItemId,
    });

    return { jobId: job.id, status: job.status };
  });

  app.get('/tryon/:id', { preHandler: requireAuth }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const job = await prisma.tryOnJob.findFirst({ where: { id, userId: req.user.sub } });
    if (!job) return reply.code(404).send({ error: 'not_found' });
    return job;
  });
}
