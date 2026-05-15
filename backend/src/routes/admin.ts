import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAdmin } from '../lib/auth.js';

const catalogSchema = z.object({
  id: z.string().min(1).max(40),
  cat: z.string().min(1).max(40),
  name: z.string().min(1).max(120),
  price: z.number().int().min(0),
  emoji: z.string().max(8).nullable().optional(),
  tone: z.string().max(20).nullable().optional(),
  accent: z.string().max(20).nullable().optional(),
  dark: z.boolean().optional(),
  imageUrl: z.string().url().nullable().optional(),
  brand: z.string().max(60).nullable().optional(),
  purchaseUrl: z.string().url().nullable().optional(),
  priceCents: z.number().int().min(0).nullable().optional(),
  currency: z.string().length(3).optional(),
});

const catalogPatch = catalogSchema.partial().omit({ id: true });

export async function adminRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAdmin);

  app.get('/admin/stats', async () => {
    const [users, jobs, catalog, jobsByStatus, last7d, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.tryOnJob.count(),
      prisma.catalogItem.count(),
      prisma.tryOnJob.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.user.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 86400_000) } } }),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, email: true, role: true, createdAt: true },
      }),
    ]);
    const statusMap: Record<string, number> = {};
    for (const r of jobsByStatus) statusMap[r.status] = r._count._all;
    return { users, jobs, catalog, last7d, jobsByStatus: statusMap, recentUsers };
  });

  app.get('/admin/users', async (req) => {
    const q = (req.query as { q?: string; skip?: string; take?: string }) ?? {};
    const skip = Math.max(0, Number(q.skip ?? 0));
    const take = Math.min(100, Math.max(1, Number(q.take ?? 20)));
    const where = q.q
      ? { email: { contains: q.q, mode: 'insensitive' as const } }
      : undefined;
    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip, take,
        select: {
          id: true, email: true, role: true, createdAt: true,
          _count: { select: { tryOnJobs: true, outfits: true, photos: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);
    return { items, total, skip, take };
  });

  app.patch('/admin/users/:id/role', async (req, reply) => {
    const params = req.params as { id: string };
    const body = req.body as { role?: string };
    if (body.role !== 'admin' && body.role !== 'user') {
      return reply.code(400).send({ error: 'invalid_role' });
    }
    const u = await prisma.user.update({
      where: { id: params.id },
      data: { role: body.role },
      select: { id: true, email: true, role: true },
    });
    return u;
  });

  app.delete('/admin/users/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    if (id === req.user.sub) return reply.code(400).send({ error: 'cannot_delete_self' });
    await prisma.user.delete({ where: { id } });
    return { ok: true };
  });

  app.get('/admin/tryon', async (req) => {
    const q = (req.query as { status?: string; skip?: string; take?: string }) ?? {};
    const skip = Math.max(0, Number(q.skip ?? 0));
    const take = Math.min(100, Math.max(1, Number(q.take ?? 30)));
    const where = q.status
      ? { status: q.status as 'pending' | 'processing' | 'done' | 'failed' }
      : undefined;
    const [items, total] = await Promise.all([
      prisma.tryOnJob.findMany({
        where, skip, take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, email: true } },
          catalogItem: { select: { id: true, name: true, brand: true } },
        },
      }),
      prisma.tryOnJob.count({ where }),
    ]);
    return { items, total, skip, take };
  });

  app.get('/admin/catalog', async () => {
    const items = await prisma.catalogItem.findMany({ orderBy: { createdAt: 'desc' } });
    return { items };
  });

  app.post('/admin/catalog', async (req, reply) => {
    const parsed = catalogSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_input', issues: parsed.error.issues });
    const item = await prisma.catalogItem.create({ data: parsed.data });
    return item;
  });

  app.patch('/admin/catalog/:id', async (req, reply) => {
    const parsed = catalogPatch.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_input', issues: parsed.error.issues });
    const { id } = req.params as { id: string };
    const item = await prisma.catalogItem.update({ where: { id }, data: parsed.data });
    return item;
  });

  app.delete('/admin/catalog/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      await prisma.catalogItem.delete({ where: { id } });
      return { ok: true };
    } catch {
      return reply.code(409).send({ error: 'in_use' });
    }
  });
}
