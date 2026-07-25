import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    let {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (!user) {
      const { data: { session } } = await supabase.auth.getSession();
      user = session?.user || null;
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('account_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!profile?.account_id) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    const accountId = profile.account_id;

    // Fetch usage logs for this account safely
    let logs: any[] = [];
    try {
      const { data, error } = await supabase
        .from('ai_usage_logs')
        .select('*')
        .eq('account_id', accountId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error && data) {
        logs = data;
      }
    } catch {
      // If table doesn't exist yet or query fails, default to empty list
      logs = [];
    }

    // Compute totals & breakdowns
    let totalTokens = 0;
    let totalPromptTokens = 0;
    let totalCompletionTokens = 0;
    let totalEstimatedCostUsd = 0;
    const providerBreakdown: Record<string, { requests: number; tokens: number; cost: number }> = {};
    const modelBreakdown: Record<string, { requests: number; tokens: number; cost: number }> = {};

    (logs || []).forEach((log) => {
      totalTokens += log.total_tokens || 0;
      totalPromptTokens += log.prompt_tokens || 0;
      totalCompletionTokens += log.completion_tokens || 0;
      totalEstimatedCostUsd += Number(log.estimated_cost_usd || 0);

      const pKey = log.provider || 'unknown';
      if (!providerBreakdown[pKey]) {
        providerBreakdown[pKey] = { requests: 0, tokens: 0, cost: 0 };
      }
      providerBreakdown[pKey].requests += 1;
      providerBreakdown[pKey].tokens += log.total_tokens || 0;
      providerBreakdown[pKey].cost += Number(log.estimated_cost_usd || 0);

      const mKey = `${log.provider}/${log.model}`;
      if (!modelBreakdown[mKey]) {
        modelBreakdown[mKey] = { requests: 0, tokens: 0, cost: 0 };
      }
      modelBreakdown[mKey].requests += 1;
      modelBreakdown[mKey].tokens += log.total_tokens || 0;
      modelBreakdown[mKey].cost += Number(log.estimated_cost_usd || 0);
    });

    const USD_TO_INR_RATE = 86.0;
    const totalEstimatedCostInr = Number((totalEstimatedCostUsd * USD_TO_INR_RATE).toFixed(2));

    return NextResponse.json({
      summary: {
        totalRequests: (logs || []).length,
        totalTokens,
        totalPromptTokens,
        totalCompletionTokens,
        totalEstimatedCostUsd: Number(totalEstimatedCostUsd.toFixed(4)),
        totalEstimatedCostInr,
        exchangeRate: USD_TO_INR_RATE,
      },
      providerBreakdown,
      modelBreakdown,
      recentLogs: logs || [],
    });
  } catch (err: any) {
    console.error('Failed to fetch AI usage analytics:', err);
    return NextResponse.json({ error: err?.message || 'Failed to fetch AI usage' }, { status: 500 });
  }
}
