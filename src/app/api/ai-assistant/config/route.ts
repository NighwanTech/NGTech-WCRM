import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    let {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (!user) {
      const { data: { session } } = await supabase.auth.getSession()
      user = session?.user || null
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('account_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!profile?.account_id) {
      return NextResponse.json(
        { error: 'Profile not found or no account linked' },
        { status: 404 }
      )
    }

    const { data: rawConfig, error: configError } = await supabase
      .from('ai_assistant_settings')
      .select('*')
      .eq('account_id', profile.account_id)
      .maybeSingle()

    if (configError) {
      console.error('Error fetching ai_assistant_settings:', configError)
      return NextResponse.json(
        { error: 'Failed to fetch AI configuration' },
        { status: 500 }
      )
    }

    const config = rawConfig ? { ...rawConfig } : null;

    // SECURITY: Mask any saved custom API keys in GET responses so raw keys are NEVER exposed in DevTools or Inspect Element
    if (config) {
      if (config.custom_api_key_encrypted) {
        config.custom_api_key = '••••••••••••••••';
      }
      delete config.openai_api_key_encrypted;
      delete config.gemini_api_key_encrypted;
      delete config.claude_api_key_encrypted;
      delete config.groq_api_key_encrypted;
      delete config.deepseek_api_key_encrypted;
      delete config.custom_api_key_encrypted;
    }

    return NextResponse.json({ config: config || null })
  } catch (error) {
    console.error('Error in AI config GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    let {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (!user) {
      const { data: { session } } = await supabase.auth.getSession()
      user = session?.user || null
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('account_id')
      .eq('user_id', user.id)
      .single()

    if (!profile?.account_id) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const {
      enabled,
      provider,
      model,
      system_prompt,
      knowledge_base,
      personality,
      allowed_topics,
      restricted_topics,
      human_handoff_rules,
      respect_business_hours,
      advanced_settings,
      knowledge_base_structured,
      ai_rules,
      handoff_rules,
      use_custom_keys,
      custom_api_key,
      custom_api_base_url,
      custom_model_name,
      monthly_budget_inr,
      budget_alert_threshold_percent,
      budget_action,
      budget_reset_day,
      enable_budget_cap,
      enable_auto_fallback,
      fallback_provider,
      fallback_model,
    } = body

    const updateFields: Record<string, any> = {
      updated_at: new Date().toISOString()
    }

    if (enabled !== undefined) updateFields.enabled = enabled
    if (provider !== undefined) updateFields.provider = provider
    if (model !== undefined) updateFields.model = model
    if (system_prompt !== undefined) updateFields.system_prompt = system_prompt
    if (knowledge_base !== undefined) updateFields.knowledge_base = knowledge_base
    if (personality !== undefined) updateFields.personality = personality
    if (allowed_topics !== undefined) updateFields.allowed_topics = allowed_topics
    if (restricted_topics !== undefined) updateFields.restricted_topics = restricted_topics
    if (human_handoff_rules !== undefined) updateFields.human_handoff_rules = human_handoff_rules
    if (respect_business_hours !== undefined) updateFields.respect_business_hours = respect_business_hours
    if (advanced_settings !== undefined) updateFields.advanced_settings = advanced_settings
    if (knowledge_base_structured !== undefined) updateFields.knowledge_base_structured = knowledge_base_structured
    if (ai_rules !== undefined) updateFields.ai_rules = ai_rules
    if (handoff_rules !== undefined) updateFields.handoff_rules = handoff_rules
    if (use_custom_keys !== undefined) updateFields.use_custom_keys = use_custom_keys
    if (custom_api_base_url !== undefined) updateFields.custom_api_base_url = custom_api_base_url
    if (custom_model_name !== undefined) updateFields.custom_model_name = custom_model_name
    if (monthly_budget_inr !== undefined) updateFields.monthly_budget_inr = monthly_budget_inr
    if (budget_alert_threshold_percent !== undefined) updateFields.budget_alert_threshold_percent = budget_alert_threshold_percent
    if (budget_action !== undefined) updateFields.budget_action = budget_action
    if (budget_reset_day !== undefined) updateFields.budget_reset_day = budget_reset_day
    if (enable_budget_cap !== undefined) updateFields.enable_budget_cap = enable_budget_cap
    if (enable_auto_fallback !== undefined) updateFields.enable_auto_fallback = enable_auto_fallback
    if (fallback_provider !== undefined) updateFields.fallback_provider = fallback_provider
    if (fallback_model !== undefined) updateFields.fallback_model = fallback_model

    // Cryptographic AES-256-GCM Encryption for API Keys
    if (custom_api_key && typeof custom_api_key === 'string' && !custom_api_key.includes('••••')) {
      const { encrypt } = await import('@/lib/whatsapp/encryption');
      updateFields.custom_api_key_encrypted = encrypt(custom_api_key.trim());
    }

    // Upsert the row
    const { data: rawConfig, error: configError } = await supabase
      .from('ai_assistant_settings')
      .upsert({
        account_id: profile.account_id,
        ...updateFields
      }, { onConflict: 'account_id' })
      .select()
      .single()

    if (configError) {
      console.error('Error updating AI config:', configError)
      return NextResponse.json(
        { error: 'Failed to update AI settings' },
        { status: 500 }
      )
    }

    const config = rawConfig ? { ...rawConfig } : null;
    if (config && config.custom_api_key_encrypted) {
      config.custom_api_key = '••••••••••••••••';
      delete config.custom_api_key_encrypted;
    }

    return NextResponse.json({ config })
  } catch (error) {
    console.error('Error in AI config PATCH:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
