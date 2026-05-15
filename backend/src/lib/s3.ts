import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'node:crypto';
import { config } from '../config.js';

export const s3 = new S3Client({
  endpoint: config.s3.endpoint,
  region: config.s3.region,
  forcePathStyle: config.s3.forcePathStyle,
  credentials: {
    accessKeyId: config.s3.accessKey,
    secretAccessKey: config.s3.secretKey,
  },
});

export async function uploadBuffer(
  buffer: Buffer,
  contentType: string,
  prefix = 'uploads',
): Promise<{ key: string; url: string }> {
  const ext = contentType.split('/')[1] ?? 'bin';
  const key = `${prefix}/${randomUUID()}.${ext}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: config.s3.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );
  const url = config.s3.publicUrl
    ? `${config.s3.publicUrl}/${key}`
    : await getSignedUrl(s3, new GetObjectCommand({ Bucket: config.s3.bucket, Key: key }), { expiresIn: 3600 });
  return { key, url };
}
