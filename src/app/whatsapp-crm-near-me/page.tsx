import { Metadata } from 'next';
import Link from 'next/link';
import {
  CheckCircle2,
  MessageSquare,
  Bot,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  PhoneCall,
  Flame,
  BarChart3,
  Globe,
  MapPin,
  Building2,
  GraduationCap,
  ShoppingBag,
  Stethoscope,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'WhatsApp CRM Near Me | Meta Approved Business API Provider Near You',
  description: 'Looking for a WhatsApp CRM provider near you? NGTech WCRM provides official Meta-approved WhatsApp Business API, AI chatbots, multi-agent shared inbox & instant local support across India.',
  keywords: [
    'WhatsApp CRM near me',
    'WhatsApp Business API provider near me',
    'WhatsApp automation company near me',
    'WhatsApp marketing software near me',
    'WhatsApp shared inbox near me',
    'WhatsApp AI chatbot near me',
    'WhatsApp Business green tick provider near me',
  ],
  alternates: {
    canonical: 'https://ngtechwcrm.nighwantech.com/whatsapp-crm-near-me',
  },
  openGraph: {
    title: 'WhatsApp CRM Near Me | Official Meta Approved API Provider',
    description: 'Connect with India’s top-rated WhatsApp CRM & Business API provider near you. Instant 10-min setup, AI auto-replies, and local support.',
    url: 'https://ngtechwcrm.nighwantech.com/whatsapp-crm-near-me',
    siteName: 'NGTech WCRM',
    locale: 'en_IN',
    type: 'website',
    images: ['https://ngtechwcrm.nighwantech.com/logo.png'],
  },
};

export default function NearMeSEOPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'NGTech WCRM - WhatsApp CRM Near Me',
    description: 'Top-rated Meta Approved WhatsApp Business API & CRM provider near you in India.',
    url: 'https://ngtechwcrm.nighwantech.com/whatsapp-crm-near-me',
    telephone: '+91 8985025794',
    email: 'mahendra@nighwantech.com',
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 17.385,
      longitude: 78.4867,
    },
    areaServed: 'IN',
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground relative">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
            <img src="/logo.png" alt="NGTech WCRM Logo" className="h-9 w-9 rounded-lg" />
            <span>NGTech <span className="text-emerald-500">WCRM</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition">Features</Link>
            <Link href="#industries" className="hover:text-foreground transition">Industries Near You</Link>
            <Link href="#pricing" className="hover:text-foreground transition">Pricing</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="tel:+918985025794" className="inline-flex">
              <Button variant="outline" size="sm" className="gap-2 rounded-full border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-500/20">
                <PhoneCall className="h-4 w-4 text-emerald-500 animate-pulse" /> Call +91 8985025794
              </Button>
            </Link>
            <Link href="/free-trial" className="hidden sm:inline-flex">
              <Button size="sm" className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md gap-1.5">
                Free Trial <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border py-16 sm:py-24 bg-gradient-to-b from-emerald-500/10 via-background to-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <MapPin className="h-4 w-4 text-emerald-500 animate-bounce" />
                📍 Official Meta Approved WhatsApp Business API Provider Near You
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                Top WhatsApp CRM & Automation Software <span className="text-emerald-500">Near You</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Looking for the best WhatsApp CRM near you? NGTech WCRM provides Meta-approved WhatsApp Business API, AI chatbots, multi-agent shared inbox & dedicated local setup support across India.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="tel:+918985025794">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 gap-2 font-bold shadow-lg shadow-emerald-500/20 text-base">
                    <PhoneCall className="h-5 w-5 animate-pulse text-white" /> Call +91 8985025794
                  </Button>
                </Link>
                <Link href="/free-trial">
                  <Button size="lg" variant="outline" className="rounded-full px-8 gap-2 border-emerald-500/40 text-foreground hover:bg-emerald-500/10 font-bold text-base">
                    Start 14-Day Free Trial <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-6 text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Official Meta API
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-amber-500" /> 10-Min Setup Near You
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" /> Green Tick Support
                </div>
              </div>
            </div>

            {/* Visual Card */}
            <div className="relative">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400"></span>
                    <span className="h-3 w-3 rounded-full bg-amber-400"></span>
                    <span className="h-3 w-3 rounded-full bg-emerald-400"></span>
                    <span className="ml-2 text-xs font-semibold text-muted-foreground">NGTech WCRM — Nearby Business Hub</span>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">
                    📍 Active Near You
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-sm">
                        💬
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Nearby Customer Inquiry</p>
                        <p className="text-[11px] text-muted-foreground">"Need WhatsApp API for my local business..."</p>
                      </div>
                    </div>
                    <Badge className="bg-red-500/10 text-red-500 border border-red-500/20 text-[10px]">
                      🔥 HOT LEAD
                    </Badge>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bot className="h-5 w-5 text-emerald-500 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-foreground">Gemini AI Auto-Replied (2s)</p>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400">"Sent catalog & connected to local rep..."</p>
                      </div>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Grid Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4 max-w-6xl space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="outline" className="text-xs font-mono uppercase text-emerald-600 border-emerald-500/30">
              Why Businesses Choose Us Near You
            </Badge>
            <h2 className="text-3xl font-extrabold text-foreground">
              Everything You Need to Grow Your Business Near You
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Fastest onboarding, official Meta green-tick support, and local assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border space-y-4 hover:border-emerald-500/40 transition">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 w-fit">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Multi-Agent Shared Inbox</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect your team on a single official WhatsApp number. Assign leads to sales agents, tag team members, and track response times.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border space-y-4 hover:border-emerald-500/40 transition">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 w-fit">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">24/7 Gemini AI Chatbot</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Respond to customer inquiries in 2 seconds in Hindi, English, and regional languages. Automatically qualify leads and book appointments.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border space-y-4 hover:border-emerald-500/40 transition">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 w-fit">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Bulk Promotional Broadcasts</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Send thousands of approved WhatsApp broadcast templates for festival offers, new arrivals, and re-engagement campaigns with 100% deliverability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-20 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 text-white text-center space-y-6">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          <Badge className="bg-emerald-500/30 text-white border-emerald-400/40 text-xs px-3.5 py-1 backdrop-blur font-bold">
            Meta Approved Partner Near You
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Connect With The Best WhatsApp CRM Near You
          </h2>
          <p className="text-emerald-100 text-base max-w-xl mx-auto font-medium">
            Get started in 10 minutes. Speak to our team directly.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="tel:+918985025794">
              <Button size="lg" className="bg-white text-emerald-950 hover:bg-emerald-100 rounded-full px-8 font-black shadow-2xl text-base gap-2.5 border-2 border-white">
                <PhoneCall className="h-5 w-5 text-emerald-600 animate-bounce" /> Call +91 8985025794
              </Button>
            </Link>
            <Link href="/free-trial">
              <Button size="lg" variant="outline" className="bg-emerald-900/80 hover:bg-emerald-900 text-white border-2 border-emerald-400/60 rounded-full px-8 gap-2 font-bold text-base shadow-xl">
                Start 14-Day Free Trial <ArrowRight className="h-4 w-4 text-emerald-400" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Sticky Call Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          href="tel:+918985025794"
          className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-full shadow-2xl border-2 border-emerald-300/50 transition-all duration-300 hover:scale-105"
        >
          <PhoneCall className="h-5 w-5 animate-pulse text-amber-300" />
          <span className="font-extrabold text-sm tracking-wide">Call +91 8985025794</span>
        </Link>
      </div>
    </div>
  );
}
