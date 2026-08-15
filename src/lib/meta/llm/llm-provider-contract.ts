export interface LLMResponse {
  content: string
  intent?: string
  toolCall?: { toolId: string; payload: any }
  reasoningSteps?: string[]
}

export interface ILLMProvider {
  providerName: string
  generateResponse(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>, contextPayload?: any): Promise<LLMResponse>
}
