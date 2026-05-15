import { Worker } from 'bullmq';
import { redis } from '../lib/redis.js';
import { prisma } from '../lib/prisma.js';
import { runTryOn } from '../services/ai.js';
import type { TryOnJobData } from '../lib/queue.js';

const worker = new Worker<TryOnJobData>(
  'tryon',
  async (job) => {
    const { jobId } = job.data;

    await prisma.tryOnJob.update({ where: { id: jobId }, data: { status: 'processing' } });

    const dbJob = await prisma.tryOnJob.findUnique({
      where: { id: jobId },
      include: { photo: true, catalogItem: true },
    });
    if (!dbJob) throw new Error(`job ${jobId} not found`);

    try {
      const result = await runTryOn({
        personImageUrl: dbJob.photo.url,
        garmentImageUrl: dbJob.catalogItem.imageUrl,
        garmentDescription: dbJob.catalogItem.name,
      });
      await prisma.tryOnJob.update({
        where: { id: jobId },
        data: { status: 'done', resultUrl: result.resultUrl },
      });
    } catch (err) {
      await prisma.tryOnJob.update({
        where: { id: jobId },
        data: { status: 'failed', error: err instanceof Error ? err.message : String(err) },
      });
      throw err;
    }
  },
  { connection: redis, concurrency: 4 },
);

worker.on('ready', () => console.log('try-on worker ready'));
worker.on('failed', (job, err) => console.error(`job ${job?.id} failed:`, err));
