import React from 'react';
import Link from 'next/link';
import { 
  KeyRound, 
  Cpu, 
  Zap, 
  MessageSquareText, 
  Mic, 
  Kanban, 
  Users, 
  Send, 
  GitBranch, 
  Code2,
  TrendingUp,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export function EnterpriseUspsSection() {
  const usps = [
    {
      num: '01',
      title: 'Bring Your Own AI Key (BYOK)',
      desc: 'Use your own OpenAI, Gemini, Claude, Groq or DeepSeek API keys with zero platform token markups. Direct billing with AI vendors.',
      icon: KeyRound,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
      badge: '0% Token Markup',
      link: '/ai-platform'
    },
    {
      num: '02',
      title: 'Multi AI Model Support',
      desc: 'Supports Google Gemini 3.6, OpenAI GPT-4o, Anthropic Claude 3.5, Groq Llama 3.3, DeepSeek R1, Ollama local models, and custom API endpoints.',
      icon: Cpu,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      badge: '7+ AI Providers',
      link: '/ai-platform'
    },
    {
      num: '03',
      title: 'AI Auto Failover Engine',
      desc: 'If one AI provider fails or hits rate limits (429), WCRM automatically switches to a secondary backup provider in <1 second with zero downtime.',
      icon: Zap,
      color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400',
      badge: 'Zero Downtime',
      link: '/ai-platform'
    },
    {
      num: '04',
      title: 'Zero Token Greeting Cache',
      desc: 'Automatically reply to standard customer greetings like "Hi", "Hello", "Thanks" using 0 AI tokens and <100ms instant response time.',
      icon: MessageSquareText,
      color: 'from-green-500/20 to-emerald-500/10 border-green-500/30 text-green-400',
      badge: 'Save 60% Costs',
      link: '/features'
    },
    {
      num: '05',
      title: 'Voice AI Integration (Retell)',
      desc: 'Deploy intelligent AI voice agents for automated inbound call answering and outbound phone follow-ups synced directly with your CRM pipeline.',
      icon: Mic,
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400',
      badge: 'Voice + Chat AI',
      link: '/contact'
    },
    {
      num: '06',
      title: 'Enterprise CRM Engine',
      desc: 'Complete lead management, deal tracking, Kanban visual pipelines, task assignments, customer notes, activity timelines, and revenue analytics.',
      icon: Kanban,
      color: 'from-sky-500/20 to-cyan-500/10 border-sky-500/30 text-sky-400',
      badge: 'Full Sales CRM',
      link: '/features'
    },
    {
      num: '07',
      title: 'Team Inbox & Smart Routing',
      desc: 'Assign conversations to live agents, add private internal team notes, configure department routing, and manage multi-agent support workflows.',
      icon: Users,
      color: 'from-teal-500/20 to-emerald-500/10 border-teal-500/30 text-teal-400',
      badge: 'Multi-Agent Support',
      link: '/contact'
    },
    {
      num: '08',
      title: 'Meta Broadcast Campaigns',
      desc: 'Create Meta-approved message templates, schedule broadcast campaigns, segment targeted contacts, and analyze detailed delivery reports.',
      icon: Send,
      color: 'from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-400',
      badge: 'Official Cloud API',
      link: '/features'
    },
    {
      num: '09',
      title: 'No-Code Automation Engine',
      desc: 'Visual drag-and-drop workflow builder to trigger automated actions based on customer events, keyword matches, and deal stage transitions.',
      icon: GitBranch,
      color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400',
      badge: 'Visual Builder',
      link: '/features'
    },
    {
      num: '10',
      title: 'API First Developer Platform',
      desc: 'Comprehensive REST APIs, real-time webhooks, custom SDKs, and developer docs to seamlessly integrate WhatsApp into your enterprise stack.',
      icon: Code2,
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
      badge: 'REST & Webhooks',
      link: '/api-docs'
    },
    {
      num: '11',
      title: 'AI Lead Scoring & Intent',
      desc: 'Automatically score incoming lead intent (Hot, Warm, Cold) using real-time AI sentiment analysis and dispatch instant notifications to sales reps.',
      icon: TrendingUp,
      color: 'from-emerald-500/20 to-lime-500/10 border-emerald-500/30 text-emerald-400',
      badge: 'Hot Lead Alerts',
      link: '/contact'
    },
    {
      num: '12',
      title: 'Real-Time SLA & Telemetry',
      desc: 'Track team response times, CSAT feedback ratings, campaign ROI metrics, and AI token consumption from a centralized dashboard.',
      icon: BarChart3,
      color: 'from-teal-500/20 to-blue-500/10 border-teal-500/30 text-teal-400',
      badge: 'SLA Telemetry',
      link: '/contact'
    },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Core Product Advantage
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Why Businesses Choose WCRM
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            The ultimate AI-powered WhatsApp platform combining BYOK cost-savings, zero-downtime auto-failover, and enterprise sales CRM.
          </p>
        </div>

        {/* 12 USP Feature Cards — 4 Cards Per Row Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {usps.map((usp, idx) => {
            const Icon = usp.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-3xl bg-gradient-to-b ${usp.color} border shadow-lg space-y-4 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-background/80 border border-white/10 shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-background/80 border border-border text-foreground font-mono">
                      {usp.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-400 transition-colors">
                    {usp.num}. {usp.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {usp.desc}
                  </p>
                </div>

                {/* Fully Clickable "Explore Feature" Active Link Button */}
                <div className="pt-3 border-t border-white/10">
                  <Link
                    href={usp.link}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-400 text-xs font-extrabold border border-emerald-500/30 transition-all duration-300 shadow-sm group-hover:shadow-md cursor-pointer"
                  >
                    <span>Explore Feature</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
