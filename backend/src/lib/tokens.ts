import { createHash, randomBytes } from 'node:crypto';
import { prisma } from './prisma.js';
import { config } from '../config.js';

export function hashToken(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}

export async function issueRefreshToken(userId: string): Promise<string> {
  const raw = randomBytes(48).toString('base64url');
  const expiresAt = new Date(Date.now() + config.refreshTtlDays * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: { userId, tokenHash: hashToken(raw), expiresAt },
  });
  return raw;
}

export async function consumeRefreshToken(raw: string): Promise<string | null> {
  const tokenHash = hashToken(raw);
  const row = await prisma.refreshToken.findUnique({ where: { tokenHash } });
  if (!row || row.revokedAt || row.expiresAt < new Date()) return null;
  await prisma.refreshToken.update({
    where: { id: row.id },
    data: { revokedAt: new Date() },
  });
  return row.userId;
}

export async function revokeAllRefresh(userId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
