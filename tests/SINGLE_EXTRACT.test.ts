import { Bezel, GroqAdapter } from '../src';
import { z } from 'zod';
import dotenv from 'dotenv'

dotenv.config()

async function main() {
  // 1. Create your schema and infer type
  const personSchema = z.object({
    name: z.string(),
    age: z.number(),
    skills: z.array(z.string())
  });
  
  // Create type from schema
  type Person = z.infer<typeof personSchema>;

  // 2. Initialize adapter and Bezel
  const adapter = new GroqAdapter(process.env.GROQ_API_KEY || '- YOUR KEY HERE -', {
    model: "llama3-8b-8192",
    maxRetries: 1,
  });

  const llm = new Bezel(adapter);

  // 3. Extract structured data - now result.data will be typed as Person
  const result = await llm.extract<Person>(
    // NPC talk simulation goes hard
    `I don't know man, we can hire anybody. I think John is pretty good at TypeScript for a 20 year old. The kid might have potential.`,
    personSchema
  );

  // result.data is now typed as Person
  /*
    [
      { name: 'John', age: 20, skills: [ 'JavaScript' ] },
      { name: 'Tim', age: 20, skills: [ 'JavaScript', 'Rust', 'SQL' ] }
    ]
  */
  
  console.log(result.data);
}

main();
