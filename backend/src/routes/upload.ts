import type { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { uploadBuffer } from '../lib/s3.js';
import { requireAuth } from '../lib/auth.js';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 10 * 1024 * 1024;

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload/photo', { preHandler: requireAuth }, async (req, reply) => {
    const file = await req.file();
    if (!file) return reply.code(400).send({ error: 'no_file' });
    if (!ALLOWED.has(file.mimetype)) return reply.code(415).send({ error: 'bad_mime' });

    const buffer = await file.toBuffer();
    if (buffer.length > MAX_BYTES) return reply.code(413).send({ error: 'too_large' });

    const { key, url } = await uploadBuffer(buffer, file.mimetype, 'photos');
    const photo = await prisma.photo.create({
      data: { userId: req.user.sub, url, key },
    });
    return { photo };
  });
}
