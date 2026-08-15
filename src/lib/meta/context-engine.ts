import { IContextProvider } from './providers/context-provider-contract'
import {
  CampaignContextProvider,
  AnalyticsContextProvider,
  CrmContextProvider,
  WhatsAppContextProvider,
  DecisionLedgerProvider,
  LearningProvider,
  SimulationProvider,
  PlaybookProvider,
  HealthProvider
} from './providers/all-context-providers'

/**
 * Enterprise ContextEngine — Assembles unified multi-source context in parallel
 */
export class ContextEngine {
  private providers: IContextProvider[] = []

  constructor() {
    // Automatic Dependency Injection Registration
    this.registerProvider(new CampaignContextProvider())
    this.registerProvider(new AnalyticsContextProvider())
    this.registerProvider(new CrmContextProvider())
    this.registerProvider(new WhatsAppContextProvider())
    this.registerProvider(new DecisionLedgerProvider())
    this.registerProvider(new LearningProvider())
    this.registerProvider(new SimulationProvider())
    this.registerProvider(new PlaybookProvider())
    this.registerProvider(new HealthProvider())
  }

  public registerProvider(provider: IContextProvider) {
    this.providers.push(provider)
  }

  public async assembleContext(accountId: string, campaignId?: string): Promise<Record<string, any>> {
    const contextMap: Record<string, any> = {}

    // Execute parallel context loading with partial failure tolerance
    await Promise.all(
      this.providers.map(async (provider) => {
        try {
          const res = await provider.loadContext(accountId, campaignId)
          contextMap[provider.providerName] = res
        } catch (err: any) {
          console.error(`[ContextEngine] Partial failure in provider ${provider.providerName}:`, err.message)
          contextMap[provider.providerName] = null
        }
      })
    )

    return contextMap
  }
}
