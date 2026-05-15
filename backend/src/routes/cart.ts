import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../lib/auth.js';

const addSchema = z.object({
  catalogItemId: z.string(),
  size: z.string().optional().nullable(),
  qty: z.number().int().min(1).max(99).optional(),
});

const patchSchema = z.object({
  qty: z.number().int().min(1).max(99).optional(),
  size: z.string().optional().nullable(),
});

const mergeSchema = z.object({
  items: z.array(z.object({
    catalogItemId: z.string(),
    size: z.string().optional().nullable(),
    qty: z.number().int().min(1).max(99).default(1),
  })),
});

async function ensureCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

async function loadCart(userId: string) {
  const cart = await ensureCart(userId);
  const items = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    include: { catalogItem: true },
    orderBy: { addedAt: 'desc' },
  });
  return { cart, items };
}

export async function cartRoutes(app: FastifyInstance) {
  app.get('/cart', { preHandler: requireAuth }, async (req) => {
    return loadCart(req.user.sub);
  });

  app.post('/cart/items', { preHandler: requireAuth }, async (req, reply) => {
    const parsed = addSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_input' });
    const { catalogItemId, size, qty } = parsed.data;

    const item = await prisma.catalogItem.findUnique({ where: { id: catalogItemId } });
    if (!item) return reply.code(404).send({ error: 'item_not_found' });

    const cart = await ensureCart(req.user.sub);
    const existing = await prisma.cartItem.findUnique({
      where: { cartId_catalogItemId_size: { cartId: cart.id, catalogItemId, size: size ?? null } },
    });
    const saved = existing
      ? await prisma.cartItem.update({
          where: { id: existing.id },
          data: { qty: existing.qty + (qty ?? 1) },
        })
      : await prisma.cartItem.create({
          data: { cartId: cart.id, catalogItemId, size: size ?? null, qty: qty ?? 1 },
        });
    return { item: saved };
  });

  app.patch('/cart/items/:id', { preHandler: requireAuth }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const parsed = patchSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_input' });

    const cart = await ensureCart(req.user.sub);
    const existing = await prisma.cartItem.findFirst({ where: { id, cartId: cart.id } });
    if (!existing) return reply.code(404).send({ error: 'not_found' });

    const updated = await prisma.cartItem.update({ where: { id }, data: parsed.data });
    return { item: updated };
  });

  app.delete('/cart/items/:id', { preHandler: requireAuth }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const cart = await ensureCart(req.user.sub);
    const result = await prisma.cartItem.deleteMany({ where: { id, cartId: cart.id } });
    if (result.count === 0) return reply.code(404).send({ error: 'not_found' });
    return { ok: true };
  });

  app.delete('/cart', { preHandler: requireAuth }, async (req) => {
    const cart = await ensureCart(req.user.sub);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return { ok: true };
  });

  app.post('/cart/merge', { preHandler: requireAuth }, async (req, reply) => {
    const parsed = mergeSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_input' });
    const cart = await ensureCart(req.user.sub);

    for (const it of parsed.data.items) {
      const exists = await prisma.catalogItem.findUnique({ where: { id: it.catalogItemId } });
      if (!exists) continue;
      const existing = await prisma.cartItem.findUnique({
        where: { cartId_catalogItemId_size: { cartId: cart.id, catalogItemId: it.catalogItemId, size: it.size ?? null } },
      });
      if (existing) {
        await prisma.cartItem.update({ where: { id: existing.id }, data: { qty: existing.qty + it.qty } });
      } else {
        await prisma.cartItem.create({
          data: { cartId: cart.id, catalogItemId: it.catalogItemId, size: it.size ?? null, qty: it.qty },
        });
      }
    }
    return loadCart(req.user.sub);
  });
}
