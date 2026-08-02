import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { FALLBACK_PRICING_PLANS } from '@/lib/services/pricing-cms.service';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: plans, error } = await supabase
      .from('saas_pricing_plans')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !plans || plans.length === 0) {
      return NextResponse.json({ success: true, plans: FALLBACK_PRICING_PLANS, source: 'fallback' });
    }

    return NextResponse.json({ success: true, plans, source: 'database' });
  } catch (err: any) {
    return NextResponse.json({ success: true, plans: FALLBACK_PRICING_PLANS, error: err.message }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    const planPayload = {
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
      description: body.short_description,
      short_description: body.short_description,
      monthly_price: body.price_monthly,
      annual_price: body.price_yearly,
      price_monthly: body.price_monthly,
      price_yearly: body.price_yearly,
      currency: body.currency || '₹',
      popular_badge: body.popular_badge || null,
      recommended_badge: body.recommended_badge || null,
      button_text: body.button_text || 'Start 7-Day Free Trial',
      button_url: body.button_url || `/free-trial?plan=${body.slug}`,
      suitable_for: body.suitable_for || 'Businesses',
      team_size: body.team_size || '3 Seats',
      max_contacts: body.max_contacts || '10,000',
      max_conversations: body.max_conversations || '5,000',
      max_users: body.max_users || 3,
      max_ai_requests: body.max_ai_requests || 'BYOK',
      max_broadcasts: body.max_broadcasts || '10,000',
      support_type: body.support_type || 'Email & Chat',
      trial_days: body.trial_days || 7,
      is_active: body.is_active !== undefined ? body.is_active : true,
      sort_order: body.sort_order || 1,
      features_list: body.features_list || []
    };

    const { data: newPlan, error } = await supabase
      .from('saas_pricing_plans')
      .insert([planPayload])
      .select()
      .single();

    if (error) {
      // Fallback try without legacy columns if table doesn't have them
      const { data: altPlan, error: altErr } = await supabase
        .from('saas_pricing_plans')
        .insert([{
          name: body.name,
          slug: body.slug,
          monthly_price: body.price_monthly,
          annual_price: body.price_yearly,
          description: body.short_description,
          is_active: true
        }])
        .select()
        .single();

      if (altErr) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, plan: altPlan });
    }

    return NextResponse.json({ success: true, plan: newPlan });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Plan ID is required' }, { status: 400 });
    }

    const updatePayload = {
      name: body.name,
      slug: body.slug,
      description: body.short_description,
      short_description: body.short_description,
      monthly_price: body.price_monthly,
      annual_price: body.price_yearly,
      price_monthly: body.price_monthly,
      price_yearly: body.price_yearly,
      popular_badge: body.popular_badge,
      recommended_badge: body.recommended_badge,
      button_text: body.button_text,
      button_url: body.button_url,
      suitable_for: body.suitable_for,
      team_size: body.team_size,
      max_contacts: body.max_contacts,
      max_conversations: body.max_conversations,
      max_users: body.max_users,
      max_ai_requests: body.max_ai_requests,
      max_broadcasts: body.max_broadcasts,
      support_type: body.support_type,
      trial_days: body.trial_days,
      is_active: body.is_active,
      sort_order: body.sort_order,
      features_list: body.features_list
    };

    const { data: updatedPlan, error } = await supabase
      .from('saas_pricing_plans')
      .update(updatePayload)
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      // Fallback try basic columns if table has strict schema
      const { data: altPlan, error: altErr } = await supabase
        .from('saas_pricing_plans')
        .update({
          name: body.name,
          slug: body.slug,
          monthly_price: body.price_monthly,
          annual_price: body.price_yearly,
          description: body.short_description
        })
        .eq('id', body.id)
        .select()
        .single();

      if (altErr) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, plan: altPlan });
    }

    return NextResponse.json({ success: true, plan: updatedPlan });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Plan ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('saas_pricing_plans')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
