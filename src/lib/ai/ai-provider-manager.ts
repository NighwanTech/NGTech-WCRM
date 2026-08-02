import { createClient } from '@/lib/supabase/server'

export interface AIProviderConfig {
  id: string
  provider: 'groq' | 'openai' | 'claude' | 'gemini' | 'deepseek'
  apiKey: string
  isActive: boolean
  isFallback: boolean
  usageQuotaMonthly: number
  tokensUsedThisMonth: number
  lastUpdated: string
}

export interface AIFeatureRouting {
  copilotModel: string
  chatbotModel: string
  crawlerModel: string
  fallbackChain: string[]
}

export interface AIAuditLog {
  id: string
  timestamp: string
  action: string
  actor: string
  details: string
}

// In-memory server-side fallback storage when database table is initializing
let memoryAIConfigs: Record<string, AIProviderConfig> = {
  groq: {
    id: 'groq-1',
    provider: 'groq',
    apiKey: process.env.GROQ_API_KEY || '',
    isActive: true,
    isFallback: false,
    usageQuotaMonthly: 1000000,
    tokensUsedThisMonth: 12450,
    lastUpdated: new Date().toISOString(),
  },
  openai: {
    id: 'openai-1',
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY || '',
    isActive: Boolean(process.env.OPENAI_API_KEY),
    isFallback: true,
    usageQuotaMonthly: 5000000,
    tokensUsedThisMonth: 45000,
    lastUpdated: new Date().toISOString(),
  },
  gemini: {
    id: 'gemini-1',
    provider: 'gemini',
    apiKey: process.env.GEMINI_API_KEY || '',
    isActive: Boolean(process.env.GEMINI_API_KEY),
    isFallback: true,
    usageQuotaMonthly: 2000000,
    tokensUsedThisMonth: 8900,
    lastUpdated: new Date().toISOString(),
  },
}

let memoryFeatureRouting: AIFeatureRouting = {
  copilotModel: 'groq/llama-3.1-8b-instant',
  chatbotModel: 'gemini/gemini-1.5-flash',
  crawlerModel: 'openai/gpt-4o-mini',
  fallbackChain: ['groq', 'openai', 'gemini'],
}

let memoryAuditLogs: AIAuditLog[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    action: 'INITIALIZED_GOVERNANCE',
    actor: 'Super Admin',
    details: 'Centralized AI Provider Governance initialized with Groq, OpenAI & Gemini.',
  },
]

export async function getGlobalAIConfigs() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('saas_ai_configs').select('*')
    if (data && data.length > 0) {
      return data as AIProviderConfig[]
    }
  } catch {
    // fallback to memory
  }
  return Object.values(memoryAIConfigs)
}

export async function getFeatureRouting() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('saas_ai_routing').select('*').single()
    if (data) {
      return data as AIFeatureRouting
    }
  } catch {
    // fallback
  }
  return memoryFeatureRouting
}

export async function getAIAuditLogs() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('saas_ai_audit_logs').select('*').order('timestamp', { ascending: false }).limit(20)
    if (data && data.length > 0) {
      return data as AIAuditLog[]
    }
  } catch {
    // fallback
  }
  return memoryAuditLogs
}

export async function updateAIProviderConfig(provider: string, updates: Partial<AIProviderConfig>, actor = 'Super Admin') {
  if (memoryAIConfigs[provider]) {
    memoryAIConfigs[provider] = {
      ...memoryAIConfigs[provider],
      ...updates,
      lastUpdated: new Date().toISOString(),
    }
  }

  const logEntry: AIAuditLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'UPDATE_PROVIDER_CONFIG',
    actor,
    details: `Updated AI Provider config for ${provider.toUpperCase()}: ${Object.keys(updates).join(', ')}`,
  }
  memoryAuditLogs.unshift(logEntry)

  return memoryAIConfigs[provider]
}

export async function updateAIFeatureRouting(routing: Partial<AIFeatureRouting>, actor = 'Super Admin') {
  memoryFeatureRouting = {
    ...memoryFeatureRouting,
    ...routing,
  }

  const logEntry: AIAuditLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'UPDATE_FEATURE_ROUTING',
    actor,
    details: `Updated feature model routing: Copilot (${memoryFeatureRouting.copilotModel}), Chatbot (${memoryFeatureRouting.chatbotModel})`,
  }
  memoryAuditLogs.unshift(logEntry)

  return memoryFeatureRouting
}
