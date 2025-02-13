import OpenAI from 'openai';
import { BaseAdapter } from './base.adapter';
import { LLMConfig } from '../types/config.types';
import { Prompt } from '../prompts/extractor';
import { ZodSchema } from 'zod';

export class OpenAIAdapter extends BaseAdapter {
  private client: OpenAI;

  constructor(apiKey: string, config: LLMConfig) {
    super(config);
    this.client = new OpenAI({ apiKey });
  }

  async generate(prompt: string, schema: ZodSchema): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.config.model,
      messages: [
        {
          role: 'system',
          content: Prompt.SYSTEM_PROMPT
        },
        { role: 'user', content: prompt + schema }
      ],
      temperature: this.config.temperature || 0.1,
      response_format: { type: 'json_object' }
    });

    return response.choices[0].message.content || '';
  }
}
