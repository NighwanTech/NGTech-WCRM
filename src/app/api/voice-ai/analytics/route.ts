import { NextResponse } from 'next/server';
import { requireRole, toErrorResponse } from '@/lib/auth/account';
import { getAdminClient } from '@/lib/admin-supabase';
import type { VoiceAnalyticsMetrics, CallSentiment } from '@/lib/voice-ai/types';

const admin = () => getAdminClient() as any;

/** GET /api/voice-ai/analytics?period=30d&provider=all */
export async function GET(req: Request) {
  try {
    const ctx    = await requireRole('agent');
    const url    = new URL(req.url);
    const period = url.searchParams.get('period') ?? '30d';
    const providerFilter = url.searchParams.get('provider') ?? 'all';

    const days       = period === '7d' ? 7 : period === '90d' ? 90 : 30;
    const sinceDate  = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    let query = admin()
      .from('ai_calls')
      .select('*')
      .eq('account_id', ctx.accountId)
      .gte('created_at', sinceDate);

    if (providerFilter !== 'all') {
      query = query.eq('provider', providerFilter);
    }

    const { data: calls } = await query;
    const allCalls: Array<Record<string, unknown>> = calls ?? [];

    const totalCalls     = allCalls.length;
    const connectedCalls = allCalls.filter((c) => c.status === 'completed').length;
    const connectedRate  = totalCalls > 0 ? (connectedCalls / totalCalls) * 100 : 0;

    const durations = allCalls
      .filter((c) => c.duration_seconds)
      .map((c) => Number(c.duration_seconds));
    const avgDuration = durations.length > 0
      ? durations.reduce((a, b) => a + b, 0) / durations.length
      : 0;

    const totalCost = allCalls.reduce(
      (sum, c) => sum + (Number(c.actual_cost_inr) || Number(c.estimated_cost_inr) || 0),
      0,
    );

    const sentimentBreakdown: Record<CallSentiment, number> = {
      positive: 0, neutral: 0, negative: 0,
    };
    const languagesUsed: Record<string, number> = {};
    const providerBreakdown: Record<string, number> = {};

    for (const c of allCalls) {
      const s = c.sentiment as CallSentiment;
      if (s && sentimentBreakdown[s] !== undefined) sentimentBreakdown[s]++;

      const lang = (c.language_used as string) ?? 'en';
      languagesUsed[lang] = (languagesUsed[lang] ?? 0) + 1;

      const prov = (c.provider as string) ?? 'unknown';
      providerBreakdown[prov] = (providerBreakdown[prov] ?? 0) + 1;
    }

    const metrics: VoiceAnalyticsMetrics = {
      totalCalls,
      connectedCalls,
      connectedRate:      Math.round(connectedRate),
      avgDurationSeconds: Math.round(avgDuration),
      aiResolutionRate:   0, // TODO: track human handoff flag
      humanHandoffRate:   0,
      totalCostInr:       Math.round(totalCost * 100) / 100,
      costPerCall:        totalCalls > 0 ? Math.round((totalCost / totalCalls) * 100) / 100 : 0,
      sentimentBreakdown,
      languagesUsed,
      revenueFromCalls:   0, // TODO: link to closed deals
    };

    return NextResponse.json({ metrics, providerBreakdown, period });
  } catch (error) {
    return toErrorResponse(error);
  }
}
