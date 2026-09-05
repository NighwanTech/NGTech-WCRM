import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { FALLBACK_PRICING_PLANS, normalizePricingPlan } from '@/lib/services/pricing-cms.service';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: plans, error } = await supabase
      .from('saas_pricing_plans')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !plans || plans.length === 0) {
      return NextResponse.json({ success: true, plans: FALLBACK_PRICING_PLANS.map(normalizePricingPlan), source: 'fallback' });
    }

    const normalized = plans.map(normalizePricingPlan);
    return NextResponse.json({ success: true, plans: normalized, source: 'database' });
  } catch (err: any) {
    return NextResponse.json({ success: true, plans: FALLBACK_PRICING_PLANS.map(normalizePricingPlan), error: err.message }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    const pMonthly = Number(body.price_monthly ?? body.monthly_price ?? 0);
    const pYearly = Number(body.price_yearly ?? body.annual_price ?? 0);
    const featuresArray = Array.isArray(body.features_list)
      ? body.features_list
      : (Array.isArray(body.features) ? body.features : []);

    const maxContactsNum = typeof body.max_contacts === 'number'
      ? body.max_contacts
      : (body.max_contacts && String(body.max_contacts).toLowerCase().includes('unlimited') ? -1 : parseInt(String(body.max_contacts || '').replace(/\D/g, '')) || 10000);

    const maxMessagesNum = typeof body.max_conversations === 'number'
      ? body.max_conversations
      : (body.max_conversations && String(body.max_conversations).toLowerCase().includes('unlimited') ? -1 : parseInt(String(body.max_conversations || '').replace(/\D/g, '')) || 5000);

    const planSlug = body.slug || body.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    const standardPayload: any = {
      name: body.name,
      slug: planSlug,
      description: body.short_description || body.description || '',
      monthly_price: pMonthly,
      annual_price: pYearly,
      discount_percent: Number(body.discount_percent || 0),
      max_contacts: maxContactsNum,
      max_messages_pm: maxMessagesNum,
      features: featuresArray,
      is_active: body.is_active !== undefined ? body.is_active : true,
      sort_order: Number(body.sort_order || 1)
    };

    const extendedPayload: any = {
      ...standardPayload,
      short_description: body.short_description || body.description || '',
      price_monthly: pMonthly,
      price_yearly: pYearly,
      popular_badge: body.popular_badge || null,
      recommended_badge: body.recommended_badge || null,
      button_text: body.button_text || 'Start 7-Day Free Trial',
      button_url: body.button_url || `/free-trial?plan=${planSlug}`,
      suitable_for: body.suitable_for || 'Businesses',
      team_size: body.team_size || '3 Seats',
      max_users: Number(body.max_users || 3),
      max_ai_requests: body.max_ai_requests || 'BYOK',
      max_broadcasts: body.max_broadcasts || '10,000',
      support_type: body.support_type || 'Email & Chat',
      trial_days: Number(body.trial_days || 7),
      features_list: featuresArray
    };

    let newPlan: any = null;
    let insertErr: any = null;

    // Try extended insert first
    const { data: extData, error: extErr } = await supabase
      .from('saas_pricing_plans')
      .insert([extendedPayload])
      .select()
      .maybeSingle();

    if (!extErr && extData) {
      newPlan = extData;
    } else {
      // Fallback to standard columns
      const { data: stdData, error: stdErr } = await supabase
        .from('saas_pricing_plans')
        .insert([standardPayload])
        .select()
        .maybeSingle();

      if (!stdErr && stdData) {
        newPlan = stdData;
      } else {
        insertErr = stdErr || extErr;
      }
    }

    if (insertErr && !newPlan) {
      return NextResponse.json({ success: false, error: insertErr.message || 'Failed to create plan' }, { status: 400 });
    }

    // Invalidate caches
    try {
      revalidatePath('/pricing');
      revalidatePath('/admin/pricing');
      revalidatePath('/checkout');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ success: true, plan: normalizePricingPlan(newPlan || standardPayload) });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    if (!body.id && !body.slug) {
      return NextResponse.json({ success: false, error: 'Plan ID or slug is required' }, { status: 400 });
    }

    const pMonthly = Number(body.price_monthly ?? body.monthly_price ?? 0);
    const pYearly = Number(body.price_yearly ?? body.annual_price ?? 0);
    const featuresArray = Array.isArray(body.features_list)
      ? body.features_list
      : (Array.isArray(body.features) ? body.features : []);

    const maxContactsNum = typeof body.max_contacts === 'number'
      ? body.max_contacts
      : (body.max_contacts && String(body.max_contacts).toLowerCase().includes('unlimited') ? -1 : parseInt(String(body.max_contacts || '').replace(/\D/g, '')) || 10000);

    const maxMessagesNum = typeof body.max_conversations === 'number'
      ? body.max_conversations
      : (body.max_conversations && String(body.max_conversations).toLowerCase().includes('unlimited') ? -1 : parseInt(String(body.max_conversations || '').replace(/\D/g, '')) || 5000);

    const planSlug = body.slug || body.name?.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    const standardPayload: any = {
      name: body.name,
      slug: planSlug,
      description: body.short_description || body.description || '',
      monthly_price: pMonthly,
      annual_price: pYearly,
      discount_percent: Number(body.discount_percent || 0),
      max_contacts: maxContactsNum,
      max_messages_pm: maxMessagesNum,
      features: featuresArray,
      is_active: body.is_active !== undefined ? body.is_active : true,
      sort_order: Number(body.sort_order || 1)
    };

    const extendedPayload: any = {
      ...standardPayload,
      short_description: body.short_description || body.description || '',
      price_monthly: pMonthly,
      price_yearly: pYearly,
      popular_badge: body.popular_badge || null,
      recommended_badge: body.recommended_badge || null,
      button_text: body.button_text,
      button_url: body.button_url,
      suitable_for: body.suitable_for,
      team_size: body.team_size,
      max_users: Number(body.max_users || 3),
      max_ai_requests: body.max_ai_requests,
      max_broadcasts: body.max_broadcasts,
      support_type: body.support_type,
      trial_days: Number(body.trial_days || 7),
      features_list: featuresArray
    };

    const isUUID = body.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.id);
    let updatedPlan: any = null;
    let updateError: any = null;

    // 1. Try updating extended schema by ID or slug
    try {
      const query = supabase.from('saas_pricing_plans').update(extendedPayload);
      const res = isUUID
        ? await query.eq('id', body.id).select().maybeSingle()
        : await query.eq('slug', planSlug).select().maybeSingle();

      if (!res.error && res.data) {
        updatedPlan = res.data;
      } else if (res.error) {
        updateError = res.error;
      }
    } catch (e: any) {
      updateError = e;
    }

    // 2. Try updating standard schema by ID or slug
    if (!updatedPlan) {
      try {
        const query = supabase.from('saas_pricing_plans').update(standardPayload);
        const res = isUUID
          ? await query.eq('id', body.id).select().maybeSingle()
          : await query.eq('slug', planSlug).select().maybeSingle();

        if (!res.error && res.data) {
          updatedPlan = res.data;
        } else if (res.error) {
          updateError = res.error;
        }
      } catch (e: any) {
        updateError = e;
      }
    }

    // 3. If plan does not exist in DB yet (e.g. initial fallback edit), upsert it by slug
    if (!updatedPlan) {
      try {
        const { data: upsertData, error: upsertErr } = await supabase
          .from('saas_pricing_plans')
          .upsert([standardPayload], { onConflict: 'slug' })
          .select()
          .maybeSingle();

        if (!upsertErr && upsertData) {
          updatedPlan = upsertData;
        } else if (upsertErr) {
          updateError = upsertErr;
        }
      } catch (e: any) {
        updateError = e;
      }
    }

    if (!updatedPlan && updateError) {
      return NextResponse.json({ success: false, error: updateError.message || 'Failed to update plan' }, { status: 400 });
    }

    // Invalidate caches
    try {
      revalidatePath('/pricing');
      revalidatePath('/admin/pricing');
      revalidatePath('/checkout');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ success: true, plan: normalizePricingPlan(updatedPlan || standardPayload) });
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

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    const query = supabase.from('saas_pricing_plans').delete();
    const { error } = isUUID ? await query.eq('id', id) : await query.eq('slug', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    // Invalidate caches
    try {
      revalidatePath('/pricing');
      revalidatePath('/admin/pricing');
      revalidatePath('/checkout');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

