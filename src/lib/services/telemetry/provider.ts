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
 */
export class TelemetryProvider {
  static log(event: TelemetryEvent) {
    this._logToSupabase(event).catch(() => {
      // Intentionally silent to prevent console noise on background telemetry
    })
  }

  private static async _logToSupabase(event: TelemetryEvent) {
    try {
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
    } catch {
      // Ignore background telemetry errors
    }
  }
}
