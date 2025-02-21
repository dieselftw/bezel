import { z } from 'zod';
import { ValidationError } from './errors';

export async function validateSchema<T>(
  data: unknown, 
  schema: z.ZodSchema<T>
): Promise<T[]> {
  try {
    const dataArray = Array.isArray(data) ? data : [data];
    
    const validatedItems = await Promise.all(
      dataArray.map(async (item, index) => {
        try {
          return await schema.parseAsync(item);
        } catch (error) {
          throw new ValidationError(
            `Validation failed for item at index ${index}: ${error}`
          );
        }
      })
    );
    
    return validatedItems;
  } catch (error) {
    throw new ValidationError(`Schema validation failed: ${error}`);
  }
}
