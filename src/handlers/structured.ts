import { z } from 'zod';
import { BaseAdapter } from '../adapters/base.adapter';
import { LLMResponse } from '../types/response.types';
import { validateSchema } from '../utils/validation';

export class Bezel {
  private adapter: BaseAdapter;

  constructor(adapter: BaseAdapter) {
    this.adapter = adapter;
  }

  async extract<T>(
    prompt: string, 
    schema: z.ZodSchema<T>
  ): Promise<LLMResponse<T>> {
    const response = await this.adapter.generate(prompt, schema);
    const content = JSON.parse(response);
    const data = await validateSchema(content, schema);
    
    return {
      data,
      raw: response
    };
  }

  async extractMany<T>(
    prompts: string[], 
    schema: z.ZodSchema<T>
  ): Promise<LLMResponse<T>[]> {
    return Promise.all(prompts.map(prompt => this.extract(prompt, schema)));
  }
}
