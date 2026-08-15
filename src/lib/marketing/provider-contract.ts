/**
 * Channel-Agnostic MarketingProvider Interface (Section 8 Architecture)
 * Abstracts Meta Ads, Google Ads, LinkedIn Ads, TikTok Ads under a single interface.
 */
export interface ProviderCampaign {
  id: string
  name: string
  status: string
  budget: number
  channel: 'META' | 'GOOGLE_ADS' | 'LINKEDIN' | 'TIKTOK'
}

export interface IMarketingProvider {
  channel: 'META' | 'GOOGLE_ADS' | 'LINKEDIN' | 'TIKTOK'
  syncCampaigns(accountId: string): Promise<any>
  publishCampaign(accountId: string, payload: any): Promise<{ providerCampaignId: string }>
  updateBudget(accountId: string, providerCampaignId: string, newBudget: number): Promise<boolean>
  pauseCampaign(accountId: string, providerCampaignId: string): Promise<boolean>
}
