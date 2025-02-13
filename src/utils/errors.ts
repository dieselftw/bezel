export class StructuredLLMError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'StructuredLLMError';
    }
  }
  
  export class ValidationError extends StructuredLLMError {
    constructor(message: string) {
      super(message);
      this.name = 'ValidationError';
    }
  }
  