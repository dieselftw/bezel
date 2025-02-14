import { ZodSchema } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

interface JSONSchemaProperty {
  type: string;
  items?: any;
}

interface JSONSchema {
  type: 'object';
  properties: {
    [key: string]: JSONSchemaProperty;
  };
  required: string[];
  additionalProperties: boolean;
  '$schema': string;
}

// TODO: add prisma and stuff
export class SchemaConverter {
    static zodToString(schema: ZodSchema): string {
        const jsonSchema = zodToJsonSchema(schema) as JSONSchema;
        const properties = Object.entries(jsonSchema.properties).map(([key, value]) => {
            if (value.type === 'array') {
                return `  ${key}: array of ${value.items.type}`;
            }
            return `  ${key}: ${value.type}`;
        }).join('\n');

        return `\n Expected structure:\n{\n${properties}\n}`;
    }
}
