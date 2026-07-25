import { createClient } from '@/lib/supabase/server';

export interface LogAIUsageParams {
  accountId: string;
  userId?: string;
  provider: string;
  model: string;
  feature?: string;
  promptTokens?: number;
  completionTokens?: number;
}

/**
 * Standard USD to INR (₹) exchange rate multiplier
 */
export const USD_TO_INR_RATE = 86.0;

/**
 * Model pricing per 1 million tokens (USD)
 */
const MODEL_PRICING: Record<string, { prompt: number; completion: number }> = {
  // OpenAI
  'gpt-4o': { prompt: 2.5, completion: 10.0 },
  'gpt-4o-mini': { prompt: 0.15, completion: 0.6 },
  'o1-mini': { prompt: 1.1, completion: 4.4 },
  'o3-mini': { prompt: 1.1, completion: 4.4 },
  'gpt-4-turbo': { prompt: 10.0, completion: 30.0 },
  // Gemini
  'gemini-1.5-pro': { prompt: 1.25, completion: 5.0 },
  'gemini-1.5-flash': { prompt: 0.075, completion: 0.3 },
  'gemini-2.0-flash': { prompt: 0.1, completion: 0.4 },
  // Claude
  'claude-3-5-sonnet-latest': { prompt: 3.0, completion: 15.0 },
  'claude-3-5-haiku-latest': { prompt: 0.8, completion: 4.0 },
  'claude-3-opus-latest': { prompt: 15.0, completion: 75.0 },
  // Groq
  'llama-3.3-70b-versatile': { prompt: 0.59, completion: 0.79 },
  'llama-3.1-8b-instant': { prompt: 0.05, completion: 0.08 },
  'mixtral-8x7b-32768': { prompt: 0.24, completion: 0.24 },
  // DeepSeek
  'deepseek-chat': { prompt: 0.14, completion: 0.28 },
  'deepseek-reasoner': { prompt: 0.55, completion: 2.19 },
};

export class AIUsageService {
  /**
   * Log token usage & calculate estimated USD & INR (₹) costs
   */
  static async logUsage(params: LogAIUsageParams): Promise<void> {
    const {
      accountId,
      userId,
      provider,
      model,
      feature = 'general',
      promptTokens = 0,
      completionTokens = 0,
    } = params;

    if (!accountId) return;

    const totalTokens = promptTokens + completionTokens;
    const pricing = MODEL_PRICING[model] || { prompt: 0.5, completion: 1.5 };
    const costPrompt = (promptTokens / 1_000_000) * pricing.prompt;
    const costCompletion = (completionTokens / 1_000_000) * pricing.completion;
    const estimatedCostUsd = Number((costPrompt + costCompletion).toFixed(6));
    const estimatedCostInr = Number((estimatedCostUsd * USD_TO_INR_RATE).toFixed(4));

    try {
      const supabase = await createClient();
      await supabase.from('ai_usage_logs').insert({
        account_id: accountId,
        user_id: userId || null,
        provider,
        model,
        feature,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: totalTokens,
        estimated_cost_usd: estimatedCostUsd,
        estimated_cost_inr: estimatedCostInr,
      });
    } catch (err) {
      console.error('Failed to log AI usage:', err);
    }
  }

  /**
   * Utility helper to convert USD to formatted INR string (₹)
   */
  static formatINR(usdAmount: number): string {
    const inrAmount = usdAmount * USD_TO_INR_RATE;
    if (inrAmount < 0.01 && inrAmount > 0) {
      return `₹${inrAmount.toFixed(4)}`;
    }
    return `₹${inrAmount.toFixed(2)}`;
  }
}
