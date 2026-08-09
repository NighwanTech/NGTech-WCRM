import { getPrometheusMetricsText } from '@/lib/security/webhook-ops-engine'

/**
 * GET /api/admin/webhooks/metrics/prometheus
 * OpenTelemetry & Prometheus Compatible Metrics Text Endpoint for Datadog / Grafana
 */
export async function GET() {
  const metricsText = getPrometheusMetricsText()
  return new Response(metricsText, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
    },
  })
}
