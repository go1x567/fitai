import { config } from '../config.js';

export type AiTryOnInput = {
  personImageUrl: string;
  garmentImageUrl: string | null;
  garmentDescription: string;
};

export type AiTryOnResult = { resultUrl: string };

export async function runTryOn(input: AiTryOnInput): Promise<AiTryOnResult> {
  if (config.aiProvider === 'stub') {
    await new Promise((r) => setTimeout(r, 1500));
    return { resultUrl: input.personImageUrl };
  }
  throw new Error(`Unknown AI_PROVIDER: ${config.aiProvider}`);
}
