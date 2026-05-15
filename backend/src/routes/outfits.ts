import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { randomBytes } from 'crypto';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../lib/auth.js';

const createSchema = z.object({
  name: z.string().optional(),
  itemIds: z.array(z.string()).min(1),
});

const updateSchema = z.object({
  name: z.string().optional(),
  itemIds: z.array(z.string()).min(1).optional(),
});

function makeToken() {
  return randomBytes(12).toString('base64url');
}

export async function outfitRoutes(app: FastifyInstance) {
  app.get('/outfits', { preHandler: requireAuth }, async (req) => {
    const outfits = await prisma.outfit.findMany({
      where: { userId: req.user.sub },
      orderBy: { createdAt: 'desc' },
    });
    return { outfits };
  });

  app.post('/outfits', { preHandler: requireAuth }, async (req, reply) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_input' });
    const outfit = await prisma.outfit.create({
      data: { userId: req.user.sub, name: parsed.data.name, itemIds: parsed.data.itemIds },
    });
    return { outfit };
  });

  app.patch('/outfits/:id', { preHandler: requireAuth }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_input' });

    const existing = await prisma.outfit.findFirst({ where: { id, userId: req.user.sub } });
    if (!existing) return reply.code(404).send({ error: 'not_found' });

    const outfit = await prisma.outfit.update({
      where: { id },
      data: parsed.data,
    });
    return { outfit };
  });

  app.delete('/outfits/:id', { preHandler: requireAuth }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const result = await prisma.outfit.deleteMany({ where: { id, userId: req.user.sub } });
    if (result.count === 0) return reply.code(404).send({ error: 'not_found' });
    return { ok: true };
  });

  app.post('/outfits/:id/share', { preHandler: requireAuth }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const existing = await prisma.outfit.findFirst({ where: { id, userId: req.user.sub } });
    if (!existing) return reply.code(404).send({ error: 'not_found' });
    const token = existing.shareToken ?? makeToken();
    const outfit = await prisma.outfit.update({
      where: { id },
      data: { shareToken: token, isPublic: true },
    });
    return { token: outfit.shareToken, isPublic: outfit.isPublic };
  });

  app.delete('/outfits/:id/share', { preHandler: requireAuth }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const existing = await prisma.outfit.findFirst({ where: { id, userId: req.user.sub } });
    if (!existing) return reply.code(404).send({ error: 'not_found' });
    await prisma.outfit.update({ where: { id }, data: { isPublic: false } });
    return { ok: true };
  });

  app.get('/public/outfits/:token', async (req, reply) => {
    const { token } = req.params as { token: string };
    const outfit = await prisma.outfit.findUnique({ where: { shareToken: token } });
    if (!outfit || !outfit.isPublic) return reply.code(404).send({ error: 'not_found' });
    const items = await prisma.catalogItem.findMany({ where: { id: { in: outfit.itemIds } } });
    return {
      outfit: { id: outfit.id, name: outfit.name, itemIds: outfit.itemIds, createdAt: outfit.createdAt },
      items,
    };
  });
}
