import Link from 'next/link'
import { ArrowRight, CheckCircle2, MessageSquare, Zap, Users, BarChart3, PlayCircle } from 'lucide-react'
import { FeatureImage } from '@/components/ui/feature-image'

export const metadata = {
  title: "NGTech WCRM | India's Leading WhatsApp CRM",
  description: "Automate sales, support, and marketing on WhatsApp with NGTech WCRM. The ultimate Shared Team Inbox and CRM platform for growing businesses.",
}

export default function MarketingHomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/20 blur-[120px] rounded-[100%] pointer-events-none -z-10" />
        
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
            Introducing NGTech WCRM 2.0 — The Ultimate WhatsApp Platform
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 max-w-4xl mx-auto leading-tight">
            Turn WhatsApp into your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Revenue Engine</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            The all-in-one CRM and Shared Team Inbox built for ambitious Indian businesses. Automate support, launch broadcast campaigns, and close more deals directly on WhatsApp.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link href="/free-trial" className="flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground transition-all hover:bg-primary-hover hover:scale-105 w-full sm:w-auto shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] shadow-primary/50">
              Start 14-Day Free Trial
            </Link>
            <Link href="/book-demo" className="flex h-12 items-center justify-center rounded-lg border border-border bg-card px-8 text-base font-semibold text-foreground transition-all hover:bg-muted hover:border-primary/50 w-full sm:w-auto">
              Book a Demo <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground animate-in fade-in duration-700 delay-500">No credit card required. Setup in 5 minutes.</p>
        </div>

        {/* Dashboard Mockup / Video Placeholder */}
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <div className="relative rounded-2xl border border-border/50 bg-card p-2 shadow-2xl overflow-hidden ring-1 ring-white/10">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <div className="rounded-xl overflow-hidden border border-border/50 bg-background aspect-video relative flex items-center justify-center">
              <iframe
                src="https://www.youtube.com/embed/mNGn31almlY?rel=0"
                title="NGTech WCRM Platform Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Brands */}
      <section className="py-10 border-y border-border/50 bg-muted/20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-medium text-muted-foreground mb-6">TRUSTED BY 5,000+ FAST-GROWING BUSINESSES</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Logos Placeholders */}
            {['Acme Corp', 'GlobalTech', 'EduSmart', 'RealEstate Co', 'HealthPlus'].map((brand, i) => (
              <div key={i} className="text-xl font-bold tracking-tighter text-foreground">{brand}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">Everything you need to scale on WhatsApp</h2>
            <p className="text-lg text-muted-foreground">Replace disjointed tools with one powerful ecosystem. From AI chatbots to bulk broadcasting, we've got you covered.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<MessageSquare className="h-6 w-6 text-primary" />}
              title="Shared Team Inbox"
              description="Collaborate with your entire team on a single WhatsApp number. Assign chats, add internal notes, and resolve queries faster."
            />
            <FeatureCard 
              icon={<Zap className="h-6 w-6 text-primary" />}
              title="Automated Workflows"
              description="Build no-code automations to route leads, send auto-replies, and trigger sequences based on user actions."
            />
            <FeatureCard 
              icon={<Users className="h-6 w-6 text-primary" />}
              title="Smart Lead CRM"
              description="Capture leads instantly from WhatsApp. Track their journey, score them, and build robust sales pipelines."
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us vs Competitors */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Better than the rest. Designed for scale.</h2>
              <p className="text-lg text-muted-foreground mb-8">Unlike WATI or Interakt, NGTech WCRM provides an incredibly intuitive UI with native CRM capabilities built right in—no third-party syncs required.</p>
              
              <ul className="space-y-4">
                {[
                  'Zero hidden fees or markup on WhatsApp messaging.',
                  'Enterprise-grade security and SOC2 compliance.',
                  'Advanced AI Assistant that actually understands intent.',
                  '24/7 dedicated support via WhatsApp and Phone.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 mr-3 shrink-0" />
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-10">
                <Link href="/pricing" className="text-primary font-semibold hover:underline inline-flex items-center">
                  Compare our pricing plans <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="relative">
              {/* Aesthetic graphic or stats */}
              <div className="aspect-square rounded-2xl bg-gradient-to-tr from-primary/20 to-blue-500/20 border border-border p-8 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/40 blur-3xl rounded-full" />
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/40 blur-3xl rounded-full" />
                
                <div className="bg-background/80 backdrop-blur-md border border-border rounded-xl p-6 shadow-2xl relative z-10 mb-4 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <p className="text-sm text-muted-foreground mb-1">Conversion Rate Increase</p>
                  <p className="text-4xl font-black text-foreground">+340%</p>
                </div>
                <div className="bg-background/80 backdrop-blur-md border border-border rounded-xl p-6 shadow-2xl relative z-10 ml-auto transform rotate-3 hover:rotate-0 transition-transform duration-500 w-3/4">
                  <p className="text-sm text-muted-foreground mb-1">Response Time</p>
                  <p className="text-4xl font-black text-foreground">&lt; 2 mins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Ready to transform your customer communications?</h2>
          <p className="text-xl text-muted-foreground mb-10">Join thousands of businesses that trust NGTech WCRM to grow their revenue.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/free-trial" className="flex h-14 items-center justify-center rounded-lg bg-primary px-10 text-lg font-bold text-primary-foreground transition-all hover:bg-primary-hover hover:scale-105 shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] shadow-primary/50 w-full sm:w-auto">
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 group">
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
