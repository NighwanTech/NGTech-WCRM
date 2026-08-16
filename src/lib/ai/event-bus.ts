/**
 * AIWCRM Enterprise Revenue OS — Universal Event Bus
 * Facilitates event-driven loose coupling between Intake, CRM, AI, WhatsApp, Decision Center & Analytics.
 */

export type RevenueEventType =
  | 'LEAD_CREATED'
  | 'AI_QUALIFIED'
  | 'WHATSAPP_SENT'
  | 'CUSTOMER_REPLIED'
  | 'AI_REPLIED'
  | 'SALES_ASSIGNED'
  | 'QUOTATION_GENERATED'
  | 'QUOTATION_SENT'
  | 'INVOICE_PAID'
  | 'DEAL_CLOSED_WON'
  | 'DEAL_CLOSED_LOST'

export interface RevenueEventPayload {
  eventId: string
  eventType: RevenueEventType
  accountId: string
  contactId?: string
  leadId?: string
  campaignId?: string
  adsetId?: string
  adId?: string
  payload: Record<string, any>
  timestamp: string
}

export type EventListenerCallback = (event: RevenueEventPayload) => Promise<void> | void

class UniversalEventBus {
  private listeners: Map<RevenueEventType, Set<EventListenerCallback>> = new Map()

  /**
   * Subscribe to a Revenue OS Event
   */
  public subscribe(eventType: RevenueEventType, callback: EventListenerCallback): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }
    this.listeners.get(eventType)!.add(callback)

    return () => {
      this.listeners.get(eventType)?.delete(callback)
    }
  }

  /**
   * Emit a Revenue OS Event
   */
  public async emit(event: Omit<RevenueEventPayload, 'eventId' | 'timestamp'>): Promise<RevenueEventPayload> {
    const fullEvent: RevenueEventPayload = {
      ...event,
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString()
    }

    const eventListeners = this.listeners.get(event.eventType)
    if (eventListeners && eventListeners.size > 0) {
      const promises = Array.from(eventListeners).map(fn => {
        try {
          return Promise.resolve(fn(fullEvent))
        } catch (err) {
          console.error(`[EventBus] Error processing listener for ${event.eventType}:`, err)
          return Promise.resolve()
        }
      })
      await Promise.all(promises)
    }

    return fullEvent
  }
}

export const eventBus = new UniversalEventBus()
