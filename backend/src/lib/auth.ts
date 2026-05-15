import type { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from './prisma.js';
import { config } from '../config.js';

export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch {
    return reply.code(401).send({ error: 'unauthorized' });
  }
}

export async function requireAdmin(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch {
    return reply.code(401).send({ error: 'unauthorized' });
  }
  const user = await prisma.user.findUnique({
    where: { id: req.user.sub },
    select: { role: true, email: true },
  });
  if (!user) return reply.code(401).send({ error: 'unauthorized' });
  if (user.role !== 'admin' && !config.adminEmails.has(user.email.toLowerCase())) {
    return reply.code(403).send({ error: 'forbidden' });
  }
}

export function roleFor(email: string): 'admin' | 'user' {
  return config.adminEmails.has(email.toLowerCase()) ? 'admin' : 'user';
}

declare module 'fastify' {
  interface FastifyRequest {
    user: { sub: string };
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: string };
    user: { sub: string };
  }
}
