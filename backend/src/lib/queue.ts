import { Queue } from 'bullmq';
import { redis } from './redis.js';

export type TryOnJobData = {
  jobId: string;
  userId: string;
  photoId: string;
  catalogItemId: string;
};

export const tryOnQueue = new Queue<TryOnJobData>('tryon', { connection: redis });
