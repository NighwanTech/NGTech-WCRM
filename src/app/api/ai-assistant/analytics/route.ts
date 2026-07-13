import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');

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

    let query = supabase
      .from('ai_analytics_events')
      .select('*')
      .eq('account_id', profile.account_id)
      .order('created_at', { ascending: true });
      
    if (fromDate) {
      query = query.gte('created_at', fromDate);
    }
    if (toDate) {
      query = query.lte('created_at', toDate);
    }

    const { data: events, error } = await query;

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
    const languageDistribution: Record<string, number> = {};
    const topQuestionsMap: Record<string, number> = {};
    
    const timeSeriesMap: Record<string, { date: string, replies: number, cost: number, handoffs: number }> = {};
    const aiConversationIds = new Set<string>();

    events.forEach(e => {
      totalTimeMs += e.response_time_ms || 0;
      totalTokens += e.total_tokens || 0;
      totalCost += e.estimated_cost || 0;
      
      if (e.provider) providerUsage[e.provider] = (providerUsage[e.provider] || 0) + 1;
      if (e.model) modelUsage[e.model] = (modelUsage[e.model] || 0) + 1;
      
      // New Analytics
      if (e.language) {
        const lang = e.language.trim().toLowerCase();
        languageDistribution[lang] = (languageDistribution[lang] || 0) + 1;
      }
      if (e.intent_category) {
        const intent = e.intent_category.trim().toLowerCase();
        topQuestionsMap[intent] = (topQuestionsMap[intent] || 0) + 1;
      }
      if (e.conversation_id) aiConversationIds.add(e.conversation_id);
      
      // Time series grouping
      if (e.created_at) {
        const dateStr = new Date(e.created_at).toISOString().split('T')[0]; // YYYY-MM-DD
        if (!timeSeriesMap[dateStr]) {
          timeSeriesMap[dateStr] = { date: dateStr, replies: 0, cost: 0, handoffs: 0 };
        }
        timeSeriesMap[dateStr].replies += 1;
        timeSeriesMap[dateStr].cost += (e.estimated_cost || 0);
        if (e.is_handoff) timeSeriesMap[dateStr].handoffs += 1;
      }
    });

    const avgResponseTime = totalReplies > 0 ? Math.round(totalTimeMs / totalReplies) : 0;
    const avgTokens = totalReplies > 0 ? Math.round(totalTokens / totalReplies) : 0;
    
    const timeSeriesData = Object.values(timeSeriesMap).sort((a, b) => a.date.localeCompare(b.date));
    
    // Sort top questions
    const topQuestions = Object.entries(topQuestionsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([intent, count]) => ({ intent, count }));

    // Revenue Attribution & Enterprise Intelligence
    let revenueAttribution = 0;
    
    const enterpriseIntelligence = {
      aiConfidenceScore: 0,
      businessInsights: { primarySentiment: 'N/A', positivePercentage: 0 },
      csat: { average: 0, count: 0 },
      knowledgeBase: { documents: 0, chunks: 0 },
      roi: { totalDeals: 0, wonDeals: 0, winRate: 0 },
      agentPerformance: { avgResponseTime: 0 }
    };

    if (aiConversationIds.size > 0) {
      // 1. Deals / ROI
      const { data: dealsData } = await supabase
        .from('deals')
        .select('value, status')
        .in('conversation_id', Array.from(aiConversationIds));
        
      if (dealsData && dealsData.length > 0) {
        revenueAttribution = dealsData
          .filter(d => d.status === 'won')
          .reduce((sum, deal) => sum + (Number(deal.value) || 0), 0);
          
        const won = dealsData.filter(d => d.status === 'won').length;
        enterpriseIntelligence.roi = {
          totalDeals: dealsData.length,
          wonDeals: won,
          winRate: Math.round((won / dealsData.length) * 100)
        };
      }

      // 2. Conversations (Confidence & Sentiment)
      const { data: convData } = await supabase
        .from('conversations')
        .select('ai_classification_confidence, ai_detected_sentiment')
        .in('id', Array.from(aiConversationIds));

      if (convData && convData.length > 0) {
        const confidences = convData.map(c => c.ai_classification_confidence).filter(c => c !== null) as number[];
        if (confidences.length > 0) {
          enterpriseIntelligence.aiConfidenceScore = Math.round(
            confidences.reduce((a, b) => a + b, 0) / confidences.length * 100
          );
        }

        const sentiments = convData.map(c => c.ai_detected_sentiment).filter(Boolean) as string[];
        if (sentiments.length > 0) {
          const positive = sentiments.filter(s => s.toLowerCase() === 'positive').length;
          enterpriseIntelligence.businessInsights.positivePercentage = Math.round((positive / sentiments.length) * 100);
          enterpriseIntelligence.businessInsights.primarySentiment = 
            enterpriseIntelligence.businessInsights.positivePercentage >= 50 ? 'Positive' : 'Mixed/Negative';
        }
      }

      // 3. Conversation Metrics (CSAT & Agent Performance)
      const { data: metricData } = await supabase
        .from('conversation_metrics')
        .select('csat_score, first_response_time_ms')
        .in('conversation_id', Array.from(aiConversationIds));

      if (metricData && metricData.length > 0) {
        const csats = metricData.map(m => m.csat_score).filter(c => c !== null) as number[];
        if (csats.length > 0) {
          enterpriseIntelligence.csat = {
            average: Number((csats.reduce((a, b) => a + b, 0) / csats.length).toFixed(1)),
            count: csats.length
          };
        }

        const agentTimes = metricData.map(m => m.first_response_time_ms).filter(t => t !== null) as number[];
        if (agentTimes.length > 0) {
          enterpriseIntelligence.agentPerformance.avgResponseTime = Math.round(
            agentTimes.reduce((a, b) => a + b, 0) / agentTimes.length
          );
        }
      }
    }

    // 4. Knowledge Base Stats
    const { count: kbDocCount } = await supabase
      .from('ai_knowledge_documents')
      .select('*', { count: 'exact', head: true })
      .eq('account_id', profile.account_id);

    const { count: kbChunkCount } = await supabase
      .from('ai_knowledge_chunks')
      .select('*', { count: 'exact', head: true })
      .eq('account_id', profile.account_id);

    enterpriseIntelligence.knowledgeBase = {
      documents: kbDocCount || 0,
      chunks: kbChunkCount || 0
    };

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
        modelUsage,
        languageDistribution,
        topQuestions,
        revenueAttribution,
        timeSeriesData,
        enterpriseIntelligence
      }
    });

  } catch (error: any) {
    console.error('Error in analytics GET:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
