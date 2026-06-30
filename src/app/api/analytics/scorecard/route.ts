import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1. Fetch all members/profiles in this account
    // We get the account_id of the current user's profile first
    const { data: currentUserProfile, error: profileErr } = await supabase
      .from('profiles')
      .select('account_id')
      .eq('user_id', user.id)
      .single()

    if (profileErr || !currentUserProfile) {
      return NextResponse.json({ error: 'Account profile not found' }, { status: 404 })
    }

    const { account_id } = currentUserProfile

    // Fetch all profiles belonging to the same account
    const { data: profiles, error: profilesErr } = await supabase
      .from('profiles')
      .select('id, user_id, full_name, email, avatar_url, account_role')
      .eq('account_id', account_id)

    if (profilesErr || !profiles) {
      return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
    }

    // 2. Fetch conversation metrics for this account
    const { data: metrics, error: metricsErr } = await supabase
      .from('conversation_metrics')
      .select('*')
      .eq('account_id', account_id)

    if (metricsErr || !metrics) {
      return NextResponse.json({ error: 'Failed to fetch conversation metrics' }, { status: 500 })
    }

    // Fetch SLA configuration to check limits
    const { data: config } = await supabase
      .from('whatsapp_config')
      .select('sla_enabled, sla_first_reply_min')
      .eq('account_id', account_id)
      .maybeSingle()

    const slaEnabled = config?.sla_enabled ?? true
    const slaFirstReplyMin = config?.sla_first_reply_min ?? 5

    // Group metrics by agent (assigned_agent_id)
    const agentMetricsMap = new Map<string, any>()

    // Initialize all profiles as having 0 metrics
    for (const p of profiles) {
      agentMetricsMap.set(p.user_id, {
        userId: p.user_id,
        fullName: p.full_name,
        email: p.email,
        avatarUrl: p.avatar_url,
        role: p.account_role,
        conversationsHandled: 0,
        totalResponseTimeMs: 0,
        responseTimeCount: 0,
        totalCsat: 0,
        csatCount: 0,
        totalMessagesSent: 0,
        closedCount: 0,
        slaCompliantCount: 0,
      })
    }

    // Accumulate metrics from DB rows
    for (const m of metrics) {
      if (!m.assigned_agent_id) continue
      
      const stats = agentMetricsMap.get(m.assigned_agent_id)
      if (!stats) continue // Profile might have been removed

      stats.conversationsHandled += 1
      stats.totalMessagesSent += (m.message_count_agent || 0)
      
      if (m.first_response_time_ms !== null && m.first_response_time_ms !== undefined) {
        stats.totalResponseTimeMs += Number(m.first_response_time_ms)
        stats.responseTimeCount += 1

        const responseMin = Number(m.first_response_time_ms) / 60000
        if (responseMin <= slaFirstReplyMin) {
          stats.slaCompliantCount += 1
        }
      }

      if (m.csat_score !== null && m.csat_score !== undefined) {
        stats.totalCsat += m.csat_score
        stats.csatCount += 1
      }

      if (m.closed_at !== null) {
        stats.closedCount += 1
      }
    }

    // Calculate averages & leaderboard score
    const leaderboard = Array.from(agentMetricsMap.values()).map((stats) => {
      const avgResponseTimeMin = stats.responseTimeCount > 0 
        ? Math.round((stats.totalResponseTimeMs / stats.responseTimeCount) / 60000) 
        : null
      
      const avgCsat = stats.csatCount > 0 
        ? Number((stats.totalCsat / stats.csatCount).toFixed(2)) 
        : null
      
      const resolutionRate = stats.conversationsHandled > 0
        ? Math.round((stats.closedCount / stats.conversationsHandled) * 100)
        : 0

      const slaComplianceRate = stats.responseTimeCount > 0
        ? Math.round((stats.slaCompliantCount / stats.responseTimeCount) * 100)
        : 100 // default to 100% compliance if no response yet

      // Compute a composite score (0-100) for ranking:
      // - CSAT (30%): mapping 1-5 to 0-100
      // - Response Time (20%): under 15 mins gets full points, sliding scale up to 120 mins
      // - Resolution Rate (20%): percentage based
      // - SLA Compliance Rate (30%): percentage based
      let compositeScore = 0
      
      if (avgCsat !== null) {
        compositeScore += ((avgCsat - 1) / 4) * 100 * 0.3
      } else {
        compositeScore += 70 * 0.3 // default neutral score if no CSAT
      }

      if (avgResponseTimeMin !== null) {
        const timeScore = Math.max(0, 100 - (avgResponseTimeMin / 1.2)) // 120 mins = 0 points
        compositeScore += timeScore * 0.2
      } else {
        compositeScore += 50 * 0.2 // default neutral score
      }

      compositeScore += resolutionRate * 0.2
      compositeScore += slaComplianceRate * 0.3

      return {
        userId: stats.userId,
        fullName: stats.fullName,
        email: stats.email,
        avatarUrl: stats.avatarUrl,
        role: stats.role,
        conversationsHandled: stats.conversationsHandled,
        avgResponseTimeMin,
        avgCsat,
        resolutionRate,
        slaComplianceRate,
        messagesSent: stats.totalMessagesSent,
        score: Math.round(compositeScore),
      }
    })

    // Sort by composite score descending
    leaderboard.sort((a, b) => b.score - a.score)

    // Calculate overall account metrics
    const totalConversations = metrics.length
    const closedConversations = metrics.filter(m => m.closed_at).length
    const overallResolutionRate = totalConversations > 0 
      ? Math.round((closedConversations / totalConversations) * 100) 
      : 0
    
    const csatValues = metrics.filter(m => m.csat_score !== null).map(m => m.csat_score as number)
    const overallCsat = csatValues.length > 0 
      ? Number((csatValues.reduce((sum, val) => sum + val, 0) / csatValues.length).toFixed(2)) 
      : null

    const responseTimes = metrics
      .filter(m => m.first_response_time_ms !== null)
      .map(m => Number(m.first_response_time_ms))
    const overallAvgResponseTimeMin = responseTimes.length > 0 
      ? Math.round((responseTimes.reduce((sum, val) => sum + val, 0) / responseTimes.length) / 60000) 
      : null

    const compliantResponseTimes = metrics
      .filter(m => m.first_response_time_ms !== null)
      .map(m => Number(m.first_response_time_ms) / 60000)
    
    const overallSlaCompliantCount = compliantResponseTimes.filter(t => t <= slaFirstReplyMin).length
    const overallSlaTotalCount = compliantResponseTimes.length
    const overallSlaComplianceRate = overallSlaTotalCount > 0
      ? Math.round((overallSlaCompliantCount / overallSlaTotalCount) * 100)
      : 100

    return NextResponse.json({
      leaderboard,
      summary: {
        totalConversations,
        closedConversations,
        resolutionRate: overallResolutionRate,
        avgCsat: overallCsat,
        avgResponseTimeMin: overallAvgResponseTimeMin,
        slaComplianceRate: overallSlaComplianceRate,
      }
    })
  } catch (err: any) {
    console.error('[scorecard-api] failed:', err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
