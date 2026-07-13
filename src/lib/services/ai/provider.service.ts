import { groq } from '@ai-sdk/groq';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';

export class AIProviderService {
  /**
   * Returns the initialized AI model for the `@ai-sdk` generateText/streamText functions.
   */
  static getModel(provider: string, modelName: string) {
    if (provider === 'groq') {
      if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY is missing');
      }
      return groq(modelName || 'llama-3.3-70b-versatile');
    }

    if (provider === 'gemini') {
      if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is missing');
      }
      const google = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      });
      return google(modelName || 'gemini-1.5-pro');
    }

    if (provider === 'openai') {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is missing');
      }
      const openai = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      return openai(modelName || 'gpt-4o');
    }

    if (provider === 'claude') {
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY is missing');
      }
      const anthropic = createAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
      return anthropic(modelName || 'claude-3-5-sonnet-latest');
    }

    if (provider === 'ollama') {
      throw new Error(`Provider ${provider} is coming in a future update.`);
    }

    // Default fallback
    throw new Error(`Unsupported AI Provider: ${provider}`);
  }
}
