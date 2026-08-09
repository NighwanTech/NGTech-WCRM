import { generateText } from 'ai'
import { AIProviderService } from '../services/ai/provider.service'
import { LocalPreprocessor, RawMessage } from './local-preprocessor'

export interface CustomerVoiceInsight {
  category: 'INTENT' | 'OBJECTION' | 'COMPLAINT' | 'FEATURE_REQUEST' | 'COMPETITOR' | 'BUYING_SIGNAL' | 'PRODUCT_FEEDBACK' | 'SENTIMENT' | 'SALES_STAGE' | 'MARKET_TREND' | 'FAQ' | 'OTHER'
  summary: string
  confidence_score: number
  business_impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  estimated_revenue_opportunity: number
  recommended_action_type: 'CREATE_AD' | 'UPDATE_CHATBOT' | 'CREATE_FAQ' | 'UPDATE_LANDING_PAGE' | 'SALES_SCRIPT' | 'CRM_TASK' | 'NONE'
  actionable_recommendation: string
  sentiment_score: number
  conversation_count: number
}

const SYSTEM_PROMPT = `You are the Enterprise Customer Intelligence AI.
Your job is to analyze anonymized customer conversations across channels (WhatsApp, Web, etc.).

Analyze the provided batch of conversations. Identify recurring themes, strong buying signals, objections, competitor mentions, or major complaints.
Ignore trivial noise. Focus on high-value business insights.

For each trend, output a JSON object in an array exactly matching this structure:
{
  "category": "OBJECTION", // Must be one of the enum values
  "summary": "Short description of the trend",
  "confidence_score": 85, // 0-100
  "business_impact": "HIGH", // LOW, MEDIUM, HIGH, CRITICAL
  "estimated_revenue_opportunity": 1000.00, // Numeric estimate of potential revenue saved or gained
  "recommended_action_type": "UPDATE_CHATBOT", // The best AIWCRM module to handle this
  "actionable_recommendation": "Specific instruction for what to do (e.g., 'Add FAQ about pricing')",
  "sentiment_score": -0.5, // -1.0 (very negative) to 1.0 (very positive)
  "conversation_count": 5 // Approximate number of users exhibiting this trend
}

Return ONLY a raw JSON array of these objects. No markdown formatting, no backticks. If nothing valuable is found, return [].`

export class CustomerVoiceService {
  /**
   * Processes raw messages through the local PII scrubber, then sends to the AI Provider
   * to extract enterprise insights.
   */
  static async mineInsights(messages: RawMessage[], provider: string = 'gemini'): Promise<{ messageCount: number, insights: CustomerVoiceInsight[] }> {
    // 1. Privacy-First Local Scrubbing
    const batch = LocalPreprocessor.processMessages(messages)
    
    if (batch.messageCount === 0) {
      return { messageCount: 0, insights: [] }
    }

    // 2. Centralized AI Execution
    const model = AIProviderService.getModel(provider)
    
    const userPrompt = `Batch of anonymized transcripts:\n\n${batch.anonymizedText}`

    try {
      const { text } = await generateText({
        model,
        system: SYSTEM_PROMPT,
        prompt: userPrompt,
        temperature: 0.2
      })

      // Clean up markdown if the AI mistakenly wrapped it
      const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim()
      
      const insights: CustomerVoiceInsight[] = JSON.parse(cleaned)
      return { messageCount: batch.messageCount, insights }
    } catch (e) {
      console.error('Failed to parse AI Customer Voice response', e)
      return { messageCount: batch.messageCount, insights: [] }
    }
  }
}
