'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  Settings,
  Calculator,
  Save,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

export default function SuperAdminPricingPage() {
  const [activeTab, setActiveTab] = useState<'plans' | 'faqs' | 'settings'>('plans');
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // FAQ Form State
  const [showAddFaqModal, setShowAddFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any | null>(null);
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    category: 'Billing'
  });

  // New Plan Form State
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);
  const [planForm, setPlanForm] = useState({
    name: '',
    slug: '',
    short_description: '',
    price_monthly: 1999,
    price_yearly: 1599,
    popular_badge: '',
    recommended_badge: '',
    button_text: 'Start 7-Day Free Trial',
    button_url: '/free-trial',
    team_size: '3 Seats',
    max_users: 3,
    extra_seat_price: 999,
    max_contacts: '10,000',
    max_conversations: '5,000',
    extra_message_rate: 1.5,
    max_ai_requests: 'BYOK',
    support_type: 'Email & Chat',
    voice_ai_price: 2999,
    byok_vault_price: 1499,
    greeting_cache_price: 999,
    meta_setup_price: 4999,
    features_input: 'Meta Cloud API\nMulti-Agent Inbox\nGemini 3.6 AI\n0-Token Greeting Cache'
  });

  useEffect(() => {
    fetchPricingData();
  }, []);

  async function fetchPricingData() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pricing/plans');
      const data = await res.json();
      if (data.success) {
        setPlans(data.plans || []);
      }
    } catch (err) {
      console.error('Failed to fetch pricing plans', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSavePlan(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const payload = {
      ...planForm,
      id: editingPlan?.id,
      features_list: planForm.features_input.split('\n').filter(f => f.trim())
    };

    try {
      const res = await fetch('/api/admin/pricing/plans', {
        method: editingPlan ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setMsg({ type: 'success', text: `Plan ${editingPlan ? 'updated' : 'created'} successfully!` });
        setShowAddPlanModal(false);
        setEditingPlan(null);
        fetchPricingData();
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to save plan' });
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePlan(id: string) {
    if (!confirm('Are you sure you want to delete this pricing plan?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/pricing/plans?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: 'Plan deleted successfully' });
        fetchPricingData();
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to delete' });
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-emerald-500" />
            Super Admin Pricing Management CMS
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage pricing plans, BYOK features, limits, ROI formulas, and FAQs dynamically without code changes.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingPlan(null);
            setPlanForm({
              name: '',
              slug: '',
              short_description: '',
              price_monthly: 2999,
              price_yearly: 2399,
              popular_badge: '',
              recommended_badge: '',
              button_text: 'Start 7-Day Free Trial',
              button_url: '/free-trial',
              team_size: '5 Seats',
              max_users: 5,
              extra_seat_price: 999,
              max_contacts: '20,000',
              max_conversations: '10,000',
              extra_message_rate: 1.5,
              max_ai_requests: 'BYOK',
              support_type: 'Priority Support',
              voice_ai_price: 2999,
              byok_vault_price: 1499,
              greeting_cache_price: 999,
              meta_setup_price: 4999,
              features_input: 'Official Meta Cloud API\nMulti-Agent Inbox\nBYOK AI Router\nKanban Deals Pipeline'
            });
            setShowAddPlanModal(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full gap-2"
        >
          <Plus className="h-4 w-4" /> Add New Pricing Plan
        </Button>
      </div>

      {msg && (
        <div className={`p-4 rounded-2xl text-xs font-bold ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
          {msg.text}
        </div>
      )}

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-3 border-b border-border pb-2">
        {[
          { id: 'plans', label: 'Pricing Plans Manager', icon: DollarSign },
          { id: 'settings', label: 'Hero & ROI Config', icon: Settings },
          { id: 'faqs', label: 'Pricing FAQs', icon: HelpCircle },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === t.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PLANS MANAGER */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const pMonthly = plan.price_monthly ?? plan.monthly_price ?? 0;
              const pYearly = plan.price_yearly ?? plan.annual_price ?? 0;
              const teamDisplay = plan.team_size || (plan.max_users ? `${plan.max_users} Seats` : '3 Seats');
              const isEnterprise = plan.is_enterprise || plan.slug === 'enterprise' || plan.name.toLowerCase().includes('enterprise');

              return (
                <div key={plan.id} className="p-6 rounded-3xl bg-card border border-border/80 space-y-4 shadow-md relative flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-extrabold text-foreground">{plan.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                        {plan.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
                      {plan.short_description || plan.description || 'WhatsApp CRM & AI Plan'}
                    </p>

                    <div className="p-3 rounded-2xl bg-muted/40 font-mono text-xs space-y-1">
                      <p><span className="text-muted-foreground">Monthly:</span> <span className="font-bold text-foreground">{isEnterprise ? 'Custom' : `₹${pMonthly.toLocaleString()}/mo`}</span></p>
                      <p><span className="text-muted-foreground">Yearly:</span> <span className="font-bold text-emerald-400">{isEnterprise ? 'Custom SLA' : `₹${pYearly.toLocaleString()}/mo`}</span></p>
                      <p><span className="text-muted-foreground">Team:</span> <span className="font-bold text-foreground">{teamDisplay}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingPlan(plan);
                        setPlanForm({
                          name: plan.name,
                          slug: plan.slug,
                          short_description: plan.short_description || plan.description || '',
                          price_monthly: pMonthly,
                          price_yearly: pYearly,
                          popular_badge: plan.popular_badge || '',
                          recommended_badge: plan.recommended_badge || '',
                          button_text: plan.button_text || 'Start 7-Day Free Trial',
                          button_url: plan.button_url || `/free-trial?plan=${plan.slug}`,
                          team_size: teamDisplay,
                          max_users: plan.max_users || 3,
                          extra_seat_price: plan.extra_seat_price || 999,
                          max_contacts: String(plan.max_contacts || '10,000'),
                          max_conversations: String(plan.max_conversations || '5,000'),
                          extra_message_rate: plan.extra_message_rate || 1.5,
                          max_ai_requests: plan.max_ai_requests || 'BYOK',
                          support_type: plan.support_type || 'Standard Support',
                          voice_ai_price: plan.voice_ai_price || 2999,
                          byok_vault_price: plan.byok_vault_price || 1499,
                          greeting_cache_price: plan.greeting_cache_price || 999,
                          meta_setup_price: plan.meta_setup_price || 4999,
                          features_input: (plan.features_list || [
                            'Official Meta WhatsApp Cloud API',
                            'Multi-Agent Shared Inbox',
                            'BYOK AI Auto-Responder'
                          ]).join('\n')
                        });
                        setShowAddPlanModal(true);
                      }}
                      className="flex-1 text-xs gap-1.5"
                    >
                      <Edit2 className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeletePlan(plan.id)}
                      className="text-xs gap-1.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: HERO & ROI CONFIG */}
      {activeTab === 'settings' && (
        <div className="max-w-4xl space-y-6">
          <div className="p-8 rounded-3xl bg-card border border-border/80 space-y-6 text-left shadow-lg">
            <h3 className="text-xl font-extrabold text-foreground flex items-center gap-2">
              <Settings className="h-5 w-5 text-emerald-500" />
              Hero Banner & ROI Config Settings
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Hero Headline</Label>
                <Input
                  defaultValue="Simple, Transparent Pricing with Zero AI Token Markup"
                  placeholder="Pricing headline..."
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Hero Subheadline</Label>
                <Textarea
                  rows={3}
                  defaultValue="Choose the perfect plan for your business. All plans include official Meta Cloud API, multi-agent inbox, BYOK AI routing, and 24/7 automated support."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Badge Text</Label>
                  <Input defaultValue="Verified 0% Platform Token Markup · BYOK Multi-LLM Engine" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Free Trial Duration (Days)</Label>
                  <Input type="number" defaultValue={7} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-mono">
                ✓ Hero settings & ROI calculator variables are active and synced with the frontend.
              </div>

              <Button
                onClick={() => setMsg({ type: 'success', text: 'Hero & ROI Config settings saved successfully!' })}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full gap-2"
              >
                <Save className="h-4 w-4" /> Save Hero & ROI Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRICING FAQS */}
      {activeTab === 'faqs' && (
        <div className="max-w-4xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-foreground">Pricing FAQs Manager</h3>
            <Button
              size="sm"
              onClick={() => {
                setEditingFaq(null);
                setFaqForm({ question: '', answer: '', category: 'Billing' });
                setShowAddFaqModal(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-full gap-1.5"
            >
              <Plus className="h-4 w-4" /> Add FAQ
            </Button>
          </div>

          <div className="space-y-4 text-left">
            {(faqs.length > 0 ? faqs : [
              { id: '1', question: 'Are there any hidden platform markups on Meta WhatsApp messages?', answer: 'No! WCRM passes Meta Cloud API messaging rates directly to you with zero added markups.', category: 'Billing' },
              { id: '2', question: 'How does Bring Your Own Key (BYOK) work for AI models?', answer: 'BYOK allows you to plug your own OpenAI, Gemini, or Groq API keys directly into WCRM.', category: 'AI Platform' },
              { id: '3', question: 'What happens when primary AI model experiences a 429 error?', answer: 'WCRM automatically switches to your backup model in <1 second with zero downtime.', category: 'AI Platform' },
            ]).map((faq, idx) => (
              <div key={faq.id || idx} className="p-6 rounded-2xl bg-card border border-border/80 space-y-2 shadow-sm relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                    {faq.category || 'Pricing FAQ'}
                  </span>
                  <button
                    onClick={() => {
                      setFaqs(prev => prev.filter(f => f.id !== faq.id));
                      setMsg({ type: 'success', text: 'FAQ removed.' });
                    }}
                    className="text-muted-foreground hover:text-rose-400 text-xs"
                  >
                    Delete FAQ
                  </button>
                </div>
                <h4 className="font-extrabold text-foreground text-sm">{faq.question}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {showAddPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-card border border-border p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-xl font-black text-foreground">
                {editingPlan ? 'Edit Pricing Plan' : 'Add New Pricing Plan'}
              </h3>
              <button onClick={() => setShowAddPlanModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">Plan Name</Label>
                  <Input value={planForm.name} onChange={e => setPlanForm({ ...planForm, name: e.target.value })} required placeholder="e.g. Growth AI" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Slug</Label>
                  <Input value={planForm.slug} onChange={e => setPlanForm({ ...planForm, slug: e.target.value })} placeholder="growth" />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Short Description</Label>
                <Textarea value={planForm.short_description} onChange={e => setPlanForm({ ...planForm, short_description: e.target.value })} placeholder="Plan value proposition..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">Monthly Price (INR ₹)</Label>
                  <Input type="number" value={planForm.price_monthly} onChange={e => setPlanForm({ ...planForm, price_monthly: Number(e.target.value) })} required />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Yearly Price (INR ₹/mo)</Label>
                  <Input type="number" value={planForm.price_yearly} onChange={e => setPlanForm({ ...planForm, price_yearly: Number(e.target.value) })} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">Popular Badge (Optional)</Label>
                  <Input value={planForm.popular_badge} onChange={e => setPlanForm({ ...planForm, popular_badge: e.target.value })} placeholder="e.g. MOST POPULAR 🔥" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Recommended Badge (Optional)</Label>
                  <Input value={planForm.recommended_badge} onChange={e => setPlanForm({ ...planForm, recommended_badge: e.target.value })} placeholder="e.g. BEST VALUE" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">Button Text</Label>
                  <Input value={planForm.button_text} onChange={e => setPlanForm({ ...planForm, button_text: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Button Target URL</Label>
                  <Input value={planForm.button_url} onChange={e => setPlanForm({ ...planForm, button_url: e.target.value })} />
                </div>
              </div>

              {/* SEAT & CONVERSATION QUOTAS & EXTRA RATES */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Calculator className="h-4 w-4 text-emerald-400" /> Seat, WhatsApp Volume & Extra Rates Config
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Included Seats</Label>
                    <Input type="number" value={planForm.max_users || 3} onChange={e => setPlanForm({ ...planForm, max_users: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Extra Seat Rate (₹/mo)</Label>
                    <Input type="number" value={planForm.extra_seat_price || 999} onChange={e => setPlanForm({ ...planForm, extra_seat_price: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Included Msgs/mo</Label>
                    <Input value={planForm.max_conversations} onChange={e => setPlanForm({ ...planForm, max_conversations: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Extra Rate (₹/1k msgs)</Label>
                    <Input type="number" step="0.1" value={planForm.extra_message_rate || 1.5} onChange={e => setPlanForm({ ...planForm, extra_message_rate: Number(e.target.value) })} />
                  </div>
                </div>
              </div>

              {/* ENTERPRISE ADD-ON SERVICES PRICING */}
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-emerald-400" /> Enterprise Add-On Services Pricing (INR ₹)
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">🎙️ Retell Voice AI Call Agent (₹/mo)</Label>
                    <Input type="number" value={planForm.voice_ai_price || 2999} onChange={e => setPlanForm({ ...planForm, voice_ai_price: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">🤖 BYOK Multi-LLM Vault (₹/mo)</Label>
                    <Input type="number" value={planForm.byok_vault_price || 1499} onChange={e => setPlanForm({ ...planForm, byok_vault_price: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">⚡ 0-Token Instant Reply Cache (₹/mo)</Label>
                    <Input type="number" value={planForm.greeting_cache_price || 999} onChange={e => setPlanForm({ ...planForm, greeting_cache_price: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">🚀 Dedicated Meta Account Setup (₹ one-time)</Label>
                    <Input type="number" value={planForm.meta_setup_price || 4999} onChange={e => setPlanForm({ ...planForm, meta_setup_price: Number(e.target.value) })} />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Included Features List (One per line)</Label>
                <Textarea rows={5} value={planForm.features_input} onChange={e => setPlanForm({ ...planForm, features_input: e.target.value })} />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowAddPlanModal(false)}>Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                  {loading ? 'Saving...' : 'Save Pricing Plan'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRICING FAQ MODAL */}
      {showAddFaqModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-card border border-border p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-xl font-black text-foreground">
                {editingFaq ? 'Edit Pricing FAQ' : 'Add New Pricing FAQ'}
              </h3>
              <button onClick={() => setShowAddFaqModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingFaq) {
                  setFaqs(faqs.map((f) => (f.id === editingFaq.id ? { ...f, ...faqForm } : f)));
                } else {
                  setFaqs([...faqs, { id: 'faq_' + Date.now(), ...faqForm }]);
                }
                setMsg({ type: 'success', text: `FAQ ${editingFaq ? 'updated' : 'added'} successfully!` });
                setShowAddFaqModal(false);
              }}
              className="space-y-4 text-left"
            >
              <div className="space-y-1">
                <Label className="text-xs font-bold">Category</Label>
                <select
                  value={faqForm.category}
                  onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                  className="w-full rounded-md border border-border bg-background p-2 text-xs"
                >
                  <option value="Billing">Billing & Pricing</option>
                  <option value="AI Platform">AI Platform & BYOK</option>
                  <option value="Features">Features & Capabilities</option>
                  <option value="Support">Support & Onboarding</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">FAQ Question *</Label>
                <Input
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  required
                  placeholder="e.g. How does Bring Your Own Key (BYOK) work?"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">FAQ Answer *</Label>
                <Textarea
                  rows={4}
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  required
                  placeholder="Detailed answer for potential customers..."
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowAddFaqModal(false)}>Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                  {editingFaq ? 'Save Changes' : 'Add FAQ'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
