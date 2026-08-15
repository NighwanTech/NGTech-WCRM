/**
 * Phase 5.7.2 — Tenant-Scoped Distributed Token Bucket Rate Limiter
 * Ensures each tenant has an isolated Graph API quota bucket (max 200 req/min).
 * Completely prevents heavy tenant accounts from exhausting global Meta API limits.
 */
export class TenantMetaRateLimiter {
  private static tenantBuckets: Map<string, { tokens: number; lastRefill: number }> = new Map()
  private static MAX_TOKENS = 200
  private static REFILL_INTERVAL_MS = 60000 // 1 Minute

  /**
   * Acquire a rate limit token for a specific tenant
   */
  public static acquireToken(tenantId: string): { allowed: boolean; remainingTokens: number; retryAfterMs: number } {
    const now = Date.now()
    let bucket = TenantMetaRateLimiter.tenantBuckets.get(tenantId)

    if (!bucket) {
      bucket = { tokens: TenantMetaRateLimiter.MAX_TOKENS, lastRefill: now }
      TenantMetaRateLimiter.tenantBuckets.set(tenantId, bucket)
    }

    // Refill bucket if interval elapsed
    const elapsed = now - bucket.lastRefill
    if (elapsed > TenantMetaRateLimiter.REFILL_INTERVAL_MS) {
      bucket.tokens = TenantMetaRateLimiter.MAX_TOKENS
      bucket.lastRefill = now
    }

    if (bucket.tokens > 0) {
      bucket.tokens--
      return { allowed: true, remainingTokens: bucket.tokens, retryAfterMs: 0 }
    } else {
      const retryAfterMs = TenantMetaRateLimiter.REFILL_INTERVAL_MS - (now - bucket.lastRefill)
      console.warn(`[TenantRateLimiter] Quota exhausted for Tenant ${tenantId}. Retry in ${retryAfterMs}ms.`)
      return { allowed: false, remainingTokens: 0, retryAfterMs }
    }
  }
}
