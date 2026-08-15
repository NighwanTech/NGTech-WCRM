export interface IRetrievalProvider<T = any> {
  providerName: string
  retrieveKnowledge(accountId: string, query?: string, campaignId?: string): Promise<T | null>
}
