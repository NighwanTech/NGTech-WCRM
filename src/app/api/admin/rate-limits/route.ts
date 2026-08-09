import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { createClient } from '@/lib/supabase/server'
import { logAudit } from '@/lib/security/audit'
import { invalidateRateLimitCache } from '@/lib/security/rate-limit-governance-engine'

/**
 * GET /api/admin/rate-limits
 * Fetch all active, scheduled, and archived rate limit policies & defaults
 */
export async function GET(req: Request) {
  return withZeroTrustGuard(req, { permission: 'rate_limits:manage' }, async (ctx) => {
    const supabase = await createClient()

    const { data: policies, error } = await supabase
      .from('rate_limit_policies')
      .select('*')
      .eq('account_id', ctx.accountId)
      .order('priority_rank', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      policies: policies || [],
      defaultCategories: [
        { key: 'send', limit: 60, windowMs: 60000, description: 'Message Send' },
        { key: 'broadcast', limit: 5, windowMs: 60000, description: 'Broadcast Campaign Dispatch' },
        { key: 'react', limit: 120, windowMs: 60000, description: 'Reactions Add/Remove' },
        { key: 'invitationPeek', limit: 30, windowMs: 60000, description: 'Invitation Link Peek' },
        { key: 'invitationRedeem', limit: 10, windowMs: 60000, description: 'Invitation Redemption' },
        { key: 'adminAction', limit: 30, windowMs: 60000, description: 'Admin Operations' },
        { key: 'publicApi', limit: 120, windowMs: 60000, description: 'Public REST API (/api/v1/*)' },
      ],
    })
  })
}

/**
 * POST /api/admin/rate-limits
 * Create, Edit, Duplicate, Enable/Disable, or Rollback Rate Limit Policy
 */
export async function POST(req: Request) {
  return withZeroTrustGuard(req, { permission: 'rate_limits:manage' }, async (ctx) => {
    try {
      const body = await req.json()
      const { action = 'create', id, name, scopeLevel = 'workspace', targetRole, targetApiKeyId, targetIpRange, routePattern, httpMethods = ['*'], maxRequests, windowSeconds = 60, version = 1 } = body

      const supabase = await createClient()

      if (action === 'toggle_status') {
        const { data: existing } = await supabase.from('rate_limit_policies').select('status').eq('id', id).eq('account_id', ctx.accountId).single()
        const newStatus = existing?.status === 'active' ? 'disabled' : 'active'

        await supabase.from('rate_limit_policies').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', id).eq('account_id', ctx.accountId)

        invalidateRateLimitCache(ctx.accountId)
        return NextResponse.json({ success: true, status: newStatus })
      }

      if (action === 'delete') {
        await supabase.from('rate_limit_policies').delete().eq('id', id).eq('account_id', ctx.accountId)
        invalidateRateLimitCache(ctx.accountId)
        return NextResponse.json({ success: true })
      }

      if (action === 'duplicate') {
        const { data: source } = await supabase.from('rate_limit_policies').select('*').eq('id', id).eq('account_id', ctx.accountId).single()
        if (!source) return NextResponse.json({ error: 'Source policy not found' }, { status: 404 })

        const { data: newPolicy, error: dupErr } = await supabase.from('rate_limit_policies').insert({
          account_id: ctx.accountId,
          name: `${source.name} (Copy)`,
          scope_level: source.scope_level,
          target_role: source.target_role,
          target_api_key_id: source.target_api_key_id,
          target_ip_range: source.target_ip_range,
          route_pattern: source.route_pattern,
          http_methods: source.http_methods,
          max_requests: source.max_requests,
          window_seconds: source.window_seconds,
          status: 'active',
          priority_rank: source.priority_rank,
          created_by: ctx.userId,
        }).select().single()

        if (dupErr) return NextResponse.json({ error: dupErr.message }, { status: 500 })

        invalidateRateLimitCache(ctx.accountId)
        return NextResponse.json({ success: true, policy: newPolicy })
      }

      if (!name || !routePattern || !maxRequests) {
        return NextResponse.json({ error: 'Missing required policy fields (name, routePattern, maxRequests)' }, { status: 400 })
      }

      // Priority calculation by scope level
      const scopeRankMap: Record<string, number> = {
        emergency: 600,
        api_key: 500,
        role: 400,
        workspace: 300,
        plan: 200,
        global: 100,
      }
      const priorityRank = scopeRankMap[scopeLevel] || 300

      if (id) {
        // Edit existing policy
        const { data: updated, error: editErr } = await supabase
          .from('rate_limit_policies')
          .update({
            name,
            scope_level: scopeLevel,
            target_role: targetRole || null,
            target_api_key_id: targetApiKeyId || null,
            target_ip_range: targetIpRange || null,
            route_pattern: routePattern,
            http_methods: Array.isArray(httpMethods) ? httpMethods : [httpMethods],
            max_requests: Number(maxRequests),
            window_seconds: Number(windowSeconds),
            priority_rank: priorityRank,
            version: version + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .eq('account_id', ctx.accountId)
          .select()
          .single()

        if (editErr) return NextResponse.json({ error: editErr.message }, { status: 500 })

        // Insert version snapshot
        try {
          await supabase.from('rate_limit_policy_versions').insert({
            policy_id: id,
            version: version + 1,
            payload: updated,
            changed_by: ctx.userId,
          })
        } catch (_) {}

        invalidateRateLimitCache(ctx.accountId)

        await logAudit({
          action: 'rate_limit_policy_updated',
          accountId: ctx.accountId,
          userId: ctx.userId,
          severity: 'medium',
          request: req,
          metadata: { policyId: id, name, maxRequests, windowSeconds },
        })

        return NextResponse.json({ success: true, policy: updated })
      }

      // Create new policy
      const { data: created, error: createErr } = await supabase
        .from('rate_limit_policies')
        .insert({
          account_id: ctx.accountId,
          name,
          scope_level: scopeLevel,
          target_role: targetRole || null,
          target_api_key_id: targetApiKeyId || null,
          target_ip_range: targetIpRange || null,
          route_pattern: routePattern,
          http_methods: Array.isArray(httpMethods) ? httpMethods : [httpMethods],
          max_requests: Number(maxRequests),
          window_seconds: Number(windowSeconds),
          status: 'active',
          priority_rank: priorityRank,
          version: 1,
          created_by: ctx.userId,
        })
        .select()
        .single()

      if (createErr) return NextResponse.json({ error: createErr.message }, { status: 500 })

      try {
        await supabase.from('rate_limit_policy_versions').insert({
          policy_id: created.id,
          version: 1,
          payload: created,
          changed_by: ctx.userId,
        })
      } catch (_) {}

      invalidateRateLimitCache(ctx.accountId)

      await logAudit({
        action: 'rate_limit_policy_created',
        accountId: ctx.accountId,
        userId: ctx.userId,
        severity: 'high',
        request: req,
        metadata: { policyId: created.id, name, scopeLevel, routePattern },
      })

      return NextResponse.json({ success: true, policy: created })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}
