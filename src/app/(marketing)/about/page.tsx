import { Metadata } from 'next'
import Link from 'next/link'
import {
  Sparkles,
  Building2,
  CheckCircle2,
  Users,
  Award,
  Globe,
  Zap,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
  Bot,
  Factory,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'About Us | Nighwan Technology & NGTech WCRM',
  description:
    'Learn about NGTech WCRM, built by Nighwan Technology Pvt. Ltd. — pioneers in AI automation, Industry 4.0, and Meta-approved WhatsApp Business API solutions.',
}

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 py-20 lg:py-28 bg-gradient-to-b from-emerald-500/10 via-background to-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest gap-2">
              <Building2 className="h-4 w-4 text-emerald-500" /> A Division of Nighwan Technology Pvt. Ltd.
            </Badge>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Architects of the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">Digital Future</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-normal">
              NGTech WCRM is engineered by <strong className="text-foreground">Nighwan Technology</strong> — bridging the gap between operational strategy and intelligent WhatsApp automation for MSMEs and global enterprises.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link href="/free-trial">
                <Button size="lg" className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 shadow-xl gap-2">
                  Start 14-Day Free Trial <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="rounded-full border-border font-semibold px-8">
                  Contact NighwanTech
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers That Define Excellence */}
      <section className="py-16 bg-muted/30 border-b border-border/40">
        <div className="container mx-auto px-4 max-w-7xl space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-xs font-mono uppercase tracking-widest text-emerald-500 font-bold">Proven Track Record</h2>
            <h3 className="text-3xl font-extrabold text-foreground">Numbers That Define Excellence</h3>
            <p className="text-sm text-muted-foreground">Built on precision, innovation, and consistent delivery since 2020.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border text-center space-y-2 hover:border-emerald-500/40 transition">
              <Users className="h-8 w-8 text-emerald-500 mx-auto" />
              <p className="text-3xl font-black text-foreground">18+</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Years Cumulative Exp</p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border text-center space-y-2 hover:border-emerald-500/40 transition">
              <Globe className="h-8 w-8 text-blue-500 mx-auto" />
              <p className="text-3xl font-black text-foreground">1,000+</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Digital Projects</p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border text-center space-y-2 hover:border-emerald-500/40 transition">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
              <p className="text-3xl font-black text-foreground">100%</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Success Uptime SLA</p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border text-center space-y-2 hover:border-emerald-500/40 transition">
              <Award className="h-8 w-8 text-amber-500 mx-auto" />
              <p className="text-3xl font-black text-foreground">2020</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Founded Date</p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border text-center space-y-2 hover:border-emerald-500/40 transition col-span-2 md:col-span-1">
              <Clock className="h-8 w-8 text-purple-500 mx-auto" />
              <p className="text-3xl font-black text-foreground">02 Min</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg Support Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Parent Company Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="text-xs font-mono uppercase text-emerald-600 border-emerald-500/30">
                Nighwan Technology Legacy
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
                Empowering Businesses Through Smart Automation & Industry 4.0
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Founded on <strong className="text-foreground">25th September 2020</strong>, Nighwan Technology Pvt. Ltd. operates at the intersection of enterprise software, Industry 4.0, and artificial intelligence.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                We observed that millions of Indian MSMEs and fast-growing businesses struggled to manage customer communications across fragmented tools. To solve this, we created <strong className="text-emerald-500">NGTech WCRM</strong> — an all-in-one Meta-approved WhatsApp CRM platform that turns messaging into automated sales pipelines.
              </p>

              <div className="pt-2 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border space-y-1">
                  <h4 className="font-bold text-foreground text-sm">Quality &gt; Quantity</h4>
                  <p className="text-xs text-muted-foreground">Uncompromising engineering standards</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border space-y-1">
                  <h4 className="font-bold text-emerald-500 text-sm">Time &lt; Effort</h4>
                  <p className="text-xs text-muted-foreground">Ultra-fast 10-minute setup</p>
                </div>
              </div>
            </div>

            {/* Visual Card */}
            <div className="relative">
              <div className="rounded-3xl border border-border bg-card p-8 shadow-2xl space-y-6">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <img src="/logo.png" alt="NGTech Logo" className="h-10 w-10 rounded-xl" />
                  <div>
                    <h3 className="font-bold text-foreground">Nighwan Technology Pvt. Ltd.</h3>
                    <p className="text-xs text-muted-foreground">Registered Corporate Enterprise</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Official Meta Approved Partner</h4>
                      <p className="text-xs text-muted-foreground">Direct integration with official WhatsApp Cloud API</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Bot className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Private AI & Gemini RAG Agents</h4>
                      <p className="text-xs text-muted-foreground">24/7 intelligent automated customer support</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Factory className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Industry 4.0 & Lean Ops</h4>
                      <p className="text-xs text-muted-foreground">Custom ERPs and lean workflow optimization</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technological Pillars */}
      <section className="py-20 bg-muted/20 border-t border-border/40">
        <div className="container mx-auto px-4 max-w-6xl space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-foreground">Technological Excellence</h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Future-proof engineering designed by Nighwan Technology to scale your revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 w-fit">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">NGTech WCRM</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Multi-agent shared inbox, automated broadcasts, and AI lead scoring for WhatsApp.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 w-fit">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Custom ERP & Automation</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Bespoke business ecosystems built for MSME operational realities and data flow.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 w-fit">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Lean Operational Consultancy</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Integrating Kaizen and 5S methodologies to eliminate waste and optimize sales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 text-white text-center">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          <Badge className="bg-white/20 text-white border-white/30 text-xs px-3.5 py-1">
            Build Your Future With Us
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Supercharge Your Sales?
          </h2>
          <p className="text-emerald-100 text-base max-w-xl mx-auto font-medium">
            Join 1,000+ businesses scaling on WhatsApp with Nighwan Technology.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link href="/free-trial">
              <Button size="lg" className="bg-white text-emerald-950 hover:bg-emerald-100 rounded-full px-8 font-extrabold shadow-2xl">
                Start 14-Day Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
