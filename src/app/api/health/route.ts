import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/admin-supabase'
import { verifyAuditChain } from '@/lib/security/audit'

export async function GET() {
  const startTime = Date.now()
  const checks: Record<string, any> = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {},
  }

  try {
    // 1. Check PostgreSQL DB connection
    const admin = getAdminClient()
    const dbStart = Date.now()
    const { error: dbErr } = await admin.from('profiles').select('id', { count: 'exact', head: true }).limit(1)
    const dbLatency = Date.now() - dbStart

    checks.services.database = {
      status: dbErr ? 'unhealthy' : 'operational',
      latencyMs: dbLatency,
      error: dbErr?.message,
    }

    // 2. Audit Chain Verification
    const auditChain = await verifyAuditChain()
    checks.services.auditChain = {
      status: auditChain.valid ? 'valid' : 'tampered',
      totalLogs: auditChain.total,
    }

    // Response status
    const isHealthy = !dbErr && auditChain.valid
    checks.status = isHealthy ? 'healthy' : 'degraded'
    checks.totalLatencyMs = Date.now() - startTime

    return NextResponse.json(checks, { status: isHealthy ? 200 : 503 })
  } catch (err: any) {
    checks.status = 'unhealthy'
    checks.error = err.message
    return NextResponse.json(checks, { status: 500 })
  }
}
