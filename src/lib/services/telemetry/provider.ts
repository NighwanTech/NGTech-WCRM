import { createClient } from '@/lib/supabase/client'

export type TelemetryEventType = 'PAGE_VISIT' | 'SEARCH_EXECUTE' | 'FAVORITE_ADD' | 'MODULE_CLICK'

export interface TelemetryEvent {
  tenantId: string
  userId: string
  eventType: TelemetryEventType
  targetPath: string
  moduleId?: string
  latencyMs?: number
  metadata?: Record<string, any>
}

/**
 * Enterprise Telemetry Provider
 * Abstracts telemetry logging so that AIWCRM can swap Supabase for Mixpanel, PostHog, or Azure App Insights in the future without modifying UI logic.
 */
export class TelemetryProvider {
  /**
   * Logs an event asynchronously. Fire and forget.
   */
  static log(event: TelemetryEvent) {
    // We intentionally don't await this to prevent blocking UI rendering
    this._logToSupabase(event).catch(err => {
      console.warn('[TelemetryProvider] Failed to log event:', err)
    })
  }

  private static async _logToSupabase(event: TelemetryEvent) {
    const supabase = createClient()
    
    await supabase.from('navigation_telemetry_logs').insert({
      tenant_id: event.tenantId,
      user_id: event.userId,
      event_type: event.eventType,
      target_path: event.targetPath,
      module_id: event.moduleId,
      latency_ms: event.latencyMs,
      metadata: event.metadata || {}
    })
  }
}
