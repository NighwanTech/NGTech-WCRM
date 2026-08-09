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
  FileText
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
 * Enterprise Navigation Configuration
 * 
 * This is the STATIC seed for the navigation tree. Dynamic modules
 * should register themselves via `NavigationRegistry.registerModule()`
 * in navigation-provider.tsx rather than editing this file.
 */
export const NAVIGATION_CONFIG: NavGroupConfig[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    groupIcon: LayoutDashboard,
    colorClass: 'text-indigo-600 dark:text-indigo-400',
    items: [
      { id: 'dashboard', href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview & key metrics' },
      { id: 'inbox', href: '/inbox', label: 'Inbox', icon: MessageSquare, permission: 'messages:read', description: 'WhatsApp conversations' },
      { id: 'orders', href: '/orders', label: 'Orders', icon: ShoppingCart, description: 'Order management' },
    ]
  },
  {
    id: 'crm',
    label: 'CRM',
    groupIcon: Users,
    colorClass: 'text-blue-600 dark:text-blue-400',
    items: [
      { id: 'contacts', href: '/contacts', label: 'Contacts', icon: Contact, permission: 'contacts:read', description: 'Customer database' },
      { id: 'pipelines', href: '/pipelines', label: 'Pipelines', icon: GitBranch, description: 'Deal tracking & stages' },
      { id: 'team-performance', href: '/team-performance', label: 'Team Performance', icon: UsersRound, description: 'Agent productivity' },
    ]
  },
  {
    id: 'marketing',
    label: 'Marketing',
    groupIcon: Megaphone,
    colorClass: 'text-amber-600 dark:text-amber-500',
    items: [
      { id: 'broadcasts', href: '/broadcasts', label: 'Broadcasts', icon: Radio, permission: 'broadcasts:launch', description: 'WhatsApp campaigns' },
      { id: 'sequences', href: '/sequences', label: 'Sequences', icon: Route, permission: 'sequences:manage', description: 'Drip messaging flows' },
      { id: 'meta-ads', href: '/meta-ads', label: 'Meta Ads', icon: Presentation, description: 'Facebook & Instagram ads' },
      { id: 'templates', href: '/settings?tab=templates', label: 'Templates', icon: FileText, permission: 'settings:manage', description: 'Message templates' },
    ]
  },
  {
    id: 'ai-studio',
    label: 'AI Studio',
    groupIcon: BrainCircuit,
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    items: [
      { id: 'ai-assistant', href: '/ai-assistant', label: 'AI Assistant', icon: Bot, badge: 'Beta', description: 'Copilot & knowledge base' },
      { id: 'decisions', href: '/decisions', label: 'Decisions', icon: Zap, description: 'AI decision engine' },
      { id: 'automations', href: '/flows', label: 'Automations', icon: Route, description: 'Visual flow builder' },
      { id: 'retell', href: '/settings?tab=retell', label: 'AI Voice Calling', icon: AudioLines, permission: 'settings:manage', description: 'Voice agent config' },
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics',
    groupIcon: BarChart3,
    colorClass: 'text-cyan-600 dark:text-cyan-400',
    items: [
      { id: 'advanced-analytics', href: '/analytics', label: 'Advanced Analytics', icon: BarChart3, permission: 'audit:read', description: 'Reports & dashboards' },
      { id: 'customer-voice', href: '/intelligence/voice', label: 'Customer Voice', icon: AudioLines, badge: 'New', description: 'Sentiment & insights' },
    ]
  },
  {
    id: 'governance',
    label: 'Governance',
    groupIcon: ShieldCheck,
    colorClass: 'text-purple-600 dark:text-purple-400',
    items: [
      { id: 'security-center', href: '/settings/security', label: 'Security & Login', icon: ShieldCheck, description: 'Auth & session management' },
      { id: 'governance-dashboard', href: '/settings?tab=governance', label: 'Governance', icon: ShieldCheck, permission: 'security:read', description: 'Compliance & audit' },
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    groupIcon: SettingsIcon,
    colorClass: 'text-slate-600 dark:text-slate-400',
    items: [
      { id: 'settings', href: '/settings?tab=overview', label: 'Settings', icon: SettingsIcon, description: 'App configuration' }
    ]
  }
]
