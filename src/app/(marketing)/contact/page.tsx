import { Metadata } from 'next'
import Link from 'next/link'
import {
  Mail,
  PhoneCall,
  MessageSquare,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Contact Us | NGTech WCRM',
  description:
    'Get in touch with NGTech WCRM & Nighwan Technology. Speak with our experts or connect on WhatsApp for instant 10-minute setup support.',
}

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest gap-2">
            <Sparkles className="h-3.5 w-3.5 text-emerald-500" /> We Are Here to Help You Scale
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">Touch</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about NGTech WCRM or need help setting up your team? Connect with our dedicated sales and support team.
          </p>
        </div>

        {/* Clean 4-Card Contact Infographic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Phone Call Card */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4 hover:border-emerald-500/40 transition group">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition">
              <PhoneCall className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Voice Support</span>
              <h3 className="font-bold text-foreground text-base">Direct Phone Call</h3>
            </div>
            <a
              href="tel:+918985025794"
              className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base hover:underline block"
            >
              +91 8985025794
            </a>
            <p className="text-xs text-muted-foreground">Mon – Sat, 9:00 AM – 8:00 PM IST</p>
          </div>

          {/* WhatsApp Support Card */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4 hover:border-[#25D366]/40 transition group">
            <div className="h-12 w-12 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Instant Chat</span>
              <h3 className="font-bold text-foreground text-base">WhatsApp Support</h3>
            </div>
            <a
              href="https://wa.me/918092225777"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] font-bold text-base hover:underline block"
            >
              +91 80922 25777
            </a>
            <p className="text-xs text-muted-foreground">Fastest response for demos & quick queries</p>
          </div>

          {/* Email Support Card */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4 hover:border-primary/40 transition group">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Email Team</span>
              <h3 className="font-bold text-foreground text-base">Official Email</h3>
            </div>
            <a
              href="mailto:info@nighwantech.com"
              className="text-primary font-medium text-sm hover:underline block truncate"
            >
              info@nighwantech.com
            </a>
            <p className="text-xs text-muted-foreground">For enterprise proposals & billing support</p>
          </div>

          {/* Corporate HQ Location Card */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4 hover:border-amber-500/40 transition group">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Parent Enterprise</span>
              <h3 className="font-bold text-foreground text-base">Headquarters</h3>
            </div>
            <p className="text-xs font-semibold text-foreground leading-snug">
              Nighwan Technology Pvt. Ltd.
            </p>
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Hyderabad, Telangana (TS), India</p>
          </div>
        </div>

        {/* Infographic 3-Step Process Banner */}
        <div className="rounded-3xl border border-border bg-card p-8 md:p-12 shadow-lg space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <Badge variant="outline" className="text-xs font-mono uppercase text-emerald-600 border-emerald-500/30">
              Seamless Onboarding
            </Badge>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
              How We Help You Get Started in 3 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="space-y-3 p-6 rounded-2xl bg-muted/30 border border-border/50 text-center relative">
              <div className="h-10 w-10 rounded-full bg-emerald-500 text-white font-extrabold flex items-center justify-center mx-auto text-sm shadow-md">
                01
              </div>
              <h3 className="font-bold text-foreground text-base">Connect With Us</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Reach out via Phone call, WhatsApp, or launch your free trial online.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-muted/30 border border-border/50 text-center relative">
              <div className="h-10 w-10 rounded-full bg-blue-500 text-white font-extrabold flex items-center justify-center mx-auto text-sm shadow-md">
                02
              </div>
              <h3 className="font-bold text-foreground text-base">10-Minute Guided Setup</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our experts help connect your official Meta WhatsApp Business API and AI chatbot.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-muted/30 border border-border/50 text-center relative">
              <div className="h-10 w-10 rounded-full bg-purple-500 text-white font-extrabold flex items-center justify-center mx-auto text-sm shadow-md">
                03
              </div>
              <h3 className="font-bold text-foreground text-base">Scale Your Sales</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Launch automated broadcasts, manage team inbox, and close leads 3x faster.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-border/50">
            <Link href="/free-trial">
              <Button size="lg" className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 shadow-md gap-2 w-full sm:w-auto">
                Start 14-Day Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="https://wa.me/918092225777" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="rounded-full border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 font-bold px-8 w-full sm:w-auto">
                Chat on WhatsApp
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
