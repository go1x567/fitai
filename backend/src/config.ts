import 'dotenv/config';

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export const config = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3001),
  corsOrigins: (process.env.ALLOWED_ORIGINS ?? process.env.CORS_ORIGIN ?? 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  jwtSecret: required('JWT_SECRET'),
  jwtTtl: process.env.JWT_TTL ?? '15m',
  refreshTtlDays: Number(process.env.REFRESH_TTL_DAYS ?? 30),
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  databaseUrl: required('DATABASE_URL'),
  s3: {
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION ?? 'us-east-1',
    bucket: required('S3_BUCKET'),
    accessKey: required('S3_ACCESS_KEY'),
    secretKey: required('S3_SECRET_KEY'),
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
    publicUrl: process.env.S3_PUBLIC_URL ?? '',
  },
  aiProvider: process.env.AI_PROVIDER ?? 'stub',
  adminEmails: new Set(
    (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  ),
};
