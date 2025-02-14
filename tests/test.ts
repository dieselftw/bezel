import { Bezel, GroqAdapter } from '../src';
import { z } from 'zod';
import dotenv from 'dotenv'

dotenv.config()

async function main() {
  // 1. Create your schema
  const personSchema = z.object({
    name: z.string(),
    age: z.number(),
    skills: z.array(z.string())
  });

  // 2. Initialize adapter and Bezel
  const adapter = new GroqAdapter(process.env.GROQ_API_KEY || '- YOUR KEY HERE -', {
    model: "llama3-8b-8192"
  });

  const llm = new Bezel(adapter);

  // 3. Extract structured data
  const result = await llm.extract(
    'He is 30 years old. He likes Python and Javascript but only knows PHP',
    personSchema
  );

  console.log(result.data);
  // Output:
  // {
  //   name: "John",
  //   age: 30,
  //   skills: ["JavaScript", "Python"]
  // }
}

main();
