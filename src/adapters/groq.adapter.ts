import { Groq } from 'groq-sdk';
import { BaseAdapter } from './base.adapter';
import { LLMConfig } from '../types/config.types';
import { Prompt } from '../prompts/extractor';
import { ZodSchema } from 'zod';
import { SchemaConverter } from '../utils/zod-to-json';

export class GroqAdapter extends BaseAdapter {
  private client: Groq;

  constructor(apiKey: string, config: LLMConfig) {
    super(config);
    this.client = new Groq({ apiKey });
  }

  async generate(prompt: string, schema: ZodSchema): Promise<string> {
    try {
      const convertedSchema = SchemaConverter.zodToString(schema);
      const response = await this.client.chat.completions.create({
        model: this.config.model || 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: Prompt.SYSTEM_PROMPT
          },
          { role: 'user', content: prompt + convertedSchema}
        ],
        temperature: this.config.temperature || 0.1,
        response_format: { type: 'json_object' }
      });

      return response.choices[0].message.content || '';
    } catch (error) {
      throw new Error(`Groq API error: ${error}`);
    }
  }
}
