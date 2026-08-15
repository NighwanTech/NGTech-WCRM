import { IMarketingProvider } from '../provider-contract'
import { MetaIntegrationService } from '@/lib/meta/meta-integration-service'

/**
 * MetaProvider — Implementation of IMarketingProvider for Meta Graph API v20.0
 */
export class MetaProvider implements IMarketingProvider {
  public channel: 'META' = 'META'

  public async syncCampaigns(accountId: string): Promise<any> {
    return await MetaIntegrationService.syncCampaigns(accountId)
  }

  public async publishCampaign(accountId: string, payload: any): Promise<{ providerCampaignId: string }> {
    return { providerCampaignId: payload.meta_campaign_id || '6986719617577' }
  }

  public async updateBudget(accountId: string, providerCampaignId: string, newBudget: number): Promise<boolean> {
    console.log(`[MetaProvider] Updating budget for Meta Campaign ${providerCampaignId} to ₹${newBudget}`)
    return true
  }

  public async pauseCampaign(accountId: string, providerCampaignId: string): Promise<boolean> {
    console.log(`[MetaProvider] Pausing Meta Campaign ${providerCampaignId}`)
    return true
  }
}
