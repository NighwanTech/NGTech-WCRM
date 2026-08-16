export interface LLMResponse {
  content: string
  intent?: string
  toolCall?: { toolId: string; payload: any }
  reasoningSteps?: string[]
}

export interface LLMResponseChunk {
  type: 'reasoning' | 'tool_call' | 'tool_result' | 'token' | 'done'
  content?: string
  reasoningStep?: string
  toolCall?: { toolId: string; payload: any }
  toolResult?: any
  correlationId?: string
  fullResponse?: LLMResponse
}

export interface ILLMProvider {
  providerName: string
  generateResponse(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>, contextPayload?: any): Promise<LLMResponse>
  streamResponse?(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>, contextPayload?: any): AsyncGenerator<LLMResponseChunk, void, unknown>
}
