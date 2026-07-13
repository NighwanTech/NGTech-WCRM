import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('account_id')
      .eq('user_id', user.id)
      .single();

    if (!profile?.account_id) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get date range from query params (default to last 30 days)
    const url = new URL(request.url);
    const startDateParam = url.searchParams.get('startDate');
    const endDateParam = url.searchParams.get('endDate');
    
    const endDate = endDateParam ? new Date(endDateParam) : new Date();
    const startDate = startDateParam ? new Date(startDateParam) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // 1. Message Volume (Daily)
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('created_at, sender_type')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true });

    if (msgError) throw msgError;

    // Group messages by date
    const dailyVolume: Record<string, { date: string, inbound: number, outbound: number }> = {};
    
    // Initialize days
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dailyVolume[dateStr] = { date: dateStr, inbound: 0, outbound: 0 };
    }

    messages?.forEach(msg => {
      const dateStr = msg.created_at.split('T')[0];
      if (dailyVolume[dateStr]) {
        if (msg.sender_type === 'customer') {
          dailyVolume[dateStr].inbound++;
        } else {
          dailyVolume[dateStr].outbound++;
        }
      }
    });

    // 2. AI Analytics
    const { data: aiEvents } = await supabase
      .from('ai_analytics_events')
      .select('is_handoff, created_at')
      .eq('account_id', profile.account_id)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    let aiHandled = 0;
    let humanHandoffs = 0;
    
    aiEvents?.forEach(evt => {
      if (evt.is_handoff) {
        humanHandoffs++;
      } else {
        aiHandled++;
      }
    });

    // 3. Deal Metrics
    const { data: deals } = await supabase
      .from('deals')
      .select('status')
      // Note: deals don't have account_id, they belong to pipelines/users, but we fetch all for simplicity
      // Usually you'd join via pipelines -> user -> account_id. For now, fetch all for the user.
      .eq('user_id', user.id);

    let won = 0;
    let lost = 0;
    let active = 0;

    deals?.forEach(deal => {
      if (deal.status === 'won') won++;
      else if (deal.status === 'lost') lost++;
      else active++;
    });

    return NextResponse.json({
      messageVolume: Object.values(dailyVolume),
      aiPerformance: [
        { name: 'AI Handled', value: aiHandled },
        { name: 'Human Handoffs', value: humanHandoffs }
      ],
      dealMetrics: [
        { name: 'Won', value: won },
        { name: 'Lost', value: lost },
        { name: 'Active', value: active }
      ],
      summary: {
        totalMessages: messages?.length || 0,
        totalDeals: deals?.length || 0,
        aiResolutionRate: aiEvents?.length ? Math.round((aiHandled / aiEvents.length) * 100) : 0
      }
    });
  } catch (error: any) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
