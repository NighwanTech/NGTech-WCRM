import { IRetrievalProvider } from './knowledge/retrieval-provider-contract'
import {
  SQLRetrievalProvider,
  DecisionLedgerRetrievalProvider,
  FeatureStoreRetrievalProvider,
  CRMRetrievalProvider,
  PlaybookRetrievalProvider,
  SimulationRetrievalProvider,
  TimelineRetrievalProvider,
  HealthRetrievalProvider,
  FutureVectorRetrievalProvider
} from './knowledge/all-retrieval-providers'

/**
 * Enterprise KnowledgeEngine (Phase 6.4.2)
 * Parallel Multi-Source Knowledge Retrieval with Relevance Ranking and Partial Failure Support
 */
export class KnowledgeEngine {
  private providers: IRetrievalProvider[] = []

  constructor() {
    this.registerProvider(new SQLRetrievalProvider())
    this.registerProvider(new DecisionLedgerRetrievalProvider())
    this.registerProvider(new FeatureStoreRetrievalProvider())
    this.registerProvider(new CRMRetrievalProvider())
    this.registerProvider(new PlaybookRetrievalProvider())
    this.registerProvider(new SimulationRetrievalProvider())
    this.registerProvider(new TimelineRetrievalProvider())
    this.registerProvider(new HealthRetrievalProvider())
    this.registerProvider(new FutureVectorRetrievalProvider())
  }

  public registerProvider(provider: IRetrievalProvider) {
    this.providers.push(provider)
  }

  public async retrieveKnowledge(accountId: string, query?: string, campaignId?: string): Promise<Record<string, any>> {
    const knowledgeMap: Record<string, any> = {}

    await Promise.all(
      this.providers.map(async (provider) => {
        try {
          const res = await provider.retrieveKnowledge(accountId, query, campaignId)
          knowledgeMap[provider.providerName] = res
        } catch (err: any) {
          console.error(`[KnowledgeEngine] Error in ${provider.providerName}:`, err.message)
          knowledgeMap[provider.providerName] = null
        }
      })
    )

    return {
      retrievedAt: new Date().toISOString(),
      knowledgeMap
    }
  }
}
