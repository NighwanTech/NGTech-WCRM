/**
 * AIWCRM Multi-Provider Voice AI Platform — Types
 *
 * AIWCRM owns the orchestration, CRM intelligence, analytics, and cost
 * governance. Voice providers (Retell, ElevenLabs, Bland, Vapi) are
 * interchangeable adapters that only provide speech + telephony.
 */

// ─── Provider Registry ────────────────────────────────────────────────────────

export type VoiceProvider = 'retell' | 'elevenlabs' | 'bland' | 'vapi';

export const VOICE_PROVIDER_LABELS: Record<VoiceProvider, string> = {
  retell:      'Retell AI',
  elevenlabs:  'ElevenLabs',
  bland:       'Bland AI',
  vapi:        'Vapi',
};

export const COMING_SOON_PROVIDERS: VoiceProvider[] = ['bland', 'vapi'];

// ─── Provider Config (from voice_ai_provider_configs table) ──────────────────

export interface VoiceProviderConfig {
  id:              string;
  accountId:       string;
  provider:        VoiceProvider;
  apiKey:          string;          // decrypted
  agentId?:        string;
  phoneNumberId?:  string;
  voiceId?:        string;
  settingsJson:    Record<string, unknown>;
  isDefault:       boolean;
  isActive:        boolean;
  monthlyBudget?:  number;          // INR
  dailyCallLimit?: number;
  perUserLimit?:   number;
}

// ─── Call Request / Result ────────────────────────────────────────────────────

export interface VoiceCallRequest {
  toNumber:             string;
  contactName?:         string;
  contactId?:           string;
  accountId:            string;
  overrideSystemPrompt?: string;   // falls back to KB system prompt
  overrideVoiceId?:     string;
}

export interface VoiceCallResult {
  providerCallId: string;
  provider:       VoiceProvider;
  estimatedCostInr?: number;
}

// ─── Transcript ───────────────────────────────────────────────────────────────

export interface VoiceTranscript {
  speaker:   'ai' | 'human';
  text:      string;
  timestamp: number;  // unix ms
}

// ─── Available Voice Options ──────────────────────────────────────────────────

export interface VoiceOption {
  id:       string;
  name:     string;
  language: string;
  preview?: string;   // URL to audio sample
  gender?:  'male' | 'female' | 'neutral';
}

// ─── Post-Call CRM Intelligence ───────────────────────────────────────────────

export type CallSentiment = 'positive' | 'neutral' | 'negative';
export type OpportunityStage = 'cold' | 'warm' | 'hot' | 'closed';

export interface VoiceCallAnalysis {
  summary:          string;
  customerIntent:   string;
  sentiment:        CallSentiment;
  buyingSignals:    string[];
  objections:       string[];
  nextFollowupAt?:  Date;
  actionItems:      string[];
  aiLeadScore:      number;        // 0–100
  opportunityStage: OpportunityStage;
  aiRecommendation: string;
}

// ─── Provider Adapter Interface ───────────────────────────────────────────────

export interface VoiceProviderAdapter {
  readonly provider: VoiceProvider;

  /** Initiate an outbound phone call */
  createCall(
    config: VoiceProviderConfig,
    request: VoiceCallRequest,
    systemPrompt: string,
  ): Promise<VoiceCallResult>;

  /** Forcefully end an active call */
  endCall(config: VoiceProviderConfig, providerCallId: string): Promise<void>;

  /** Fetch the transcript of a completed call */
  getTranscript(
    config: VoiceProviderConfig,
    providerCallId: string,
  ): Promise<VoiceTranscript[]>;

  /** List voices available for this provider */
  listVoices(config: VoiceProviderConfig): Promise<VoiceOption[]>;

  /** Ping the provider API to verify credentials */
  healthCheck(config: VoiceProviderConfig): Promise<boolean>;

  /** Estimated cost in INR for a given call duration */
  estimateCost(durationSeconds: number): number;

  /** Verify the webhook signature from this provider */
  verifyWebhookSignature(
    rawBody: string,
    signature: string | null,
    apiKey: string,
  ): boolean;

  /** Parse a raw webhook payload into a normalized event */
  parseWebhookEvent(rawBody: string): VoiceWebhookEvent;
}

// ─── Webhook Event (normalized across providers) ──────────────────────────────

export type VoiceWebhookEventType =
  | 'call_started'
  | 'call_ended'
  | 'call_analyzed'
  | 'call_failed';

export interface VoiceWebhookEvent {
  type:           VoiceWebhookEventType;
  providerCallId: string;
  transcript?:    VoiceTranscript[];
  summary?:       string;
  sentiment?:     CallSentiment;
  durationSeconds?: number;
  recordingUrl?:  string;
  rawPayload:     unknown;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface VoiceAnalyticsMetrics {
  totalCalls:         number;
  connectedCalls:     number;
  connectedRate:      number;      // %
  avgDurationSeconds: number;
  aiResolutionRate:   number;      // %
  humanHandoffRate:   number;      // %
  totalCostInr:       number;
  costPerCall:        number;
  sentimentBreakdown: Record<CallSentiment, number>;
  languagesUsed:      Record<string, number>;
  revenueFromCalls:   number;      // INR, from linked deals
}

// ─── Cost Governance ──────────────────────────────────────────────────────────

export interface CostCheckResult {
  allowed:   boolean;
  reason?:   string;
  remaining?: {
    monthlyBudgetInr?: number;
    dailyCallsLeft?:   number;
    userCallsLeft?:    number;
  };
}
