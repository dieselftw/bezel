import { z } from 'zod';
import { ValidationError } from './errors';

export async function validateSchema<T>(
  data: unknown, 
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    throw new ValidationError(`Schema validation failed: ${error}`);
  }
}
