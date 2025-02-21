# Bezel – Structured Outputs for AI Agents

Bezel is a JS framework for reliably extracting structured data from LLMs. Fully typesafe and blazingly fast.

##  Features:

1.    Reliable structured outputs (enums, objects, lists)
2.    Schema validation using Zod
3.    Retry mechanisms for better robustness
4.    Supports multiple LLM providers (currently Groq, OpenAI/Ollama planned)
5.    XML/JSON mode for flexible output formats

## 🚀 Installation

```
npm install bezel-ai
```

## 🔧 Example
```typescript
import { Bezel, GroqAdapter } from 'bezel-ai';
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
    `John is 20 years old. He's good at JavaScript.`,
    personSchema
  );

  // result.data is now typed as Person
  /*
    [
      { name: 'John', age: 20, skills: [ 'JavaScript' ] },
    ]
  */
  
  console.log(result.data);
}

main();
```

Bezel supports multiple LLMs via adapters. Currently supported:

✅ Groq

🔜 OpenAI, Ollama, and more!

## 📌 Roadmap

Checkout out our roadmap here: https://github.com/dieselftw/bezel/issues/1

## 🤝 Contributing

We welcome contributions! Feel free to submit issues, PRs, or suggestions.
