import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/admin-supabase';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = getAdminClient();
    const { data: profile } = await (admin as any)
      .from('profiles')
      .select('is_platform_admin')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!profile?.is_platform_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 1. Fetch all accounts
    const { data: accounts, error: accErr } = await (admin as any)
      .from('accounts')
      .select('id, name, plan, owner_user_id, created_at')
      .order('created_at', { ascending: false });

    if (accErr) throw accErr;

    // 2. Fetch owner profiles for email
    const ownerUserIds = (accounts ?? []).map((a: any) => a.owner_user_id).filter(Boolean);
    const { data: profiles } = ownerUserIds.length > 0
      ? await (admin as any)
          .from('profiles')
          .select('user_id, email, full_name')
          .in('user_id', ownerUserIds)
      : { data: [] };

    const profileMap: Record<string, { email: string; name: string }> = {};
    profiles?.forEach((p: any) => {
      profileMap[p.user_id] = { email: p.email || '', name: p.full_name || '' };
    });

    // 3. Fetch AI usage logs across all clients
    const { data: usageLogs, error: usageErr } = await (admin as any)
      .from('ai_usage_logs')
      .select('account_id, total_tokens, estimated_cost_usd, estimated_cost_inr, provider, model');

    const clientUsageMap: Record<string, { totalTokens: number; costUsd: number; costInr: number; requests: number }> = {};
    
    let totalPlatformTokens = 0;
    let totalPlatformCostUsd = 0;
    let totalPlatformCostInr = 0;

    (usageLogs ?? []).forEach((log: any) => {
      const accId = log.account_id;
      if (!accId) return;

      if (!clientUsageMap[accId]) {
        clientUsageMap[accId] = { totalTokens: 0, costUsd: 0, costInr: 0, requests: 0 };
      }

      const tokens = log.total_tokens || 0;
      const usd = Number(log.estimated_cost_usd || 0);
      const inr = Number(log.estimated_cost_inr || 0);

      clientUsageMap[accId].totalTokens += tokens;
      clientUsageMap[accId].costUsd += usd;
      clientUsageMap[accId].costInr += inr;
      clientUsageMap[accId].requests += 1;

      totalPlatformTokens += tokens;
      totalPlatformCostUsd += usd;
      totalPlatformCostInr += inr;
    });

    // 4. Construct client breakdown list
    const clientBreakdown = (accounts ?? []).map((acc: any) => {
      const owner = profileMap[acc.owner_user_id] || { email: '', name: '' };
      const usage = clientUsageMap[acc.id] || { totalTokens: 0, costUsd: 0, costInr: 0, requests: 0 };
      
      return {
        id: acc.id,
        name: acc.name || 'Unnamed Client',
        ownerEmail: owner.email,
        ownerName: owner.name,
        plan: acc.plan || 'starter',
        totalTokens: usage.totalTokens,
        costUsd: Number(usage.costUsd.toFixed(4)),
        costInr: Number(usage.costInr.toFixed(2)),
        requests: usage.requests,
      };
    });

    return NextResponse.json({
      summary: {
        totalTokens: totalPlatformTokens,
        totalCostUsd: Number(totalPlatformCostUsd.toFixed(4)),
        totalCostInr: Number(totalPlatformCostInr.toFixed(2)),
        activeAccountsCount: accounts?.length || 0,
      },
      clients: clientBreakdown,
    });
  } catch (err: any) {
    console.error('Failed to fetch admin AI analytics:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
