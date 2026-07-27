import { createGroq } from '@ai-sdk/groq';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';

export interface GetModelOptions {
  provider: string;
  modelName?: string;
  apiKey?: string;
  baseUrl?: string;
}

export class AIProviderService {
  /**
   * Returns the initialized AI model for `@ai-sdk` generateText/streamText functions.
   * Supports custom API keys and custom base URLs per client account.
   */
  static getModel(provider: string, modelName?: string, options?: { apiKey?: string; baseUrl?: string }) {
    const customKey = options?.apiKey?.trim();
    const customUrl = options?.baseUrl?.trim();

    if (provider === 'groq') {
      const apiKey = customKey || process.env.GROQ_API_KEY;
      if (!apiKey) throw new Error('Groq API Key is missing');
      const groqProvider = createGroq({ apiKey });
      return groqProvider(modelName || 'llama-3.3-70b-versatile');
    }

    if (provider === 'gemini') {
      const apiKey = customKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      if (!apiKey) throw new Error('Google Gemini API Key is missing');
      const google = createGoogleGenerativeAI({ apiKey });
      
      const targetModel = modelName || 'gemini-1.5-flash';
      return google(targetModel);
    }

    if (provider === 'openai') {
      const apiKey = customKey || process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error('OpenAI API Key is missing');
      const openai = createOpenAI({
        apiKey,
        ...(customUrl ? { baseURL: customUrl } : {}),
      });
      return openai(modelName || 'gpt-4o');
    }

    if (provider === 'claude' || provider === 'anthropic') {
      const apiKey = customKey || process.env.ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error('Anthropic Claude API Key is missing');
      const anthropic = createAnthropic({ apiKey });
      return anthropic(modelName || 'claude-3-5-sonnet-latest');
    }

    if (provider === 'deepseek') {
      const apiKey = customKey || process.env.DEEPSEEK_API_KEY;
      if (!apiKey) throw new Error('DeepSeek API Key is missing');
      const deepseek = createOpenAI({
        apiKey,
        baseURL: customUrl || 'https://api.deepseek.com/v1',
      });
      return deepseek(modelName || 'deepseek-chat');
    }

    if (provider === 'custom' || provider === 'ollama') {
      const apiKey = customKey || 'ollama';
      const baseURL = customUrl || 'http://localhost:11434/v1';
      const customOpenAI = createOpenAI({
        apiKey,
        baseURL,
      });
      return customOpenAI(modelName || 'llama3');
    }

    // Default fallback
    throw new Error(`Unsupported AI Provider: ${provider}`);
  }
}

