import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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
  Building2,
  GraduationCap,
  ShoppingBag,
  Stethoscope,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const CITY_DATA: Record<string, { name: string; state: string; headline: string; description: string; highlights: string[] }> = {
  delhi: {
    name: 'Delhi NCR',
    state: 'Delhi',
    headline: '#1 WhatsApp CRM & API Provider in Delhi NCR',
    description: 'Empower your Delhi NCR sales and support teams with Meta-approved WhatsApp Business API, AI chatbots, and multi-agent shared inbox.',
    highlights: ['Serving 500+ businesses across Delhi, Gurgaon, and Noida', 'Instant Meta API setup in under 10 minutes', 'Dedicated local support & setup assistance'],
  },
  mumbai: {
    name: 'Mumbai',
    state: 'Maharashtra',
    headline: 'Leading WhatsApp CRM & Automation Software in Mumbai',
    description: 'Scale your enterprise and small business sales in Mumbai with WhatsApp bulk broadcasts, automated pipelines, and 24/7 AI auto-replies.',
    highlights: ['Tailored for Mumbai real estate, retail, and e-commerce', 'Multi-agent chat routing & team performance tracking', 'Zero message blocking with official Meta API'],
  },
  bangalore: {
    name: 'Bangalore',
    state: 'Karnataka',
    headline: 'Best WhatsApp Business API & CRM for Startups in Bangalore',
    description: 'Built for fast-growing Bangalore tech startups and D2C brands. Automate customer support and turn WhatsApp chats into revenue.',
    highlights: ['Developer-friendly webhooks & REST API integrations', 'AI lead scoring & automated CRM pipeline stages', 'Used by top Bengaluru tech and retail brands'],
  },
  hyderabad: {
    name: 'Hyderabad',
    state: 'Telangana',
    headline: 'Top WhatsApp CRM Platform in Hyderabad',
    description: 'Transform customer engagement in Hyderabad with WhatsApp green-tick API, AI chatbots, and automated broadcast campaigns.',
    highlights: ['Ideal for Hyderabad education, healthcare, and IT firms', '24/7 AI auto-responder with custom knowledge base', 'High deliverability bulk WhatsApp broadcasts'],
  },
  pune: {
    name: 'Pune',
    state: 'Maharashtra',
    headline: 'WhatsApp Business API & CRM Software in Pune',
    description: 'Grow your Pune business with seamless WhatsApp lead management, multi-agent chat assignment, and automated drip sequences.',
    highlights: ['Fast onboarding for Pune manufacturing and educational institutes', 'INR ₹ billing with transparent token usage', 'No-code flow builder for custom chat funnels'],
  },
  ahmedabad: {
    name: 'Ahmedabad',
    state: 'Gujarat',
    headline: 'Best WhatsApp Marketing & CRM Solution in Ahmedabad',
    description: 'Boost Gujarat textile, manufacturing, and retail sales with Meta-approved WhatsApp broadcast software and AI assistants.',
    highlights: ['Gujarati & Hindi language AI chatbot capabilities', 'Bulk broadcast analytics & click-through tracking', 'Local customer success manager support'],
  },
  jaipur: {
    name: 'Jaipur',
    state: 'Rajasthan',
    headline: 'WhatsApp CRM & Business API Services in Jaipur',
    description: 'Supercharge Jaipur tourism, retail, and handicraft sales with automated WhatsApp inquiries and shared team inbox.',
    highlights: ['Quick catalog sharing & automated quote generation', 'Multi-channel chat aggregation (WhatsApp, Meta)', 'Affordable plans for growing Jaipur businesses'],
  },
  chandigarh: {
    name: 'Chandigarh & Mohali',
    state: 'Punjab',
    headline: '#1 WhatsApp CRM Platform in Chandigarh & Mohali',
    description: 'Streamline customer support for Chandigarh and Mohali businesses with official WhatsApp API, AI lead scoring, and team inbox.',
    highlights: ['Local North India support team based in Mohali/Chandigarh', 'Automated appointment booking & lead followup', 'Meta green tick verification assistance'],
  },
  chennai: {
    name: 'Chennai',
    state: 'Tamil Nadu',
    headline: 'WhatsApp Business API & Automation Software in Chennai',
    description: 'Drive customer retention and sales in Chennai with automated WhatsApp broadcasts, AI chatbots, and CRM pipelines.',
    highlights: ['Multilingual AI support for Tamil & English', 'Integrates with your existing ERP & web systems', 'Enterprise-grade security & SLA uptime'],
  },
  kolkata: {
    name: 'Kolkata',
    state: 'West Bengal',
    headline: 'Leading WhatsApp CRM & API Solution in Kolkata',
    description: 'Empower Kolkata businesses with official WhatsApp Business API, automated lead capture, and multi-user chat inbox.',
    highlights: ['Bengali & English AI chatbot responses', 'Bulk promotional broadcast scheduling', 'Seamless lead assignment to sales reps'],
  },
  surat: {
    name: 'Surat',
    state: 'Gujarat',
    headline: 'WhatsApp CRM for Textile & Diamond Businesses in Surat',
    description: 'Accelerate order processing and customer inquiries in Surat with automated WhatsApp broadcast tools and AI chat agents.',
    highlights: ['Specialized templates for Surat textile & diamond industries', 'Instant order status & broadcast updates', 'High speed message delivery'],
  },
  lucknow: {
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    headline: 'Top WhatsApp CRM Software Provider in Lucknow',
    description: 'Help UP businesses capture and convert leads faster on WhatsApp with official API integration and automated workflows.',
    highlights: ['Hindi & English conversational AI support', 'Instant lead notifications & quick call triggers', 'Budget-friendly plans for local businesses'],
  },
  patna: {
    name: 'Patna',
    state: 'Bihar',
    headline: '#1 WhatsApp Business API & CRM Provider in Patna, Bihar',
    description: 'Empower Patna coaching institutes, hospitals, retail, and real estate businesses with Meta-approved WhatsApp API, AI chatbots, and multi-agent team inbox.',
    highlights: ['Specialized for Patna coaching centers & admission inquiries', 'Hindi & English 24/7 AI auto-responder', 'Bulk WhatsApp promotional broadcasts with 100% deliverability'],
  },
  ranchi: {
    name: 'Ranchi',
    state: 'Jharkhand',
    headline: 'Best WhatsApp CRM & Automation Platform in Ranchi, Jharkhand',
    description: 'Boost customer engagement and sales for Ranchi businesses with official Meta WhatsApp API, lead scoring, and automated pipelines.',
    highlights: ['Tailored for Ranchi education, real estate, and healthcare', 'Instant lead qualification & HOT lead alerts', 'Multi-user agent chat routing & performance tracking'],
  },
  gaya: {
    name: 'Gaya Ji',
    state: 'Bihar',
    headline: 'WhatsApp CRM & Business Automation Services in Gaya Ji',
    description: 'Scale your business in Gaya Ji with official WhatsApp Business API, automated inquiry replies, and broadcast campaigns.',
    highlights: ['Automated customer inquiries & quick quote generation', 'Hindi AI chatbot capabilities for local customers', 'Affordable plans with dedicated setup support'],
  },
  muzaffarpur: {
    name: 'Muzaffarpur',
    state: 'Bihar',
    headline: 'WhatsApp Marketing & Business API Solution in Muzaffarpur',
    description: 'Drive growth for Muzaffarpur traders, retailers, and educational institutes with Meta-approved WhatsApp CRM and AI assistants.',
    highlights: ['Bulk broadcast campaigns for promotional offers', 'Shared inbox for team collaboration', 'Easy 10-minute setup with zero coding'],
  },
  bhagalpur: {
    name: 'Bhagalpur',
    state: 'Bihar',
    headline: 'WhatsApp CRM Software in Bhagalpur, Bihar',
    description: 'Automate sales and support for Bhagalpur silk, manufacturing, and retail businesses with WhatsApp Business API.',
    highlights: ['Automated catalog & product sharing', 'AI-driven lead temperature scoring', 'Reliable message delivery with Meta API'],
  },
  dhanbad: {
    name: 'Dhanbad',
    state: 'Jharkhand',
    headline: 'WhatsApp Business API & CRM Provider in Dhanbad',
    description: 'Streamline customer support and lead management for Dhanbad businesses with automated WhatsApp workflows.',
    highlights: ['Multi-agent chat management', 'Automated lead followups & reminders', 'INR ₹ pricing with transparent token usage'],
  },
  jamshedpur: {
    name: 'Jamshedpur',
    state: 'Jharkhand',
    headline: 'Top WhatsApp CRM Platform in Jamshedpur',
    description: 'Empower Jamshedpur industrial and retail enterprises with official WhatsApp API, broadcast tools, and AI chatbots.',
    highlights: ['Enterprise-grade SLA and security', 'Custom CRM pipeline stages', '24/7 AI auto-reply system'],
  },
  indore: {
    name: 'Indore',
    state: 'Madhya Pradesh',
    headline: '#1 WhatsApp CRM & Automation Software in Indore',
    description: 'Accelerate growth for Indore commercial hubs, e-commerce, and food brands with official WhatsApp Business API.',
    highlights: ['Popular among Indore D2C brands & retail chains', 'High-volume promotional WhatsApp broadcasts', 'Automated sales funnels & lead distribution'],
  },
  bhopal: {
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    headline: 'WhatsApp Business API & CRM Services in Bhopal',
    description: 'Transform customer conversations into sales in Bhopal with AI-powered WhatsApp CRM and team inbox.',
    highlights: ['Ideal for Bhopal educational institutes & coaching', 'Meta green tick badge verification guidance', '24/7 automated lead response'],
  },
  nagpur: {
    name: 'Nagpur',
    state: 'Maharashtra',
    headline: 'Best WhatsApp Marketing & CRM Tool in Nagpur',
    description: 'Empower Nagpur businesses with Meta-approved WhatsApp API, automated broadcast campaigns, and lead scoring.',
    highlights: ['Hindi & Marathi AI chatbot options', 'Seamless team chat assignment', 'Full broadcast performance analytics'],
  },
  varanasi: {
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    headline: 'WhatsApp CRM & Business API Provider in Varanasi (Banaras)',
    description: 'Boost Varanasi saree, tourism, hotel, and retail sales with automated WhatsApp customer support and AI chat assistants.',
    highlights: ['Automated guest and customer inquiry handling', 'Hindi AI auto-responder for instant answers', 'Easy setup for local Banaras businesses'],
  },
  dehradun: {
    name: 'Dehradun',
    state: 'Uttarakhand',
    headline: 'WhatsApp CRM Platform in Dehradun & Uttarakhand',
    description: 'Help Dehradun schools, boarding institutes, tourism, and real estate brands engage leads faster on WhatsApp.',
    highlights: ['Specialized for Dehradun boarding schools & tourism', 'Automated lead followup & admission forms', 'Dedicated North India support team'],
  },
  raipur: {
    name: 'Raipur',
    state: 'Chhattisgarh',
    headline: 'Top WhatsApp Business API Software in Raipur',
    description: 'Drive sales for Chhattisgarh industrial, real estate, and retail businesses with official WhatsApp CRM.',
    highlights: ['Fast onboarding & setup', 'Multi-channel lead management', 'Bulk broadcast messaging'],
  },
};

export async function generateStaticParams() {
  return Object.keys(CITY_DATA).map((city) => ({
    city,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = CITY_DATA[resolvedParams.city];
  if (!data) return {};

  const title = `${data.headline} | NGTech WCRM`;
  const canonicalUrl = `https://ngtechwcrm.nighwantech.com/whatsapp-crm-${resolvedParams.city}`;

  return {
    title,
    description: data.description,
    keywords: [
      `WhatsApp CRM ${data.name}`,
      `WhatsApp Business API ${data.name}`,
      `WhatsApp Automation ${data.name}`,
      `WhatsApp Shared Inbox ${data.name}`,
      `WhatsApp Marketing Provider ${data.state}`,
      `Meta Approved WhatsApp Partner ${data.name}`,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: data.description,
      url: canonicalUrl,
      siteName: 'NGTech WCRM',
      locale: 'en_IN',
      type: 'website',
      images: ['https://ngtechwcrm.nighwantech.com/logo.png'],
    },
  };
}

export default async function CitySEOPage({ params }: { params: Promise<{ city: string }> }) {
  const resolvedParams = await params;
  const data = CITY_DATA[resolvedParams.city];

  if (!data) {
    notFound();
  }

  const allCityKeys = Object.keys(CITY_DATA);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `NGTech WCRM - ${data.name}`,
    description: data.description,
    url: `https://ngtechwcrm.nighwantech.com/whatsapp-crm-${resolvedParams.city}`,
    telephone: '+91-916200329896',
    address: {
      '@type': 'PostalAddress',
      addressLocality: data.name,
      addressRegion: data.state,
      addressCountry: 'IN',
    },
    areaServed: [data.name, data.state, 'India'],
    priceRange: '₹₹',
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
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
            <Link href="#industries" className="hover:text-foreground transition">Industries in {data.name}</Link>
            <Link href="#pricing" className="hover:text-foreground transition">Pricing</Link>
            <Link href="#faq" className="hover:text-foreground transition">FAQ</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="tel:+91916200329896" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm" className="gap-2 rounded-full border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                <PhoneCall className="h-3.5 w-3.5" /> +91-916200329896
              </Button>
            </Link>
            <Link href="/free-trial">
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
                <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                Meta Approved WhatsApp Partner in {data.name}
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                {data.headline}
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {data.description}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/free-trial">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 gap-2 font-bold shadow-lg shadow-emerald-500/20">
                    Start 14-Day Free Trial <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/book-demo">
                  <Button size="lg" variant="outline" className="rounded-full px-8 gap-2 border-border hover:bg-muted font-semibold">
                    <PhoneCall className="h-4 w-4 text-emerald-500" /> Book Demo for {data.name}
                  </Button>
                </Link>
              </div>

              <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-6 text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Official Meta API
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-amber-500" /> 10-Min Setup
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" /> Green Tick Support
                </div>
              </div>
            </div>

            {/* Visual Dashboard Card Mockup */}
            <div className="relative">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400"></span>
                    <span className="h-3 w-3 rounded-full bg-amber-400"></span>
                    <span className="h-3 w-3 rounded-full bg-emerald-400"></span>
                    <span className="ml-2 text-xs font-semibold text-muted-foreground">NGTech WCRM — {data.name} Team Inbox</span>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">
                    Live System
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-sm">
                        💬
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">New Lead Inbound ({data.name})</p>
                        <p className="text-[11px] text-muted-foreground">"Looking for product quote & demo..."</p>
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
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400">"Sent catalog & assigned to senior rep..."</p>
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

      {/* Highlights for City */}
      <section className="py-12 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.highlights.map((highlight, index) => (
              <div key={index} className="p-5 rounded-xl bg-card border border-border flex items-start gap-3 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-foreground leading-snug">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 Grid Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4 max-w-6xl space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="outline" className="text-xs font-mono uppercase text-emerald-600 border-emerald-500/30">
              Powerful Features
            </Badge>
            <h2 className="text-3xl font-extrabold text-foreground">
              Everything Your {data.name} Business Needs to Scale
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Replace multiple software tools with one unified WhatsApp CRM & automation hub.
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

            <div className="p-6 rounded-2xl bg-card border border-border space-y-4 hover:border-emerald-500/40 transition">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 w-fit">
                <Flame className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">AI Lead Temperature Scoring</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Automatically detect buyer intent and tag contacts with HOT 🔥 or WARM 🔥 badges so your sales team calls high-converting leads first.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border space-y-4 hover:border-emerald-500/40 transition">
              <div className="p-3 rounded-xl bg-pink-500/10 text-pink-500 w-fit">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Sales Pipeline & Analytics</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Drag-and-drop Kanban pipeline boards to track deals from inquiry to payment. Full team performance and response metrics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border space-y-4 hover:border-emerald-500/40 transition">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 w-fit">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Native Mobile App (.APK)</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Access your shared WhatsApp inbox anywhere in {data.name} from your Android or iOS mobile phone with real-time push notifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-16 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 max-w-6xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Tailored for Top Business Sectors in {data.name}
            </h2>
            <p className="text-xs text-muted-foreground max-w-lg mx-auto">
              Pre-built WhatsApp automation funnels for local industries.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-card border border-border text-center space-y-2">
              <GraduationCap className="h-7 w-7 text-emerald-500 mx-auto" />
              <p className="text-xs font-bold text-foreground">Education & Coaching</p>
              <p className="text-[11px] text-muted-foreground">Automated admission inquiries & fee reminders</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border text-center space-y-2">
              <Building2 className="h-7 w-7 text-blue-500 mx-auto" />
              <p className="text-xs font-bold text-foreground">Real Estate</p>
              <p className="text-[11px] text-muted-foreground">Instant brochure sharing & site visit bookings</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border text-center space-y-2">
              <ShoppingBag className="h-7 w-7 text-purple-500 mx-auto" />
              <p className="text-xs font-bold text-foreground">Retail & E-commerce</p>
              <p className="text-[11px] text-muted-foreground">Order tracking, catalog sharing & abandoned cart</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border text-center space-y-2">
              <Stethoscope className="h-7 w-7 text-red-500 mx-auto" />
              <p className="text-xs font-bold text-foreground">Healthcare & Clinics</p>
              <p className="text-[11px] text-muted-foreground">Doctor appointment scheduling & report dispatch</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <Badge className="bg-white/20 text-white border-white/30 text-xs px-3 py-1">
            Meta Approved Partner in {data.name}
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Supercharge Your Sales in {data.name} Today
          </h2>
          <p className="text-emerald-100 text-base max-w-xl mx-auto">
            Get started in 10 minutes with your 14-day free trial. No credit card required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/free-trial">
              <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50 rounded-full px-8 font-bold shadow-xl">
                Start 14-Day Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="tel:+91916200329896">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 rounded-full px-8 gap-2 font-semibold">
                <PhoneCall className="h-4 w-4" /> Call +91-916200329896
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* City Directory Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4 max-w-6xl space-y-8">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              NGTech WCRM Available Cities Across India:
            </h4>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {allCityKeys.map((key) => (
                <Link
                  key={key}
                  href={`/whatsapp-crm-${key}`}
                  className={`hover:text-emerald-500 transition ${key === resolvedParams.city ? 'font-bold text-emerald-600' : ''}`}
                >
                  WhatsApp CRM {CITY_DATA[key].name} |
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
            <p>© {new Date().getFullYear()} NG Technology Pvt. Ltd. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
              <Link href="/contact" className="hover:text-foreground">Contact Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
