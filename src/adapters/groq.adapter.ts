import { Groq } from 'groq-sdk';
import { BaseAdapter } from './base.adapter';
import { LLMConfig } from '../types/config.types';
import { Prompt } from '../prompts/extractor';
import { ZodSchema } from 'zod';
import { SchemaConverter } from '../utils/schemaConverter';

export class GroqAdapter extends BaseAdapter {
  constructor(apiKey: string, config: LLMConfig) {
    super(config);
    this.client = new Groq({ apiKey });
  }
  
  private client: Groq;

  async generate(prompt: string, schema: ZodSchema): Promise<string> {
    let attempt = 1;
    let delay = 1000;
    let maxRetries = this.config.maxRetries ?? 1;
    
    while (attempt <= maxRetries) {
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
        });
        const output = response.choices[0].message.content || '';

        console.log('LLM Output:', output);
        return output;
        
      } catch (error) {
        console.log('LLM Error:', error);
        if (attempt === maxRetries) {
          throw new Error('Maximum retries exceeded');
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
        attempt++;
      }
    }

    throw new Error('Maximum retries exceeded');
  }
}
