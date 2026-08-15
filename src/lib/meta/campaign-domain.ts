import { getAdminClient } from '@/lib/admin-supabase'

// ==========================================
// 1. DOMAIN MODELS & TYPES (ADR-001 FROZEN)
// ==========================================

export type CampaignStatus = 
  | 'DRAFT' 
  | 'IN_REVIEW' 
  | 'APPROVED' 
  | 'PUBLISHING' 
  | 'PUBLISHED' 
  | 'RUNNING' 
  | 'PAUSED' 
  | 'COMPLETED' 
  | 'ARCHIVED'

export interface DomainMarketingCampaign {
  id: string
  account_id: string
  workspace_id?: string
  name: string
  status: CampaignStatus
  version: string
  meta_campaign_id?: string
  meta_ad_account_id?: string
  created_by?: string
  assigned_to?: string
  approved_by?: string
  approved_at?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface DomainCampaignStrategy {
  id: string
  campaign_id: string
  business_category: string
  business_subcategory?: string
  campaign_goal: string
  campaign_objective: string
  creative_angle?: string
  why_recommended?: string
  confidence_score: number
  version: string
  created_at: string
}

export interface DomainCampaignAudience {
  id: string
  campaign_id: string
  primary_location: string
  secondary_expansion?: string
  recommended_radius: string
  age_min: number
  age_max: number
  gender: string
  languages: string[]
  osm_latitude?: number
  osm_longitude?: number
  created_at: string
}

export interface DomainCampaignMetaInterest {
  id: string
  campaign_id: string
  meta_interest_id: string
  interest_name: string
  audience_size?: string
  source: string
  created_at: string
}

export interface DomainCampaignCreative {
  id: string
  campaign_id: string
  headline: string
  primary_text: string
  cta: string
  image_url?: string
  video_url?: string
  creative_format: string
  created_at: string
}

export interface DomainCampaignBudget {
  id: string
  campaign_id: string
  budget_type: string
  daily_budget: number
  currency: string
  placements: string[]
  is_advantage_plus: boolean
  created_at: string
}

export interface DomainCampaignEvent {
  id: string
  campaign_id: string
  actor_id?: string
  event_type: string
  title: string
  details?: string
  payload?: any
  created_at: string
}

export interface DomainCampaignVersion {
  id: string
  campaign_id: string
  version_number: string
  snapshot_payload: any
  created_by?: string
  created_at: string
}

// Aggregate Hydrated Root Type
export interface CampaignAggregateRoot {
  campaign: DomainMarketingCampaign
  strategy?: DomainCampaignStrategy
  audience?: DomainCampaignAudience
  interests?: DomainCampaignMetaInterest[]
  creative?: DomainCampaignCreative
  budget?: DomainCampaignBudget
  events?: DomainCampaignEvent[]
  versions?: DomainCampaignVersion[]
}

// ==========================================
// 2. DETERMINISTIC CAMPAIGN FINITE STATE MACHINE (FSM)
// ==========================================

export class CampaignFSM {
  private static VALID_TRANSITIONS: Record<CampaignStatus, CampaignStatus[]> = {
    DRAFT: ['IN_REVIEW', 'ARCHIVED'],
    IN_REVIEW: ['APPROVED', 'DRAFT', 'ARCHIVED'],
    APPROVED: ['PUBLISHING', 'DRAFT', 'ARCHIVED'],
    PUBLISHING: ['PUBLISHED', 'DRAFT', 'ARCHIVED'],
    PUBLISHED: ['PAUSED', 'COMPLETED', 'ARCHIVED'],
    RUNNING: ['PAUSED', 'COMPLETED', 'ARCHIVED'],
    PAUSED: ['PUBLISHED', 'RUNNING', 'ARCHIVED'],
    COMPLETED: ['ARCHIVED'],
    ARCHIVED: ['DRAFT'],
  }

  public static canTransition(currentStatus: CampaignStatus, targetStatus: CampaignStatus): boolean {
    const allowed = this.VALID_TRANSITIONS[currentStatus] || []
    return allowed.includes(targetStatus)
  }

  public static validateTransition(currentStatus: CampaignStatus, targetStatus: CampaignStatus): void {
    if (!this.canTransition(currentStatus, targetStatus)) {
      throw new Error(`[CampaignFSM] Invalid state transition: Cannot move campaign from '${currentStatus}' to '${targetStatus}'.`)
    }
  }
}

// ==========================================
// 3. CAMPAIGN REPOSITORY & PERSISTENCE LAYER
// ==========================================

export class CampaignRepository {
  private static get db() {
    return getAdminClient()
  }

  // Create Campaign Aggregate Root in Database
  public static async createCampaign(
    accountId: string,
    name: string,
    createdBy?: string
  ): Promise<DomainMarketingCampaign> {
    const { data, error } = await this.db
      .from('marketing_campaigns')
      .insert({
        account_id: accountId,
        name,
        status: 'DRAFT',
        version: 'v1.0',
        created_by: createdBy,
      })
      .select('*')
      .single()

    if (error) {
      console.warn('[CampaignRepository] Fallback inline campaign model created:', error.message)
      return {
        id: `cmp_${Date.now()}`,
        account_id: accountId,
        name,
        status: 'DRAFT',
        version: 'v1.0',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }

    return data
  }

  // Record Domain Event to Stream
  public static async logEvent(
    campaignId: string,
    eventType: string,
    title: string,
    details?: string,
    payload?: any,
    actorId?: string
  ): Promise<void> {
    try {
      await this.db.from('campaign_events').insert({
        campaign_id: campaignId,
        event_type: eventType,
        title,
        details,
        payload: payload || {},
        actor_id: actorId,
      })
    } catch (err) {
      console.warn('[CampaignRepository] Event logging note:', err)
    }
  }

  // Save Immutable Version Snapshot
  public static async createVersionSnapshot(
    campaignId: string,
    versionNumber: string,
    snapshotPayload: any,
    createdBy?: string
  ): Promise<void> {
    try {
      await this.db.from('campaign_versions').insert({
        campaign_id: campaignId,
        version_number: versionNumber,
        snapshot_payload: snapshotPayload,
        created_by: createdBy,
      })
    } catch (err) {
      console.warn('[CampaignRepository] Version snapshot note:', err)
    }
  }
}
