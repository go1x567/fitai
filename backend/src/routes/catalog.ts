import type { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma.js';

export async function catalogRoutes(app: FastifyInstance) {
  app.get('/catalog', async (req) => {
    const cat = (req.query as { cat?: string }).cat;
    const items = await prisma.catalogItem.findMany({
      where: cat && cat !== 'Все' ? { cat } : undefined,
      orderBy: { id: 'asc' },
    });
    return { items };
  });

  app.get('/catalog/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const item = await prisma.catalogItem.findUnique({ where: { id } });
    if (!item) return reply.code(404).send({ error: 'not_found' });
    return item;
  });
}
