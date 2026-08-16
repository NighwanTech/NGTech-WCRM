/**
 * AIWCRM Enterprise Revenue OS — AI Provider Management Engine
 * Multi-LLM provider SDK manager supporting OpenAI, Gemini, Claude, DeepSeek, Groq, Azure OpenAI, OpenRouter, and Ollama.
 */

export type AIProviderId =
  | 'openai'
  | 'gemini'
  | 'claude'
  | 'deepseek'
  | 'groq'
  | 'azure'
  | 'openrouter'
  | 'ollama'

export interface AIProviderConfig {
  id: AIProviderId
  name: string
  modelName: string
  isActive: boolean
  isDefault: boolean
  apiKeyConfigured: boolean
}

export class AIProviderManager {
  private static providers: Map<AIProviderId, AIProviderConfig> = new Map([
    ['gemini', { id: 'gemini', name: 'Google Gemini 1.5 Pro', modelName: 'gemini-1.5-pro', isActive: true, isDefault: true, apiKeyConfigured: true }],
    ['openai', { id: 'openai', name: 'OpenAI GPT-4o', modelName: 'gpt-4o', isActive: true, isDefault: false, apiKeyConfigured: true }],
    ['claude', { id: 'claude', name: 'Anthropic Claude 3.5 Sonnet', modelName: 'claude-3-5-sonnet', isActive: true, isDefault: false, apiKeyConfigured: true }],
    ['deepseek', { id: 'deepseek', name: 'DeepSeek V3 / R1', modelName: 'deepseek-chat', isActive: true, isDefault: false, apiKeyConfigured: true }],
    ['groq', { id: 'groq', name: 'Groq Llama 3.3 70B', modelName: 'llama-3.3-70b-versatile', isActive: true, isDefault: false, apiKeyConfigured: false }],
    ['azure', { id: 'azure', name: 'Azure OpenAI Enterprise', modelName: 'gpt-4o-azure', isActive: false, isDefault: false, apiKeyConfigured: false }],
    ['openrouter', { id: 'openrouter', name: 'OpenRouter Multi-LLM', modelName: 'auto', isActive: true, isDefault: false, apiKeyConfigured: true }],
    ['ollama', { id: 'ollama', name: 'Ollama Local LLM', modelName: 'llama3:latest', isActive: false, isDefault: false, apiKeyConfigured: false }]
  ])

  public static getActiveProviders(): AIProviderConfig[] {
    return Array.from(this.providers.values()).filter(p => p.isActive)
  }

  public static getDefaultProvider(): AIProviderConfig {
    return this.providers.get('gemini') || Array.from(this.providers.values())[0]
  }

  public static setProviderStatus(id: AIProviderId, isActive: boolean): void {
    const p = this.providers.get(id)
    if (p) {
      p.isActive = isActive
    }
  }
}
