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
      { id: 'dashboard', href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & key metrics' },
      { id: 'inbox', href: '/inbox', label: 'Universal Inbox', icon: MessageSquare, permission: 'messages:read', description: 'Omnichannel conversations' },
      { id: 'orders', href: '/orders', label: 'Orders & Payments', icon: ShoppingCart, description: 'Order & revenue management' },
    ]
  },
  {
    id: 'marketing',
    label: 'Marketing',
    groupIcon: Megaphone,
    colorClass: 'text-amber-600 dark:text-amber-500',
    items: [
      { id: 'meta-ads', href: '/meta-ads', label: 'Meta Ads Manager Pro', icon: Presentation, description: 'Autonomous AI Ad Operating System' },
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
    label: 'Lead Hub',
    groupIcon: Users,
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    items: [
      { id: 'lead-center', href: '/meta-ads/lead-integrations', label: 'Lead Ingestion Center', icon: Users, description: 'Universal lead acquisition hub' },
      { id: 'lead-forms', href: '/meta-ads/lead-forms', label: 'Meta Lead Forms', icon: FileText, description: 'Instant forms & CAPI funnel' },
    ]
  },
  {
    id: 'crm',
    label: 'CRM',
    groupIcon: Contact,
    colorClass: 'text-blue-600 dark:text-blue-400',
    items: [
      { id: 'inbox', href: '/inbox', label: 'Universal Inbox', icon: MessageSquare, permission: 'messages:read', description: 'Omnichannel WhatsApp & lead conversations' },
      { id: 'contacts', href: '/contacts', label: 'Contacts & Companies', icon: Users, permission: 'contacts:read', description: 'Customer 360 database' },
      { id: 'pipelines', href: '/pipelines', label: 'Sales Pipelines', icon: GitBranch, description: 'Deal tracking & stages' },
      { id: 'team-performance', href: '/team-performance', label: 'Team Performance', icon: UsersRound, description: 'Agent productivity & metrics' },
    ]
  },
  {
    id: 'sales',
    label: 'Sales (REP)',
    groupIcon: Briefcase,
    colorClass: 'text-amber-500 dark:text-amber-400',
    items: [
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
      { id: 'invoices', href: '/finance', label: 'Invoices & Ledger', icon: CreditCard, description: 'Billing & GST invoices' },
      { id: 'collections', href: '/finance/collections', label: 'Collections & Aging', icon: DollarSign, description: 'Outstanding collections & forecast' }
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
      { id: 'decisions', href: '/decisions', label: 'AI Decision Ledger', icon: Zap, description: 'AI decisions & execution log' },
      { id: 'retell', href: '/settings?tab=retell', label: 'AI Voice Calling', icon: AudioLines, permission: 'settings:manage', description: 'Voice agent config' }
    ]
  },
  {
    id: 'automation',
    label: 'Automation',
    groupIcon: Route,
    colorClass: 'text-pink-600 dark:text-pink-400',
    items: [
      { id: 'automations', href: '/flows', label: 'Visual Flow Builder', icon: Route, description: 'Drag & drop chatbot flow builder' },
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
      { id: 'customer-voice', href: '/intelligence/voice', label: 'Customer Voice AI', icon: AudioLines, badge: 'New', description: 'Sentiment & call insights' }
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
      { id: 'settings', href: '/settings?tab=overview', label: 'Settings Overview', icon: SettingsIcon, description: 'Workspace configuration' },
      { id: 'meta-ads-settings', href: '/settings?tab=meta_ads', label: 'Meta Ads & CAPI', icon: Megaphone, description: 'Facebook login, ad accounts & Pixel' },
      { id: 'security-center', href: '/settings/security', label: 'Security & Governance', icon: ShieldCheck, description: 'Auth, audit & permissions' },
    ]
  }
]
