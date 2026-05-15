import type { FastifyInstance, FastifyReply } from 'fastify';
import { z } from 'zod';
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { prisma } from '../lib/prisma.js';
import { config } from '../config.js';
import { issueRefreshToken, consumeRefreshToken, revokeAllRefresh } from '../lib/tokens.js';
import { roleFor } from '../lib/auth.js';

const scryptAsync = promisify(scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, 64);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(':');
  const salt = Buffer.from(saltHex, 'hex');
  const expected = Buffer.from(hashHex, 'hex');
  const actual = await scryptAsync(password, salt, expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

const credSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

async function issueTokens(reply: FastifyReply, userId: string) {
  const accessToken = await reply.jwtSign({ sub: userId }, { expiresIn: config.jwtTtl });
  const refreshToken = await issueRefreshToken(userId);
  return { accessToken, refreshToken };
}

export async function authRoutes(app: FastifyInstance) {
  const authLimits = { config: { rateLimit: { max: 10, timeWindow: '1 minute' } } };

  app.post('/auth/register', authLimits, async (req, reply) => {
    const parsed = credSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_input' });
    const { email, password } = parsed.data;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return reply.code(409).send({ error: 'email_taken' });

    const user = await prisma.user.create({
      data: { email, passwordHash: await hashPassword(password), role: roleFor(email) },
    });
    const tokens = await issueTokens(reply, user.id);
    return { ...tokens, user: { id: user.id, email: user.email, role: user.role } };
  });

  app.post('/auth/login', authLimits, async (req, reply) => {
    const parsed = credSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_input' });
    const { email, password } = parsed.data;

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return reply.code(401).send({ error: 'invalid_credentials' });
    }
    const desired = roleFor(user.email);
    if (desired === 'admin' && user.role !== 'admin') {
      user = await prisma.user.update({ where: { id: user.id }, data: { role: 'admin' } });
    }
    const tokens = await issueTokens(reply, user.id);
    return { ...tokens, user: { id: user.id, email: user.email, role: user.role } };
  });

  app.post('/auth/refresh', authLimits, async (req, reply) => {
    const body = req.body as { refreshToken?: string };
    if (!body?.refreshToken) return reply.code(400).send({ error: 'invalid_input' });

    const userId = await consumeRefreshToken(body.refreshToken);
    if (!userId) return reply.code(401).send({ error: 'invalid_refresh' });

    const tokens = await issueTokens(reply, userId);
    return tokens;
  });

  app.post('/auth/logout', async (req, reply) => {
    const body = (req.body as { refreshToken?: string }) ?? {};
    if (body.refreshToken) {
      await consumeRefreshToken(body.refreshToken).catch(() => null);
    }
    try {
      await req.jwtVerify();
      await revokeAllRefresh(req.user.sub);
    } catch { /* ok */ }
    return { ok: true };
  });
}
