import Link from 'next/link'
import { ArrowRight, CheckCircle2, MessageSquare, Zap, Users, BarChart3, Bot, Shield, Sparkles } from 'lucide-react'
import { PromoPopup } from '@/components/marketing/promo-popup'
import { createClient } from '@/lib/supabase/server'
import { TestimonialCarousel } from '@/components/marketing/testimonial-carousel'

export const metadata = {
  title: "NGTech WCRM | India's Leading WhatsApp CRM",
  description: "Automate sales, support, and marketing on WhatsApp with NGTech WCRM. The ultimate Shared Team Inbox and CRM platform for growing businesses.",
}

export default async function MarketingHomePage() {
  const supabase = await createClient()
  const { data: trustedClients } = await supabase
    .from('saas_trusted_clients')
    .select('id, name, url, testimonial_text, author_name, author_role')
    .eq('is_active', true)
    .order('order_index', { ascending: true })

  const clients = trustedClients && trustedClients.length > 0
    ? trustedClients
    : [
        { id: '1', name: 'Acme Corp', url: null, testimonial_text: null, author_name: null, author_role: null },
        { id: '2', name: 'GlobalTech', url: null, testimonial_text: null, author_name: null, author_role: null },
        { id: '3', name: 'EduSmart', url: null, testimonial_text: null, author_name: null, author_role: null },
        { id: '4', name: 'RealEstate Co', url: null, testimonial_text: null, author_name: null, author_role: null },
        { id: '5', name: 'HealthPlus', url: null, testimonial_text: null, author_name: null, author_role: null }
      ];

  return (
    <div className="flex flex-col">

      {/* ══════════════════════════════════════════════════════════
          HERO SECTION — AI-POWERED REVENUE ENGINE
          ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-20 pb-28 lg:pt-28 lg:pb-40">
        {/* Ambient background blobs & glow */}
        <div className="absolute top-[-100px] left-1/4 w-[500px] h-[500px] bg-emerald-500/20 blur-[160px] rounded-full pointer-events-none -z-10 animate-pulse" />
        <div className="absolute top-[100px] right-1/4 w-[450px] h-[450px] bg-blue-500/15 blur-[140px] rounded-full pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-transparent to-background pointer-events-none -z-10" />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* AI Pill Badge */}
          <div className="inline-flex items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md px-4 py-1.5 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="h-4 w-4 text-emerald-500 mr-2 animate-bounce" />
            <span className="tracking-wide">Powered by Gemini 1.5 Pro AI & Meta Official WhatsApp API</span>
          </div>

          {/* Main AI Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-[4.5rem] font-black tracking-tight text-foreground max-w-4xl mx-auto leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Turn WhatsApp into your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-500 drop-shadow-sm">
              AI-Powered Revenue Engine
            </span>
          </h1>

          {/* AI Subtitle */}
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 leading-relaxed font-normal">
            Automate <strong className="text-foreground font-semibold">90% of customer support</strong> with 24/7 Gemini AI Agents, qualify leads in 2 seconds with real-time AI intent scoring, and launch Meta-approved broadcast campaigns that convert.
          </p>

          {/* Floating AI Micro-Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-bold text-muted-foreground animate-in fade-in slide-in-from-bottom-9 duration-700 delay-250">
            <span className="px-3.5 py-1.5 rounded-full bg-card border border-border shadow-sm flex items-center gap-1.5 text-foreground">
              🤖 24/7 Gemini AI Support
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-card border border-border shadow-sm flex items-center gap-1.5 text-foreground">
              🔥 AI Lead Intent Scoring
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-card border border-border shadow-sm flex items-center gap-1.5 text-foreground">
              💬 Shared Multi-Agent Inbox
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-card border border-border shadow-sm flex items-center gap-1.5 text-foreground">
              ⚡ Meta Green Tick Partner
            </span>
          </div>

          {/* CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link
              href="/free-trial"
              className="flex h-13 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-9 text-base transition-all duration-300 shadow-xl shadow-emerald-500/20 hover:scale-[1.03] w-full sm:w-auto gap-2"
            >
              Start 14-Day Free Trial <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/book-demo"
              className="flex h-13 items-center justify-center rounded-full border-2 border-emerald-500/40 bg-card/60 backdrop-blur-sm px-9 text-base font-bold text-foreground transition-all duration-300 hover:bg-emerald-500/10 w-full sm:w-auto group"
            >
              Book AI Live Demo
            </Link>
          </div>
          <p className="text-xs font-semibold text-muted-foreground/70 animate-in fade-in duration-700 delay-500">
            ✓ 14-Day Free Trial · ✓ Zero Credit Card Required · ✓ 10-Minute Instant Setup
          </p>
        </div>

        {/* Dashboard Video & Live AI Agent Simulation Mockup */}
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 space-y-6">
          {/* Live AI Agent Simulation Banner */}
          <div className="rounded-2xl border border-emerald-500/30 bg-card/90 backdrop-blur-xl p-5 shadow-2xl space-y-3 max-w-2xl mx-auto">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-emerald-500 animate-pulse" />
                <span className="text-xs font-extrabold text-foreground tracking-wide">Gemini 1.5 Pro AI Agent — Live Conversation</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] font-bold">
                ⚡ 2s Response Uptime
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-left">
              <div className="p-3 rounded-xl bg-muted/60 border border-border flex items-start gap-2.5">
                <span className="h-6 w-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold shrink-0 text-[10px]">👤</span>
                <div>
                  <p className="font-bold text-foreground">Inbound Customer Inquiry</p>
                  <p className="text-muted-foreground">"Looking for WhatsApp API & CRM pricing for our business in India..."</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5">
                <Bot className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">Gemini AI Automated Auto-Reply (2s)</p>
                  <p className="text-foreground font-medium">"Sent pricing catalog PDF 📄 & auto-tagged HOT 🔥 lead for senior sales rep!"</p>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Video Frame */}
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-emerald-500/40 via-border/30 to-transparent shadow-2xl shadow-emerald-500/10">
            <div className="rounded-2xl bg-card/80 backdrop-blur-xl p-2 overflow-hidden">
              <div className="rounded-xl overflow-hidden border border-border/30 bg-background aspect-video relative">
                <iframe
                  src="https://www.youtube.com/embed/mNGn31almlY?rel=0"
                  title="NGTech WCRM AI Platform Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TRUSTED BY — Infinite Marquee
          ══════════════════════════════════════════════════════════ */}
      <section className="py-8 border-y border-border/20 bg-muted/10 overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center mb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/50">
            Trusted by 5,000+ fast-growing businesses
          </p>
        </div>
        <div className="relative">
          {/* Gradient fades on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          {/* Scrolling track */}
          <div className="flex animate-marquee whitespace-nowrap">
            {[...clients, ...clients, ...clients, ...clients].map((brand, i) => (
              <div key={`${brand.id}-${i}`} className="flex items-center mx-8 sm:mx-12">
                {brand.url ? (
                  <a href={brand.url} target="_blank" rel="noopener noreferrer" className="text-lg sm:text-xl font-bold tracking-tight text-foreground/30 hover:text-primary/60 transition-colors duration-300 whitespace-nowrap">
                    {brand.name}
                  </a>
                ) : (
                  <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground/30 whitespace-nowrap">
                    {brand.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TESTIMONIALS
          ══════════════════════════════════════════════════════════ */}
      {clients.some(c => c.testimonial_text) && (
        <section id="testimonials" className="py-24 bg-background border-t border-border/20">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-3">Testimonials</p>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-5">
                Loved by{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-violet-500">
                  growing teams
                </span>
              </h2>
              <p className="text-muted-foreground/70 text-base">
                See what our customers have to say about scaling their sales and support with NGTech WCRM.
              </p>
            </div>

            <TestimonialCarousel
              testimonials={clients.filter(c => c.testimonial_text).map(c => ({
                id: c.id,
                name: c.name,
                url: c.url,
                testimonial_text: c.testimonial_text!,
                author_name: c.author_name,
                author_role: c.author_role
              }))}
            />
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          FEATURES GRID
          ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-background relative">
        {/* Faint grid pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-3">Features</p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-5">
              Everything you need to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-violet-500">
                scale on WhatsApp
              </span>
            </h2>
            <p className="text-muted-foreground/70 text-base">
              Replace disjointed tools with one powerful ecosystem. From AI chatbots to bulk broadcasting, we&apos;ve got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon={<MessageSquare className="h-5 w-5" />}
              title="Shared Team Inbox"
              description="Collaborate with your entire team on a single WhatsApp number. Assign chats, add internal notes, and resolve queries faster."
            />
            <FeatureCard
              icon={<Zap className="h-5 w-5" />}
              title="Automated Workflows"
              description="Build no-code automations to route leads, send auto-replies, and trigger sequences based on user actions."
            />
            <FeatureCard
              icon={<Users className="h-5 w-5" />}
              title="Smart Lead CRM"
              description="Capture leads instantly from WhatsApp. Track their journey, score them, and build robust sales pipelines."
            />
            <FeatureCard
              icon={<Bot className="h-5 w-5" />}
              title="AI-Powered Chatbot"
              description="Deploy intelligent chatbots that understand intent, respond in multiple languages, and hand off seamlessly to agents."
            />
            <FeatureCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="Advanced Analytics"
              description="Track response times, team performance, SLA compliance, and revenue impact with real-time dashboards."
            />
            <FeatureCard
              icon={<Shield className="h-5 w-5" />}
              title="Enterprise Security"
              description="Role-based access control, audit logs, and end-to-end encryption. Your customer data stays protected."
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          WHY CHOOSE US — Comparison
          ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-card/40 border-y border-border/20 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/8 blur-[150px] rounded-full pointer-events-none" />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary mb-3">Why NGTech</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5 leading-tight">
                Better than the rest.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                  Designed for scale.
                </span>
              </h2>
              <p className="text-muted-foreground/70 mb-8 leading-relaxed">
                Unlike WATI or Interakt, NGTech WCRM provides an incredibly intuitive UI with native CRM capabilities built right in—no third-party syncs required.
              </p>

              <ul className="space-y-4">
                {[
                  'Zero hidden fees or markup on WhatsApp messaging.',
                  'Enterprise-grade security and SOC2 compliance.',
                  'Advanced AI Assistant that actually understands intent.',
                  '24/7 dedicated support via WhatsApp (+91 80922 25777) and Direct Call (+91 8985025794).'
                ].map((item, i) => (
                  <li key={i} className="flex items-start group">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mr-3 mt-0.5 shrink-0 group-hover:bg-emerald-500/20 transition-colors duration-200">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-foreground/90 text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <Link href="/pricing" className="text-primary font-semibold hover:underline inline-flex items-center text-sm group">
                  Compare our pricing plans
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Stats showcase */}
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 border border-border/20 p-8 flex flex-col justify-center gap-6 relative overflow-hidden">
                {/* Glow spots */}
                <div className="absolute -right-16 -top-16 w-40 h-40 bg-primary/20 blur-[80px] rounded-full" />
                <div className="absolute -left-16 -bottom-16 w-40 h-40 bg-blue-500/20 blur-[80px] rounded-full" />

                <div className="bg-card/80 backdrop-blur-xl border border-border/30 rounded-2xl p-6 shadow-xl relative z-10 transform -rotate-2 hover:rotate-0 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1">Conversion Rate Increase</p>
                  <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">+340%</p>
                </div>
                <div className="bg-card/80 backdrop-blur-xl border border-border/30 rounded-2xl p-6 shadow-xl relative z-10 ml-auto transform rotate-2 hover:rotate-0 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 w-3/4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1">Avg Response Time</p>
                  <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">&lt; 2 min</p>
                </div>
                <div className="bg-card/80 backdrop-blur-xl border border-border/30 rounded-2xl p-6 shadow-xl relative z-10 transform -rotate-1 hover:rotate-0 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 w-2/3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1">Customer Satisfaction</p>
                  <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-primary">98%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FINAL CTA
          ══════════════════════════════════════════════════════════ */}
      <section className="py-32 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[200px] rounded-full pointer-events-none -z-10" />

        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-primary mb-6">
            <Sparkles className="h-3.5 w-3.5 mr-2" />
            <span>Get started today</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Ready to transform your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-violet-500">
              customer communications?
            </span>
          </h2>
          <p className="text-base text-muted-foreground/70 mb-10 max-w-xl mx-auto">
            Join thousands of businesses that trust NGTech WCRM to grow their revenue.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/free-trial"
              className="flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 px-10 text-base font-bold text-primary-foreground transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.03] w-full sm:w-auto"
            >
              Get Started for Free
            </Link>
            <Link
              href="/book-demo"
              className="flex h-14 items-center justify-center rounded-full border border-border/60 bg-card/50 backdrop-blur-sm px-10 text-base font-semibold text-foreground transition-all duration-300 hover:bg-card hover:border-primary/30 w-full sm:w-auto"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      <PromoPopup />
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group relative rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm p-7 transition-all duration-300 hover:bg-card/80 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
      {/* Subtle top gradient line on hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/40 transition-all duration-500 rounded-t-2xl" />
      <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary/15">
        {icon}
      </div>
      <h3 className="text-base font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground/70 leading-relaxed">{description}</p>
    </div>
  )
}
