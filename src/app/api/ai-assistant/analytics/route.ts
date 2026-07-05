import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
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

    // Fetch aggregate analytics
    const { data: events, error } = await supabase
      .from('ai_analytics_events')
      .select('*')
      .eq('account_id', profile.account_id);

    if (error) {
      console.error('Analytics fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }

    // Process events into meaningful metrics
    const totalConversations = new Set(events.map(e => e.conversation_id).filter(Boolean)).size;
    const totalReplies = events.length;
    const humanHandoffs = events.filter(e => e.is_handoff).length;
    const errors = events.filter(e => e.is_error).length;
    
    let totalTimeMs = 0;
    let totalTokens = 0;
    let totalCost = 0;
    const providerUsage: Record<string, number> = {};
    const modelUsage: Record<string, number> = {};

    events.forEach(e => {
      totalTimeMs += e.response_time_ms || 0;
      totalTokens += e.total_tokens || 0;
      totalCost += e.estimated_cost || 0;
      
      if (e.provider) providerUsage[e.provider] = (providerUsage[e.provider] || 0) + 1;
      if (e.model) modelUsage[e.model] = (modelUsage[e.model] || 0) + 1;
    });

    const avgResponseTime = totalReplies > 0 ? Math.round(totalTimeMs / totalReplies) : 0;
    const avgTokens = totalReplies > 0 ? Math.round(totalTokens / totalReplies) : 0;

    return NextResponse.json({
      metrics: {
        totalConversations,
        totalReplies,
        humanHandoffs,
        errors,
        avgResponseTime,
        avgTokens,
        totalCost,
        providerUsage,
        modelUsage
      }
    });

  } catch (error: any) {
    console.error('Error in analytics GET:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
