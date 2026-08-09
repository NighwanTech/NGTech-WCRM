import { getAdminClient } from '@/lib/admin-supabase'
import crypto from 'node:crypto'

export type AuditSeverity = 'low' | 'medium' | 'high' | 'critical'

const SEVERITY_MAP: Record<string, AuditSeverity> = {
  'login.success': 'low',
  'login.failed': 'medium',
  'login.lockout': 'critical',
  'contact.create': 'low',
  'contact.update': 'low',
  'contact.delete': 'medium',
  'contact.bulk_delete': 'high',
  'contact.export': 'high',
  'sequence.create': 'low',
  'sequence.delete': 'medium',
  'broadcast.launch': 'medium',
  'api_key.create': 'high',
  'api_key.revoke': 'high',
  'role.change': 'high',
  'account.suspend': 'critical',
  'settings.update': 'medium',
  'csp.violation': 'medium',
}

export interface LogAuditOptions {
  action: string
  accountId?: string | null
  userId?: string | null
  resourceType?: string
  resourceId?: string
  changes?: { before?: any; after?: any }
  severity?: AuditSeverity
  request?: Request
  metadata?: Record<string, any>
}

/**
 * Log a structured audit event to the `audit_logs` table with SHA-256 Hash Chaining.
 */
export async function logAudit(options: LogAuditOptions): Promise<void> {
  try {
    const admin = getAdminClient()
    const severity = options.severity || SEVERITY_MAP[options.action] || 'low'

    let ip: string | null = null
    let userAgent: string | null = null

    if (options.request) {
      ip =
        options.request.headers.get('x-forwarded-for')?.split(',')[0] ||
        options.request.headers.get('x-real-ip') ||
        null
      userAgent = options.request.headers.get('user-agent') || null
    }

    // 1. Fetch previous record's current_hash for hash chaining
    let prevHash = 'GENESIS_HASH_00000000000000000000000000000000000000000000000000000000'
    const { data: lastLog } = await admin
      .from('audit_logs')
      .select('current_hash')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (lastLog?.current_hash) {
      prevHash = lastLog.current_hash
    }

    const timestamp = new Date().toISOString()
    const payloadToHash = `${prevHash}|${options.accountId || ''}|${options.userId || ''}|${options.action}|${timestamp}|${JSON.stringify(options.changes || {})}`
    const currentHash = crypto.createHash('sha256').update(payloadToHash).digest('hex')

    await admin.from('audit_logs').insert({
      account_id: options.accountId || null,
      user_id: options.userId || null,
      action: options.action,
      resource_type: options.resourceType || null,
      resource_id: options.resourceId || null,
      severity,
      changes: options.changes || null,
      ip_address: ip,
      user_agent: userAgent,
      metadata: options.metadata || null,
      prev_hash: prevHash,
      current_hash: currentHash,
      created_at: timestamp,
    })

    if (severity === 'critical') {
      console.warn(`[AUDIT ALERT - CRITICAL] ${options.action} by User ${options.userId} in Account ${options.accountId}`)
    }
  } catch (err) {
    console.error('[logAudit] Failed to insert audit log:', err)
  }
}

/**
 * Verifies the cryptographic hash-chain integrity of audit logs for an account.
 * Returns true if chain is un-tampered, false if tampering is detected.
 */
export async function verifyAuditChain(accountId?: string): Promise<{ valid: boolean; total: number; tamperedAtId?: string }> {
  try {
    const admin = getAdminClient()
    let query = admin.from('audit_logs').select('id, prev_hash, current_hash, account_id, user_id, action, created_at, changes').order('created_at', { ascending: true })

    if (accountId) {
      query = query.eq('account_id', accountId)
    }

    const { data: logs } = await query

    if (!logs || logs.length === 0) return { valid: true, total: 0 }

    for (let i = 0; i < logs.length; i++) {
      const log = logs[i]
      const expectedPrevHash = i === 0 ? log.prev_hash : logs[i - 1].current_hash

      const payload = `${log.prev_hash}|${log.account_id || ''}|${log.user_id || ''}|${log.action}|${log.created_at}|${JSON.stringify(log.changes || {})}`
      const calculatedHash = crypto.createHash('sha256').update(payload).digest('hex')

      if (log.prev_hash !== expectedPrevHash || log.current_hash !== calculatedHash) {
        return { valid: false, total: logs.length, tamperedAtId: log.id }
      }
    }

    return { valid: true, total: logs.length }
  } catch (err) {
    console.error('[verifyAuditChain] Integrity check failed:', err)
    return { valid: false, total: 0 }
  }
}
