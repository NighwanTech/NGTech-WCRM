import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { FALLBACK_FEATURES_CATALOG } from '@/lib/services/features-cms.service';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: features, error } = await supabase
      .from('saas_features')
      .select('*')
      .order('name', { ascending: true });

    if (error || !features || features.length === 0) {
      return NextResponse.json({ success: true, features: FALLBACK_FEATURES_CATALOG, source: 'fallback' });
    }

    return NextResponse.json({ success: true, features, source: 'database' });
  } catch (err: any) {
    return NextResponse.json({ success: true, features: FALLBACK_FEATURES_CATALOG, error: err.message });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    const featurePayload = {
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
      category: body.category || 'Customer Support',
      status: body.status || 'live',
      publish_status: body.publish_status || 'published',
      short_description: body.short_description || '',
      featured_toggle: body.featured_toggle || false,
      available_in_plans: body.available_in_plans || ['Starter', 'Pro', 'Enterprise'],
      supported_industries: body.supported_industries || ['Manufacturing', 'Healthcare', 'Education'],
      meta_title: body.meta_title || `${body.name} | WCRM`,
      meta_description: body.meta_description || body.short_description || '',
      sections_config: body.sections_config || []
    };

    const { data: newFeature, error } = await supabase
      .from('saas_features')
      .insert([featurePayload])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, feature: newFeature });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Feature ID is required' }, { status: 400 });
    }

    const { data: updatedFeature, error } = await supabase
      .from('saas_features')
      .update({
        name: body.name,
        slug: body.slug,
        category: body.category,
        status: body.status,
        publish_status: body.publish_status,
        short_description: body.short_description,
        featured_toggle: body.featured_toggle,
        available_in_plans: body.available_in_plans,
        supported_industries: body.supported_industries,
        meta_title: body.meta_title,
        meta_description: body.meta_description,
        sections_config: body.sections_config,
        updated_at: new Date().toISOString()
      })
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, feature: updatedFeature });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
