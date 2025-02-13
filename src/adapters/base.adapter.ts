import { ZodSchema } from 'zod';
import { LLMConfig } from '../types/config.types';

export abstract class BaseAdapter {
  protected config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  abstract generate(prompt: string, schema: ZodSchema): Promise<string>;
}
