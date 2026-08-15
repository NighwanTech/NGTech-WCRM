export interface IContextProvider<T = any> {
  providerName: string
  loadContext(accountId: string, campaignId?: string): Promise<T | null>
}
