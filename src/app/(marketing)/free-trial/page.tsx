'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Sparkles, Bot, ShieldCheck, Zap, Layers } from 'lucide-react'

export default function FreeTrialPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs font-mono">Loading free trial setup…</div>}>
      <FreeTrialInner />
    </Suspense>
  )
}

function FreeTrialInner() {
  const searchParams = useSearchParams()
  const planParam = searchParams.get('plan') || 'growth'
  const agentsParam = searchParams.get('agents') || '4'
  const leadsParam = searchParams.get('leads') || '10000'
  const salaryParam = searchParams.get('salary') || '30000'
  const roiParam = searchParams.get('roi') || '40.4x'

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [phone, setPhone] = useState('')

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    // Strictly filter out letters and non-phone characters (allow digits, leading +, spaces, hyphens)
    const sanitized = raw.replace(/[^\d+\s-]/g, '')
    setPhone(sanitized)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const emailVal = String(formData.get('email') || '').trim()

    // 1. Email Validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      setError('Please enter a valid business email address.')
      setLoading(false)
      return
    }

    // 2. Phone Validation
    const digitsOnly = phone.replace(/\D/g, '')
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      setError('Please enter a valid WhatsApp mobile number with 7 to 15 digits.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.get('fullName'),
          email: emailVal,
          mobileNumber: phone,
          companyName: formData.get('company'),
          teamSize: formData.get('teamSize') || `${agentsParam} Agents`,
          messageVolume: formData.get('messageVolume') || `${leadsParam} Leads`,
          planSlug: planParam,
          expectedRoi: roiParam,
          leadSource: 'Free Trial Calculator Form',
          landingPageUrl: window.location.href,
        })
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => null)
        throw new Error(errData?.error || 'Failed to submit request. Please try again.')
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-card border border-border shadow-2xl">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-black text-foreground">Welcome to WCRM Platform!</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your 7-day free trial request for <strong className="text-emerald-400 uppercase">{planParam} Plan ({agentsParam} Agents)</strong> has been created. Check your WhatsApp & email for setup instructions.
          </p>
          <Link href="/dashboard" className="w-full inline-flex h-12 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-lg">
            Go to Platform Dashboard →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-16 lg:py-24 text-left">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left Value Narrative */}
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400">
              <Sparkles className="h-4 w-4" /> 7-Day Risk-Free Trial · No Credit Card Required
            </div>

            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.08]">
              Start Your 7-Day Free Trial on WCRM
            </h1>

            <p className="text-base text-muted-foreground leading-relaxed">
              Join hundreds of high-growth teams automating customer support, sales pipelines, and WhatsApp broadcast campaigns with zero platform token markups.
            </p>

            <div className="space-y-4 pt-2">
              {[
                "Unlimited team seats during 7-day trial",
                "Bring Your Own Key (BYOK) multi-model AI routing",
                "Visual Kanban sales deals pipeline",
                "Retell Voice AI integration & call logging",
                "1-on-1 dedicated setup onboarding session"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-xs font-bold text-foreground">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-3">
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                &ldquo;WCRM transformed our student admission counseling. Response times dropped by 80% with Gemini AI auto-responders.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-1">
                <div className="h-9 w-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  BP
                </div>
                <div>
                  <p className="text-xs font-extrabold text-foreground">Director of Admissions</p>
                  <p className="text-[10px] text-emerald-400 font-mono">BPTPIA Institutions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Lead Capture Form */}
          <div className="lg:col-span-6 p-8 rounded-3xl bg-card border border-border/80 shadow-2xl space-y-6 relative">
            
            {/* Parsed Telemetry Callout */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
              <div className="flex items-center justify-between font-mono">
                <span className="text-emerald-400 font-extrabold uppercase">CALCULATOR TELEMETRY DETECTED</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-black">{roiParam} ROI</span>
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-muted-foreground pt-1 border-t border-emerald-500/20">
                <div>Plan: <strong className="text-foreground uppercase">{planParam}</strong></div>
                <div>Team: <strong className="text-foreground">{agentsParam} Agents</strong></div>
                <div>Volume: <strong className="text-foreground">{Number(leadsParam).toLocaleString()} Leads/mo</strong></div>
                <div>Trial: <strong className="text-emerald-400">7 Days Free</strong></div>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Full Name *</label>
                <input
                  name="fullName"
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Business Email *</label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="rahul@company.com"
                    className="w-full rounded-xl border border-border bg-background p-3 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">WhatsApp Mobile Number *</label>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-border bg-background p-3 text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Company Name *</label>
                <input
                  name="company"
                  type="text"
                  required
                  placeholder="e.g. UrbanStyle D2C Enterprises"
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Team Size</label>
                  <select
                    name="teamSize"
                    defaultValue={`${agentsParam} Agents`}
                    className="w-full rounded-xl border border-border bg-background p-3 text-xs outline-none focus:border-emerald-500"
                  >
                    <option value="1-3 Agents">1-3 Agents</option>
                    <option value="4-10 Agents">4-10 Agents</option>
                    <option value="10+ Agents">10+ Agents</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Monthly Inquiries</label>
                  <select
                    name="messageVolume"
                    defaultValue={`${leadsParam} Leads`}
                    className="w-full rounded-xl border border-border bg-background p-3 text-xs outline-none focus:border-emerald-500"
                  >
                    <option value="<5,000 Leads/mo">&lt; 5,000 / mo</option>
                    <option value="5,000-25,000 Leads/mo">5,000 - 25,000 / mo</option>
                    <option value="25,000+ Leads/mo">25,000+ / mo</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex h-14 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm transition-all shadow-xl shadow-emerald-500/25 mt-4"
              >
                {loading ? 'Activating 7-Day Trial…' : 'Activate 7-Day Free Trial Now →'}
              </button>

              <p className="text-[11px] text-center text-muted-foreground pt-1">
                By clicking activate, you agree to WCRM Terms of Service. No credit card required.
              </p>
            </form>

          </div>

        </div>
      </div>
    </div>
  )
}
