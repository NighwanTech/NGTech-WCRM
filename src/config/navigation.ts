import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  GitBranch, 
  Radio, 
  Route, 
  Settings as SettingsIcon, 
  BarChart3, 
  Bot,
  Zap,
  ShieldCheck,
  UserCog,
  LucideIcon,
  CreditCard,
  Megaphone,
  BrainCircuit,
  Calendar,
  ShoppingCart,
  Contact,
  UsersRound,
  Presentation,
  Target,
  LineChart,
  AudioLines,
  FileKey,
  Building,
  Key,
  FileText,
  Rocket,
  Palette,
  Sparkles,
  Home,
  DollarSign,
  Heart,
  Plug,
  Briefcase,
  Layers,
  Activity
} from 'lucide-react'

export interface NavItemConfig {
  id: string
  href: string
  label: string
  icon: LucideIcon
  /** Short description shown in rail flyout menus and command palette */
  description?: string
  permission?: string
  badge?: 'New' | 'Beta' | 'Alert' | 'Update'
}

export interface NavGroupConfig {
  id: string
  label: string
  groupIcon: LucideIcon
  colorClass: string
  items: NavItemConfig[]
}

/**
 * Enterprise Navigation Configuration (PRD v16.1 Enterprise Shell Architecture)
 * 12 Business Workflow Groups: Home, Marketing, Lead Hub, CRM, Sales, Finance, Success, AI, Automation, Analytics, Integrations, Settings
 */
export const NAVIGATION_CONFIG: NavGroupConfig[] = [
  {
    id: 'home',
    label: 'Home',
    groupIcon: Home,
    colorClass: 'text-indigo-600 dark:text-indigo-400',
    items: [
      { id: 'home', href: '/meta-ads', label: 'Home Briefing', icon: Home, description: 'Executive morning briefing & revenue AI' },
      { id: 'dashboard', href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & key metrics' },
      { id: 'inbox', href: '/inbox', label: 'Universal Inbox', icon: MessageSquare, permission: 'messages:read', description: 'Omnichannel conversations' },
      { id: 'orders', href: '/orders', label: 'Orders', icon: ShoppingCart, description: 'Order & revenue management' },
    ]
  },
  {
    id: 'marketing',
    label: 'Marketing',
    groupIcon: Megaphone,
    colorClass: 'text-amber-600 dark:text-amber-500',
    items: [
      { id: 'meta-ads', href: '/meta-ads', label: 'Meta Ads Manager Pro', icon: Presentation, description: 'Autonomous AI Ad Operating System 3-Pane' },
      { id: 'meta-ads-studio', href: '/meta-ads/create', label: 'Campaign Studio', icon: Rocket, description: 'Manual Pro & AI Wizard Studio' },
      { id: 'meta-ads-creative', href: '/meta-ads/creative-studio', label: 'Creative Studio', icon: Palette, description: 'AI Banner, Video & Brand Kit' },
      { id: 'meta-ads-audience', href: '/meta-ads/audience-studio', label: 'Audience Studio', icon: Target, description: 'Lookalikes & CRM Audiences' },
      { id: 'broadcasts', href: '/broadcasts', label: 'Broadcasts', icon: Radio, permission: 'broadcasts:launch', description: 'WhatsApp campaigns' },
      { id: 'sequences', href: '/sequences', label: 'Sequences', icon: Route, permission: 'sequences:manage', description: 'Drip messaging flows' },
      { id: 'meta-ads-experiments', href: '/meta-ads/experiments', label: 'AI Experiment Lab', icon: BrainCircuit, description: 'A/B & Multivariate Testing' },
    ]
  },
  {
    id: 'lead-hub',
    label: 'Lead Hub (UCAP)',
    groupIcon: Users,
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    items: [
      { id: 'lead-center', href: '/meta-ads/lead-integrations', label: 'Lead Operations Center', icon: Users, description: 'Universal Customer Acquisition Platform' },
      { id: 'lead-forms', href: '/meta-ads/lead-forms', label: 'Meta Lead Forms', icon: FileText, description: 'Instant forms & CAPI funnel' },
      { id: 'lead-analytics', href: '/meta-ads/lead-integrations', label: 'Lead Source Analytics', icon: BarChart3, description: 'Attribution & source conversion' }
    ]
  },
  {
    id: 'crm',
    label: 'CRM',
    groupIcon: Contact,
    colorClass: 'text-blue-600 dark:text-blue-400',
    items: [
      { id: 'customer-360', href: '/contacts', label: 'Customer 360 Workspace', icon: Contact, permission: 'contacts:read', description: 'Linear-style customer 360' },
      { id: 'contacts', href: '/contacts', label: 'Contacts & Companies', icon: Users, permission: 'contacts:read', description: 'Customer database' },
      { id: 'pipelines', href: '/pipelines', label: 'Pipelines & Stages', icon: GitBranch, description: 'Deal tracking & stages' },
      { id: 'team-performance', href: '/team-performance', label: 'Team Performance', icon: UsersRound, description: 'Agent productivity' },
    ]
  },
  {
    id: 'sales',
    label: 'Sales (REP)',
    groupIcon: Briefcase,
    colorClass: 'text-amber-500 dark:text-amber-400',
    items: [
      { id: 'deals-workspace', href: '/pipelines', label: 'Deal Pipeline Workspace', icon: Briefcase, description: 'REP deal command center' },
      { id: 'proposals', href: '/sales/proposals', label: 'Proposals & SOW', icon: FileText, description: 'AI proposal generator' },
      { id: 'quotations', href: '/sales/quotations', label: 'Quotations & GST', icon: DollarSign, description: 'Tax quotes & price books' }
    ]
  },
  {
    id: 'finance',
    label: 'Finance',
    groupIcon: DollarSign,
    colorClass: 'text-emerald-500 dark:text-emerald-400',
    items: [
      { id: 'invoices', href: '/finance', label: 'Invoices & Payments', icon: CreditCard, description: 'Billing & GST invoices' },
      { id: 'collections', href: '/finance/collections', label: 'Collections & Cash Flow', icon: DollarSign, description: 'Outstanding collections & forecast' }
    ]
  },
  {
    id: 'success',
    label: 'Success',
    groupIcon: Heart,
    colorClass: 'text-rose-500 dark:text-rose-400',
    items: [
      { id: 'cs-hub', href: '/meta-ads', label: 'Customer Success Hub', icon: Heart, description: 'Retention, onboarding & NPS' },
      { id: 'upsell', href: '/meta-ads', label: 'AI Churn & Upsell', icon: Sparkles, description: 'Predictive account health' }
    ]
  },
  {
    id: 'ai',
    label: 'AI Studio',
    groupIcon: BrainCircuit,
    colorClass: 'text-cyan-600 dark:text-cyan-400',
    items: [
      { id: 'agent-studio', href: '/meta-ads/copilot', label: 'AI Agent Studio', icon: Bot, description: 'Autonomous AI employee builder' },
      { id: 'prompt-studio', href: '/meta-ads/prompt-studio', label: 'AI Prompt Studio', icon: Sparkles, description: 'Prompt engineering & environments' },
      { id: 'ai-assistant', href: '/ai-assistant', label: 'AI Copilot Assistant', icon: Bot, badge: 'Beta', description: 'Copilot & knowledge base' },
      { id: 'decisions', href: '/decisions', label: 'AI Decisions', icon: Zap, description: 'AI decision ledger' },
      { id: 'retell', href: '/settings?tab=retell', label: 'AI Voice Calling', icon: AudioLines, permission: 'settings:manage', description: 'Voice agent config' }
    ]
  },
  {
    id: 'automation',
    label: 'Automation (EAP)',
    groupIcon: Rocket,
    colorClass: 'text-pink-600 dark:text-pink-400',
    items: [
      { id: 'automation-hub', href: '/meta-ads/copilot', label: 'Automation Hub', icon: Rocket, description: 'Enterprise Automation Platform' },
      { id: 'automations', href: '/flows', label: 'Visual Flow Builder', icon: Route, description: 'Drag & drop flow builder' },
      { id: 'decision-ledger', href: '/meta-ads/decision-ledger', label: 'Decision Ledger', icon: Activity, description: 'Execution logs & rollback' }
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics',
    groupIcon: BarChart3,
    colorClass: 'text-teal-600 dark:text-teal-400',
    items: [
      { id: 'revenue-intelligence', href: '/meta-ads/analytics', label: 'Revenue Intelligence', icon: LineChart, description: 'Blended ROAS, CAC & LTV analytics' },
      { id: 'advanced-analytics', href: '/analytics', label: 'Advanced Analytics', icon: BarChart3, permission: 'audit:read', description: 'Reports & dashboards' },
      { id: 'customer-voice', href: '/intelligence/voice', label: 'Customer Voice', icon: AudioLines, badge: 'New', description: 'Sentiment & insights' }
    ]
  },
  {
    id: 'integrations',
    label: 'Integrations',
    groupIcon: Plug,
    colorClass: 'text-indigo-500 dark:text-indigo-400',
    items: [
      { id: 'integration-hub', href: '/meta-ads/settings', label: 'Universal Integration Hub', icon: Plug, description: 'Connect Meta, WhatsApp, Shopify, Google' },
      { id: 'sync-health', href: '/meta-ads/settings/sync-health', label: 'Sync Health & Workers', icon: Activity, description: 'Queue workers & API telemetry' }
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    groupIcon: SettingsIcon,
    colorClass: 'text-slate-600 dark:text-slate-400',
    items: [
      { id: 'settings', href: '/settings?tab=overview', label: 'Settings Overview', icon: SettingsIcon, description: 'App configuration' },
      { id: 'security-center', href: '/settings/security', label: 'Security & Governance', icon: ShieldCheck, description: 'Auth & session management' },
      { id: 'governance-dashboard', href: '/settings?tab=governance', label: 'Audit Trail', icon: ShieldCheck, permission: 'security:read', description: 'Compliance & audit' }
    ]
  }
]
