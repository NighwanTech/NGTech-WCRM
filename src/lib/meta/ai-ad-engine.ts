import { generateObject, generateText } from 'ai'
import { z } from 'zod'
import { AIProviderService } from '@/lib/services/ai/provider.service'
import { supabaseAdmin } from '@/lib/flows/admin-client'

// ─── Tenant AI Model Resolution ────────────────────────────────────────────────

interface TenantAIConfig {
  provider: string
  model: string
  apiKey?: string
  baseUrl?: string
}

/**
 * Resolves the active AI provider, model, API key, and base URL configured in the
 * tenant's AI Assistant settings (`ai_assistant_settings`).
 * Falls back to Gemini Flash if no settings are found.
 */
export async function getTenantAIModel(accountId: string): Promise<TenantAIConfig> {
  try {
    const db = supabaseAdmin()
    const { data } = await db
      .from('ai_assistant_settings')
      .select('provider, model, custom_api_key_encrypted, custom_base_url')
      .eq('account_id', accountId)
      .maybeSingle()

    return {
      provider: data?.provider || 'gemini',
      model: data?.model || 'gemini-3.6-flash',
      apiKey: data?.custom_api_key_encrypted || undefined,
      baseUrl: data?.custom_base_url || undefined,
    }
  } catch {
    return { provider: 'gemini', model: 'gemini-3.6-flash' }
  }
}

/**
 * Helper to build an AI SDK model instance for the given account,
 * with automatic fallback if the configured provider fails.
 */
export function getModelForAccount(config: TenantAIConfig) {
  return AIProviderService.getModel(config.provider, config.model, {
    apiKey: config.apiKey,
    baseUrl: config.baseUrl,
  })
}

// ─── AI Ad Strategy Generation ─────────────────────────────────────────────────

export interface AIAdStrategyInput {
  businessName: string
  businessType: string
  location: string
  goal: string // 'whatsapp' | 'leads' | 'sales'
}

export interface AIAdStrategyOutput {
  suggestedObjective: string
  audience: {
    ageMin: number
    ageMax: number
    gender: 'ALL' | 'MEN' | 'WOMEN'
    interests: string[]
    location: string
  }
  headlines: string[]
  primaryTexts: string[]
  ctaOptions: string[]
  recommendedDailyBudget: number
}

/**
 * Generate complete AI Ad Strategy & Copy using the tenant's configured AI provider.
 * Falls back to a rule-based template if the LLM call fails.
 */
export async function generateAIAdStrategy(
  input: AIAdStrategyInput,
  accountId?: string
): Promise<AIAdStrategyOutput> {
  const { businessName, businessType, location, goal } = input

  const prompt = `
You are an expert Meta Ads Performance Marketer and Copywriter for WhatsApp CRM.
Generate a high-converting Facebook/Instagram Ad Campaign Strategy for:
Business Name: ${businessName}
Business Category: ${businessType}
Target Location: ${location}
Primary Campaign Goal: ${goal}

Generate:
1. Best Meta Campaign Objective (e.g. OUTCOME_LEADS, OUTCOME_ENGAGEMENT, OUTCOME_SALES)
2. Target Audience Demographics:
   - Age Min & Age Max
   - Target Gender (ALL, MEN, WOMEN)
   - 4-5 High-intent Meta Interest Keywords
3. Copy Variations:
   - 3 punchy, high-CTR Headlines (max 40 chars each with emojis)
   - 3 persuasive, benefit-driven Primary Text options (with bullet points and emojis)
   - 2 Call-To-Action options (e.g. "Send WhatsApp Message", "Learn More", "Apply Now")
4. Recommended Daily Budget in INR (e.g., 500)
`

  try {
    const aiConfig = accountId
      ? await getTenantAIModel(accountId)
      : { provider: 'gemini', model: 'gemini-3.6-flash' }

    const model = getModelForAccount(aiConfig)

    const { object } = await generateObject({
      model,
      schema: z.object({
        suggestedObjective: z.string(),
        audience: z.object({
          ageMin: z.number().default(21),
          ageMax: z.number().default(50),
          gender: z.enum(['ALL', 'MEN', 'WOMEN']).default('ALL'),
          interests: z.array(z.string()),
          location: z.string(),
        }),
        headlines: z.array(z.string()).length(3),
        primaryTexts: z.array(z.string()).length(3),
        ctaOptions: z.array(z.string()),
        recommendedDailyBudget: z.number().default(500),
      }),
      prompt,
    })

    return object
  } catch (error) {
    console.warn('[AI Ad Engine] LLM call failed, using rule-based fallback:', error)
    return buildFallbackStrategy(input)
  }
}

// ─── AI Insights Generation ────────────────────────────────────────────────────

export interface CampaignTelemetry {
  campaignName: string
  spend: number
  impressions: number
  clicks: number
  leads: number
  cpl: number
  ctr: number
  roas: number
}

export interface AIInsight {
  type: 'opportunity' | 'warning' | 'suggestion'
  title: string
  description: string
  actionLabel?: string
  actionPayload?: Record<string, unknown>
}

/**
 * Generate dynamic AI optimization insights for active campaigns using
 * the tenant's configured AI provider.
 */
export async function generateAIInsights(
  accountId: string,
  campaigns: CampaignTelemetry[]
): Promise<AIInsight[]> {
  if (!campaigns.length) return []

  const telemetrySummary = campaigns
    .map(
      (c) =>
        `Campaign "${c.campaignName}": Spend ₹${c.spend}, CPL ₹${c.cpl.toFixed(2)}, CTR ${c.ctr.toFixed(2)}%, ROAS ${c.roas.toFixed(2)}x, ${c.leads} leads, ${c.impressions} impressions`
    )
    .join('\n')

  const prompt = `
You are an expert Meta Ads Optimization AI Copilot for a WhatsApp CRM platform.
Analyze the following live campaign performance metrics and generate 3 actionable optimization insights.

LIVE CAMPAIGN DATA:
${telemetrySummary}

For each insight, provide:
- type: "opportunity" (positive scaling action), "warning" (cost/performance alert), or "suggestion" (creative/audience tweak)
- title: Short action-oriented title (max 50 chars)
- description: 1-2 sentence explanation with specific data points and recommended action

Return exactly 3 insights ordered by priority (most impactful first).
`

  try {
    const aiConfig = await getTenantAIModel(accountId)
    const model = getModelForAccount(aiConfig)

    const { object } = await generateObject({
      model,
      schema: z.object({
        insights: z.array(
          z.object({
            type: z.enum(['opportunity', 'warning', 'suggestion']),
            title: z.string(),
            description: z.string(),
          })
        ),
      }),
      prompt,
    })

    return object.insights
  } catch (error) {
    console.warn('[AI Ad Engine] Insights LLM call failed, returning rule-based insights:', error)
    return buildFallbackInsights(campaigns)
  }
}

// ─── AI Audience Expansion ─────────────────────────────────────────────────────

/**
 * Suggest audience expansion keywords based on current campaign performance.
 */
export async function suggestAudienceExpansion(
  accountId: string,
  currentInterests: string[],
  businessType: string
): Promise<string[]> {
  const prompt = `
You are a Meta Ads audience targeting expert. Given the current interest keywords and business type,
suggest 5 new high-intent interest keywords that could expand the target audience while maintaining quality.

Current interests: ${currentInterests.join(', ')}
Business type: ${businessType}

Return exactly 5 new interest keyword strings. Do not repeat existing keywords.
`

  try {
    const aiConfig = await getTenantAIModel(accountId)
    const model = getModelForAccount(aiConfig)

    const { object } = await generateObject({
      model,
      schema: z.object({
        keywords: z.array(z.string()).length(5),
      }),
      prompt,
    })

    return object.keywords
  } catch {
    return [`${businessType} Tools`, 'Digital Marketing', 'Business Automation', 'Entrepreneurs', 'Small Business']
  }
}

// ─── AI Performance Forecasting ────────────────────────────────────────────────

export interface PerformanceForecast {
  estimatedLeads7d: number
  estimatedSpend7d: number
  estimatedCPL7d: number
  estimatedROAS7d: number
  confidence: 'high' | 'medium' | 'low'
  rationale: string
}

/**
 * Forecast 7-day campaign performance based on current trends.
 */
export async function forecastAdPerformance(
  accountId: string,
  campaigns: CampaignTelemetry[]
): Promise<PerformanceForecast> {
  if (!campaigns.length) {
    return {
      estimatedLeads7d: 0,
      estimatedSpend7d: 0,
      estimatedCPL7d: 0,
      estimatedROAS7d: 0,
      confidence: 'low',
      rationale: 'No active campaigns to forecast.',
    }
  }

  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0)
  const totalLeads = campaigns.reduce((s, c) => s + c.leads, 0)
  const avgCPL = totalLeads > 0 ? totalSpend / totalLeads : 0
  const avgROAS = campaigns.reduce((s, c) => s + c.roas, 0) / campaigns.length

  const telemetrySummary = campaigns
    .map(
      (c) =>
        `"${c.campaignName}": ₹${c.spend} spend, ${c.leads} leads, CPL ₹${c.cpl.toFixed(2)}, ROAS ${c.roas.toFixed(2)}x`
    )
    .join('\n')

  const prompt = `
You are a Meta Ads performance forecasting AI. Based on current campaign data, predict the next 7-day performance.

CURRENT PERFORMANCE (last period):
${telemetrySummary}

Total Spend: ₹${totalSpend}, Total Leads: ${totalLeads}, Avg CPL: ₹${avgCPL.toFixed(2)}, Avg ROAS: ${avgROAS.toFixed(2)}x

Predict:
- estimatedLeads7d: number of leads expected in next 7 days
- estimatedSpend7d: estimated ad spend in INR
- estimatedCPL7d: estimated cost per lead in INR
- estimatedROAS7d: estimated return on ad spend multiplier
- confidence: "high", "medium", or "low"
- rationale: 1 sentence explaining the prediction logic
`

  try {
    const aiConfig = await getTenantAIModel(accountId)
    const model = getModelForAccount(aiConfig)

    const { object } = await generateObject({
      model,
      schema: z.object({
        estimatedLeads7d: z.number(),
        estimatedSpend7d: z.number(),
        estimatedCPL7d: z.number(),
        estimatedROAS7d: z.number(),
        confidence: z.enum(['high', 'medium', 'low']),
        rationale: z.string(),
      }),
      prompt,
    })

    return object
  } catch {
    // Rule-based linear projection fallback
    return {
      estimatedLeads7d: Math.round(totalLeads * 7),
      estimatedSpend7d: Math.round(totalSpend * 7),
      estimatedCPL7d: avgCPL,
      estimatedROAS7d: avgROAS,
      confidence: 'low',
      rationale: 'Linear projection based on current daily averages (AI provider unavailable).',
    }
  }
}

// ─── Fallback Strategies (Rule-Based) ──────────────────────────────────────────

function buildFallbackStrategy(input: AIAdStrategyInput): AIAdStrategyOutput {
  const { businessName, businessType, location, goal } = input
  return {
    suggestedObjective: goal === 'whatsapp' ? 'OUTCOME_ENGAGEMENT' : 'OUTCOME_LEADS',
    audience: {
      ageMin: 22,
      ageMax: 48,
      gender: 'ALL',
      interests: [`${businessType}`, 'Business Owners', 'Digital Marketing', 'Entrepreneurs'],
      location: location || 'India',
    },
    headlines: [
      `🔥 Grow ${businessName} with AI Automation`,
      `🚀 Instant Leads & WhatsApp Sales for ${businessName}`,
      `⚡ Get 3x More Customers for ${businessName}`,
    ],
    primaryTexts: [
      `Transform your sales process with ${businessName}! 🚀\n\n✅ 24/7 Automated WhatsApp Auto-Replies\n✅ Capture High-Intent Leads Instantly\n✅ Zero Setup Friction\n\n👉 Click below to chat with us on WhatsApp now!`,
      `Looking to scale ${businessType}? We've got you covered! 💥\n\n🎯 Targeted High-Quality Leads\n📊 Real-Time Analytics & Tracking\n💬 Automated Conversation Workflows\n\nGet started today! Click below ⬇️`,
      `Stop wasting ad budget! Try ${businessName} for maximum ROI. 📈\n\n• Instant Lead Response\n• Seamless CRM Automation\n• Boost Conversions by up to 300%\n\nTap below to connect instantly on WhatsApp!`,
    ],
    ctaOptions: ['Send WhatsApp Message', 'Learn More', 'Contact Us'],
    recommendedDailyBudget: 500,
  }
}

function buildFallbackInsights(campaigns: CampaignTelemetry[]): AIInsight[] {
  const insights: AIInsight[] = []
  const highCPL = campaigns.filter((c) => c.cpl > 150)
  const lowCTR = campaigns.filter((c) => c.ctr < 1.0)
  const highROAS = campaigns.filter((c) => c.roas > 3.0)

  if (highROAS.length > 0) {
    insights.push({
      type: 'opportunity',
      title: `Scale Budget on ${highROAS[0].campaignName}`,
      description: `ROAS at ${highROAS[0].roas.toFixed(2)}x is above target. Consider increasing daily budget by 20-30% to capture more leads.`,
    })
  }

  if (highCPL.length > 0) {
    insights.push({
      type: 'warning',
      title: `High CPL Alert: ${highCPL[0].campaignName}`,
      description: `Cost per Lead reached ₹${highCPL[0].cpl.toFixed(2)}. Review ad creative and audience targeting to reduce acquisition cost.`,
    })
  }

  if (lowCTR.length > 0) {
    insights.push({
      type: 'suggestion',
      title: `Improve CTR on ${lowCTR[0].campaignName}`,
      description: `CTR at ${lowCTR[0].ctr.toFixed(2)}% is below the 1% benchmark. Consider testing new headline variations or updating creative media.`,
    })
  }

  // Ensure we always return at least 1 insight
  if (insights.length === 0) {
    insights.push({
      type: 'suggestion',
      title: 'Audience Expansion Opportunity',
      description: 'Adding interest-based targeting keywords related to your business category could decrease CPC by an estimated 10-15%.',
    })
  }

  return insights
}
