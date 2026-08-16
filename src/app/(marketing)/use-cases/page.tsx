import React from 'react'
import Link from 'next/link'
import {
  Users,
  Briefcase,
  DollarSign,
  Heart,
  Bot,
  TrendingUp,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
} from 'lucide-react'

export const metadata = {
  title: 'Use Cases & Business Solutions | AIWCRM Enterprise OS',
  description: 'Learn how AIWCRM powers lead generation, sales automation, customer relationship management, debt collections, and AI customer support.',
}

export default function UseCasesPage() {
  const useCases = [
    {
      id: 'generate-leads',
      title: 'Generate More Inbound Leads',
      category: 'Marketing & Intake',
      desc: 'Launch automated Meta ad campaigns, connect Facebook & Instagram instant forms, and instantly route qualified prospects to sales representatives via WhatsApp in sub-2 seconds.',
      benefits: ['Instant 0-latency webhook sync', 'AI copy & banner generator', 'Automated qualification scoring'],
      icon: Users,
    },
    {
      id: 'automate-sales',
      title: 'Automate Enterprise Sales & Deals',
      category: 'Sales Execution',
      desc: 'Manage deals through customizable Kanban pipelines, generate AI commercial proposals, and issue formal 18% GST quotations directly inside WhatsApp chats.',
      benefits: ['Dynamic win probability scoring', 'AI Statement of Work (SOW) generator', 'Multi-tier discount approval guards'],
      icon: Briefcase,
    },
    {
      id: 'collect-payments',
      title: 'Automate GST Invoicing & Collections',
      category: 'Finance & Cash Flow',
      desc: 'Issue statutory GST tax invoices with HSN codes, integrate Razorpay UPI links, and automate multi-channel WhatsApp payment reminders on aging accounts.',
      benefits: ['Aging ledger (0-30, 31-60 days)', 'Automated WhatsApp payment reminders', '1-Click bank reconciliation'],
      icon: DollarSign,
    },
    {
      id: 'customer-retention',
      title: 'Customer Retention & CSAT',
      category: 'Customer Success',
      desc: 'Track customer health scores, automate post-onboarding milestone check-ins, and trigger automated WhatsApp NPS surveys to identify at-risk accounts before churn.',
      benefits: ['Predictive churn detection', 'Automated NPS survey distribution', 'Lifecycle milestone tracking'],
      icon: Heart,
    },
    {
      id: 'whatsapp-automation',
      title: 'WhatsApp Business Automation',
      category: 'Omnichannel Inbox',
      desc: 'Shared multi-agent team inbox with round-robin lead assignment, private internal notes, automated keyword responses, and official Meta broadcast campaigns.',
      benefits: ['Collision prevention & live typing indicator', 'Official Meta Cloud API verified', 'Custom interactive buttons & lists'],
      icon: MessageSquare,
    },
    {
      id: 'ai-sales-assistant',
      title: 'Autonomous AI Sales & Support Copilot',
      category: 'AI Agents',
      desc: 'Deploy 24/7 AI conversational agents capable of answering complex product inquiries from your PDF knowledge base and drafting contextual sales replies.',
      benefits: ['RAG Vector Knowledge Base sync', 'Sub-800ms streaming responses', 'BYOK multi-model cost savings'],
      icon: Bot,
    },
    {
      id: 'executive-dashboards',
      title: 'Executive Intelligence & Dashboards',
      category: 'Analytics & Insights',
      desc: 'Comprehensive real-time leaderboards, agent response latency metrics, deals won forecasting, and cross-departmental revenue performance reports.',
      benefits: ['Agent performance scorecards', 'AI revenue forecasting', 'Automated scheduled PDF reports'],
      icon: TrendingUp,
    },
  ]

  return (
    <div className="py-12 sm:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
          <Sparkles className="w-3.5 h-3.5" /> High-Impact Solutions
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-tight">
          Purpose-Built for Every{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500">
            Business Objective.
          </span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Explore how modern growth, sales, and finance teams use AIWCRM to accelerate operations and drive measurable revenue growth.
        </p>
      </div>

      {/* Use Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {useCases.map((uc) => {
          const Icon = uc.icon
          return (
            <div
              key={uc.id}
              id={uc.id}
              className="p-6 rounded-2xl border bg-card hover:border-primary/40 transition-all space-y-4 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {uc.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground">{uc.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{uc.desc}</p>
              </div>

              <div className="space-y-2 pt-3 border-t">
                <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">Key Capabilities:</span>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {uc.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>

      {/* CTA Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-indigo-500/10 border border-primary/20 text-center space-y-4">
        <h3 className="text-2xl font-bold text-foreground">See How AIWCRM Fits Your Specific Workflow</h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
          Book an interactive 1-on-1 walkthrough with our solutions engineering team.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/free-trial"
            className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-6 text-xs font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90"
          >
            Start Free Trial
          </Link>
          <Link
            href="/book-demo"
            className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-background px-6 text-xs font-bold text-foreground shadow-sm transition-all hover:bg-muted"
          >
            Book Enterprise Demo
          </Link>
        </div>
      </div>
    </div>
  )
}
