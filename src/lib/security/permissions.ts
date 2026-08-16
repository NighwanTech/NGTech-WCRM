import { getAdminClient } from '@/lib/admin-supabase'

export type AccountRole = 'owner' | 'admin' | 'manager' | 'agent' | 'client' | 'viewer' | string

export type DataScope = 'all' | 'region' | 'branch' | 'department' | 'team' | 'assigned' | 'own'

export type PermissionLevel = 'none' | 'read' | 'write' | 'admin'

/**
 * 11 Standard Enterprise OS Workspaces matching V16 Architecture
 */
export type WorkspaceId = 
  | 'home'
  | 'marketing'
  | 'lead_hub'
  | 'crm'
  | 'sales'
  | 'finance'
  | 'success'
  | 'ai'
  | 'automation'
  | 'analytics'
  | 'integrations'
  | 'settings'

export interface ActionDefinition {
  key: string
  label: string
  description?: string
  isProtected?: boolean // Protected Dangerous Action
  dangerousWarning?: string
  apiEndpoint?: { method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; path: string }
  dependsOn?: string[]
}

export interface FeatureDefinition {
  id: string
  name: string
  description: string
  defaultLevel?: PermissionLevel
  actions: ActionDefinition[]
  dataScopeSupported?: boolean
}

export interface WorkspacePermissionGroup {
  id: WorkspaceId
  name: string
  iconName: string
  description: string
  features: FeatureDefinition[]
}

/**
 * 11 Comprehensive Enterprise Workspaces with Feature & Action Granularity
 */
export const ENTERPRISE_WORKSPACES: WorkspacePermissionGroup[] = [
  {
    id: 'home',
    name: '🏠 Home Briefing',
    iconName: 'Home',
    description: 'Executive briefing, daily KPIs, announcement broadcasts, and activity ledger.',
    features: [
      {
        id: 'executive_briefing',
        name: 'Executive KPI Briefing',
        description: 'View aggregated high-level business health scores and operational summaries.',
        actions: [
          { key: 'home:view', label: 'View Home Briefing', apiEndpoint: { method: 'GET', path: '/api/analytics' } },
          { key: 'home:export_kpi', label: 'Export Executive KPI Summary', apiEndpoint: { method: 'GET', path: '/api/analytics/intelligence' } },
        ],
      },
      {
        id: 'activity_stream',
        name: 'Company Activity Stream',
        description: 'Read real-time cross-departmental user and AI activities.',
        actions: [
          { key: 'home:activity_read', label: 'Read Activity Stream', apiEndpoint: { method: 'GET', path: '/api/activities' } },
          { key: 'home:announcement_post', label: 'Post Workspace Announcement', isProtected: true, dangerousWarning: 'Broadcasts notice to all logged in users.', apiEndpoint: { method: 'POST', path: '/api/activities' } },
        ],
      },
    ],
  },
  {
    id: 'marketing',
    name: '📢 Meta Ads & Marketing',
    iconName: 'Layers',
    description: 'Meta Ads Manager Pro, Ad Creatives, Audience Studio, Lead Forms & Budgets.',
    features: [
      {
        id: 'campaigns',
        name: 'Ad Campaigns Manager',
        description: 'Create, launch, pause, and optimize Meta Graph ad campaigns.',
        actions: [
          { key: 'marketing:campaign_view', label: 'View Campaigns & Performance', apiEndpoint: { method: 'GET', path: '/api/meta/campaigns' } },
          { key: 'marketing:campaign_create', label: 'Create Ad Campaigns & Adsets', dependsOn: ['marketing:campaign_view'], apiEndpoint: { method: 'POST', path: '/api/meta/campaigns' } },
          { key: 'marketing:campaign_edit', label: 'Edit Targeting & Ad Copy', dependsOn: ['marketing:campaign_view'], apiEndpoint: { method: 'PUT', path: '/api/meta/campaigns/actions' } },
          { key: 'marketing:campaign_publish', label: 'Publish Campaign to Meta Ads Graph API', isProtected: true, dangerousWarning: 'Triggers live Meta billing spend on connected Ad Account.', dependsOn: ['marketing:campaign_view', 'marketing:campaign_edit'], apiEndpoint: { method: 'POST', path: '/api/meta/ai/launch-ad' } },
          { key: 'marketing:campaign_delete', label: 'Delete Ad Campaign', isProtected: true, dangerousWarning: 'Permanently deletes campaign and ad set data from Meta.', dependsOn: ['marketing:campaign_view'], apiEndpoint: { method: 'DELETE', path: '/api/meta/campaigns' } },
        ],
      },
      {
        id: 'audience_studio',
        name: 'Audience Studio & Targeting',
        description: 'Manage custom lookalikes, pixel cohorts, and demographic clusters.',
        actions: [
          { key: 'marketing:audience_view', label: 'View Audience Segments', apiEndpoint: { method: 'GET', path: '/api/meta/ai/generate-audience' } },
          { key: 'marketing:audience_manage', label: 'Build & Sync Custom Lookalike Audiences', dependsOn: ['marketing:audience_view'], apiEndpoint: { method: 'POST', path: '/api/meta/ai/generate-audience' } },
        ],
      },
      {
        id: 'creative_studio',
        name: 'Creative Studio & AI Graphics',
        description: 'AI graphic generation, banner uploads, and live ad copy hooks.',
        actions: [
          { key: 'marketing:creative_view', label: 'View Creative Library', apiEndpoint: { method: 'GET', path: '/api/meta/ai/generate-media' } },
          { key: 'marketing:creative_generate', label: 'Generate AI Creatives & Variations', apiEndpoint: { method: 'POST', path: '/api/meta/ai/generate-graphic' } },
          { key: 'marketing:creative_upload', label: 'Upload Brand Assets & Logos', apiEndpoint: { method: 'POST', path: '/api/meta/ai/generate-media' } },
        ],
      },
      {
        id: 'lead_forms',
        name: 'Instant Lead Forms',
        description: 'Meta Instant Forms schema, question mapper, and webhook links.',
        actions: [
          { key: 'marketing:lead_forms_view', label: 'View Lead Forms', apiEndpoint: { method: 'GET', path: '/api/meta/lead-forms' } },
          { key: 'marketing:lead_forms_manage', label: 'Create & Bind Meta Instant Forms', dependsOn: ['marketing:lead_forms_view'], apiEndpoint: { method: 'POST', path: '/api/meta/lead-forms' } },
        ],
      },
      {
        id: 'marketing_budget',
        name: 'Budget, Spend & Approvals',
        description: 'Daily budget ceilings, ROAS targets, and spend threshold approvals.',
        actions: [
          { key: 'marketing:budget_view', label: 'View Budget & Spend Breakdown', apiEndpoint: { method: 'GET', path: '/api/meta/analytics' } },
          { key: 'marketing:budget_modify', label: 'Modify Daily Ad Account Spend Limits', isProtected: true, dangerousWarning: 'Changes direct monetary limits on Meta Ad Account.', apiEndpoint: { method: 'POST', path: '/api/meta/campaigns/actions' } },
          { key: 'marketing:campaign_approve', label: 'Approve Campaign Launch (Supervisor Approval)', isProtected: true, apiEndpoint: { method: 'POST', path: '/api/meta/v1/approval-queue' } },
        ],
      },
    ],
  },
  {
    id: 'lead_hub',
    name: '👥 Universal Lead Hub',
    iconName: 'Users',
    description: 'Omnichannel lead intake, automated qualification, deduplication, and routing.',
    features: [
      {
        id: 'lead_intake',
        name: 'Omnichannel Lead Intake',
        description: 'Ingest leads from Meta Instant Forms, Webhooks, Google Sheets & WhatsApp.',
        actions: [
          { key: 'lead_hub:view_all', label: 'View Inbound Lead Stream', apiEndpoint: { method: 'GET', path: '/api/leads' } },
          { key: 'lead_hub:import_csv', label: 'Bulk Import Leads (CSV / Excel)', apiEndpoint: { method: 'POST', path: '/api/meta/v1/leads/import' } },
          { key: 'lead_hub:export', label: 'Export Leads (CSV / XLSX)', isProtected: true, dangerousWarning: 'Exports client contact information outside the platform.', apiEndpoint: { method: 'GET', path: '/api/contacts' } },
        ],
      },
      {
        id: 'lead_routing',
        name: 'Auto-Routing & Round Robin',
        description: 'Configure agent assignment queues, round-robin rules, and SLA dispatch.',
        actions: [
          { key: 'lead_hub:assign_agent', label: 'Manually Assign / Re-route Lead', apiEndpoint: { method: 'POST', path: '/api/conversations/transfer' } },
          { key: 'lead_hub:configure_routing', label: 'Configure Automated Routing Rules', isProtected: true, apiEndpoint: { method: 'POST', path: '/api/meta/rules' } },
        ],
      },
      {
        id: 'lead_qualification',
        name: 'AI Lead Qualification',
        description: 'AI intent scoring, budget detection, and WhatsApp conversational triage.',
        actions: [
          { key: 'lead_hub:scoring_view', label: 'View AI Lead Score & Intent', apiEndpoint: { method: 'GET', path: '/api/meta/v1/ai/performance' } },
          { key: 'lead_hub:re_evaluate_score', label: 'Trigger AI Re-evaluation', apiEndpoint: { method: 'POST', path: '/api/meta/v1/ai/recommendations' } },
        ],
      },
    ],
  },
  {
    id: 'crm',
    name: '👤 CRM & Customer 360',
    iconName: 'Building',
    description: 'Contacts, companies, 360 timeline, pipelines, notes, and phone privacy.',
    features: [
      {
        id: 'contacts_data',
        name: 'Contacts & Companies Directory',
        description: 'Complete CRM directory with field-level permissions and data scoping.',
        dataScopeSupported: true,
        actions: [
          { key: 'contacts:read', label: 'View Contact Records', apiEndpoint: { method: 'GET', path: '/api/contacts' } },
          { key: 'contacts:create', label: 'Create New Contacts & Companies', dependsOn: ['contacts:read'], apiEndpoint: { method: 'POST', path: '/api/contacts' } },
          { key: 'contacts:update', label: 'Edit Contact Details & Custom Fields', dependsOn: ['contacts:read'], apiEndpoint: { method: 'PUT', path: '/api/contacts' } },
          { key: 'contacts:delete_any', label: 'Hard Delete Contact Records', isProtected: true, dangerousWarning: 'Permanently deletes contact, historical messages, and activity records.', dependsOn: ['contacts:read'], apiEndpoint: { method: 'DELETE', path: '/api/contacts' } },
          { key: 'contacts:unmask_phone', label: 'Reveal Masked Phone Number', isProtected: true, dangerousWarning: 'Unmasks customer phone number for compliance inspection.', apiEndpoint: { method: 'GET', path: '/api/contacts' } },
        ],
      },
      {
        id: 'shared_inbox',
        name: 'Shared WhatsApp & Multi-Channel Inbox',
        description: 'Real-time two-way messaging, media dispatch, private team notes, and quick replies.',
        actions: [
          { key: 'messages:read', label: 'Read Conversations in Shared Inbox', apiEndpoint: { method: 'GET', path: '/api/chat' } },
          { key: 'messages:send', label: 'Send Outbound Messages & Replies', dependsOn: ['messages:read'], apiEndpoint: { method: 'POST', path: '/api/whatsapp/send' } },
          { key: 'messages:internal_notes', label: 'Add Private Internal Team Notes', dependsOn: ['messages:read'], apiEndpoint: { method: 'POST', path: '/api/chat' } },
          { key: 'broadcasts:launch', label: 'Launch WhatsApp Bulk Broadcasts', isProtected: true, dangerousWarning: 'Sends mass WhatsApp templates to filtered contact segments.', dependsOn: ['messages:send'], apiEndpoint: { method: 'POST', path: '/api/whatsapp/broadcast' } },
        ],
      },
    ],
  },
  {
    id: 'sales',
    name: '💼 Enterprise Sales (REP)',
    iconName: 'Briefcase',
    description: 'Deals pipeline, AI proposal builder, 18% GST quotations, meetings, and playbooks.',
    features: [
      {
        id: 'deals_pipeline',
        name: 'Deals & Commercial Opportunities',
        description: 'Commercial deal cards, win probability, health score, and stage transitions.',
        actions: [
          { key: 'deals:read', label: 'View Deals Pipeline', apiEndpoint: { method: 'GET', path: '/api/pipelines' } },
          { key: 'deals:manage', label: 'Create & Move Deals Across Stages', dependsOn: ['deals:read'], apiEndpoint: { method: 'POST', path: '/api/pipelines' } },
          { key: 'deals:close_won', label: 'Mark Deal as WON / Transfer to CS', dependsOn: ['deals:manage'], apiEndpoint: { method: 'PATCH', path: '/api/pipelines' } },
          { key: 'deals:delete', label: 'Delete Deal Opportunity', isProtected: true, dependsOn: ['deals:read'], apiEndpoint: { method: 'DELETE', path: '/api/pipelines' } },
        ],
      },
      {
        id: 'proposals_sow',
        name: 'AI Proposals & Statements of Work',
        description: 'Generate commercial proposals, scope schedules, and client approval links.',
        actions: [
          { key: 'proposals:read', label: 'View Proposals & SOW Documents', apiEndpoint: { method: 'GET', path: '/api/sales/proposals' } },
          { key: 'proposals:manage', label: 'Build & Edit AI Proposals', dependsOn: ['proposals:read'], apiEndpoint: { method: 'POST', path: '/api/sales/proposals' } },
          { key: 'proposals:approve', label: 'Approve Formal Proposal for Client Delivery', isProtected: true, apiEndpoint: { method: 'POST', path: '/api/sales/proposals' } },
          { key: 'proposals:export_pdf', label: 'Export Proposal to Branded PDF', apiEndpoint: { method: 'GET', path: '/api/sales/proposals' } },
        ],
      },
      {
        id: 'quotations_engine',
        name: '18% GST Quotation Engine',
        description: 'Multi price-book quotes, discount thresholds, and WhatsApp delivery.',
        actions: [
          { key: 'quotations:read', label: 'View Quotations Ledger', apiEndpoint: { method: 'GET', path: '/api/sales/quotations' } },
          { key: 'quotations:manage', label: 'Generate Formal Quotation', dependsOn: ['quotations:read'], apiEndpoint: { method: 'POST', path: '/api/sales/quotations' } },
          { key: 'quotations:send_whatsapp', label: 'Send Quotation directly via WhatsApp', dependsOn: ['quotations:manage'], apiEndpoint: { method: 'POST', path: '/api/whatsapp/send' } },
          { key: 'quotations:approve_discount', label: 'Approve High-Discount Quotes (>15%)', isProtected: true, apiEndpoint: { method: 'POST', path: '/api/sales/quotations' } },
        ],
      },
      {
        id: 'sales_playbooks',
        name: 'Playbook Library & Scripts',
        description: 'Industry-specific conversion scripts, objection handles, and sales cadences.',
        actions: [
          { key: 'playbooks:view', label: 'View Sales Playbooks', apiEndpoint: { method: 'GET', path: '/api/knowledge-base' } },
          { key: 'playbooks:activate', label: 'Activate Playbook Cadence', apiEndpoint: { method: 'POST', path: '/api/sequences/enroll' } },
        ],
      },
    ],
  },
  {
    id: 'finance',
    name: '💰 Finance & Invoicing',
    iconName: 'DollarSign',
    description: 'Invoices, payments, 18% GST compliance, collections ledger, and refunds.',
    features: [
      {
        id: 'tax_invoicing',
        name: 'GST Tax Invoicing',
        description: 'Issue GST compliant tax invoices with HSN codes and Razorpay links.',
        actions: [
          { key: 'finance:invoice_view', label: 'View Tax Invoices', apiEndpoint: { method: 'GET', path: '/api/finance' } },
          { key: 'finance:invoice_create', label: 'Generate New GST Invoice', dependsOn: ['finance:invoice_view'], apiEndpoint: { method: 'POST', path: '/api/finance' } },
          { key: 'finance:invoice_delete', label: 'Delete / Void Tax Invoice', isProtected: true, dangerousWarning: 'Voids tax invoice in statutory ledger.', dependsOn: ['finance:invoice_view'], apiEndpoint: { method: 'DELETE', path: '/api/finance' } },
          { key: 'finance:invoice_approve', label: 'Approve Invoice Dispatch', isProtected: true, apiEndpoint: { method: 'POST', path: '/api/finance' } },
        ],
      },
      {
        id: 'collections_reminders',
        name: 'Collections & Automated Reminders',
        description: 'Aging ledger (0-30, 31-60 days) and multi-channel WhatsApp/Email reminders.',
        actions: [
          { key: 'finance:collections_read', label: 'View Collections & Aging Matrix', apiEndpoint: { method: 'GET', path: '/api/finance/collections' } },
          { key: 'finance:collections_remind', label: 'Trigger Automated Multi-Channel Payment Reminders', apiEndpoint: { method: 'POST', path: '/api/finance/collections' } },
          { key: 'finance:record_payment', label: 'Record Manual Bank / Cheque Settlement', isProtected: true, apiEndpoint: { method: 'POST', path: '/api/finance' } },
        ],
      },
      {
        id: 'refunds_credit_notes',
        name: 'Credit Notes & Refunds',
        description: 'Issue formal credit notes and process customer refunds.',
        actions: [
          { key: 'finance:credit_note_issue', label: 'Issue Credit Note', isProtected: true, apiEndpoint: { method: 'POST', path: '/api/finance' } },
          { key: 'finance:refund_process', label: 'Authorize Customer Refund', isProtected: true, dangerousWarning: 'Triggers monetary payment refund via Razorpay/Bank.', apiEndpoint: { method: 'POST', path: '/api/finance' } },
        ],
      },
    ],
  },
  {
    id: 'success',
    name: '❤️ Customer Success',
    iconName: 'Heart',
    description: 'Onboarding milestones, health scoring, NPS surveys, and churn prevention.',
    features: [
      {
        id: 'cs_hub',
        name: 'Customer Retention & Health Hub',
        description: 'Track client health score, renewal dates, and satisfaction indicators.',
        actions: [
          { key: 'success:view', label: 'View Client Health & Retention Roster', apiEndpoint: { method: 'GET', path: '/api/analytics/scorecard' } },
          { key: 'success:manage_account', label: 'Update CS Milestones & Onboarding Status', apiEndpoint: { method: 'POST', path: '/api/analytics/scorecard' } },
          { key: 'success:trigger_nps', label: 'Trigger Automated NPS WhatsApp Survey', apiEndpoint: { method: 'POST', path: '/api/csat' } },
        ],
      },
    ],
  },
  {
    id: 'ai',
    name: '🤖 AI Studio & Autonomous Copilot',
    iconName: 'Bot',
    description: 'Copilot assistant, autonomous AI agents, prompt studio, LLM provider manager.',
    features: [
      {
        id: 'ai_copilot',
        name: 'AI Sales & Ops Copilot',
        description: 'Interact with AI Copilot, draft contextual replies, and auto-summarize chats.',
        actions: [
          { key: 'ai:copilot_use', label: 'Interact with AI Copilot Assistant', apiEndpoint: { method: 'POST', path: '/api/meta/v1/ai/copilot' } },
          { key: 'ai:summarize_chat', label: 'Generate AI Conversation Summaries', apiEndpoint: { method: 'POST', path: '/api/conversations/[id]/summarize' } },
        ],
      },
      {
        id: 'prompt_studio',
        name: 'Prompt Studio & System Prompts',
        description: 'Tune system prompts, test prompt revisions, and publish model directives.',
        actions: [
          { key: 'ai:prompt_view', label: 'View Prompt Templates', apiEndpoint: { method: 'GET', path: '/api/admin/ai-config' } },
          { key: 'ai:prompt_edit', label: 'Modify & Publish Live AI System Prompts', isProtected: true, dangerousWarning: 'Changes live AI model reasoning and behavior across all client interactions.', apiEndpoint: { method: 'POST', path: '/api/admin/ai-config' } },
        ],
      },
      {
        id: 'knowledge_base',
        name: 'Knowledge Base & RAG Vector Engine',
        description: 'Upload PDF documents, crawl website pages, and manage vector embeddings.',
        actions: [
          { key: 'ai:kb_view', label: 'View Knowledge Documents', apiEndpoint: { method: 'GET', path: '/api/meta/v1/knowledge-base' } },
          { key: 'ai:kb_upload', label: 'Upload New Knowledge PDFs & Text', apiEndpoint: { method: 'POST', path: '/api/meta/v1/knowledge-base' } },
          { key: 'ai:kb_crawl', label: 'Trigger Live Website Vector Crawl', isProtected: true, apiEndpoint: { method: 'POST', path: '/api/admin/knowledge-base/crawl' } },
        ],
      },
      {
        id: 'llm_providers',
        name: 'LLM Provider Manager & Routing',
        description: 'Configure Groq, OpenAI, Google Gemini, and Anthropic API keys and fallback chains.',
        actions: [
          { key: 'ai:providers_view', label: 'View LLM Provider Status', apiEndpoint: { method: 'GET', path: '/api/ai-assistant/keys/test' } },
          { key: 'ai:providers_manage', label: 'Change Default LLM / Update API Keys', isProtected: true, dangerousWarning: 'Changes active AI model provider and secret keys.', apiEndpoint: { method: 'POST', path: '/api/admin/ai-config' } },
        ],
      },
      {
        id: 'ai_observability',
        name: 'AI Observability & Decision Center',
        description: 'Token usage metrics, latency, audit decisions, and human-in-the-loop approvals.',
        actions: [
          { key: 'ai:observability_view', label: 'View Token Spend & LLM Telemetry', apiEndpoint: { method: 'GET', path: '/api/ai-assistant/analytics' } },
          { key: 'ai:decision_approve', label: 'Approve Autonomous AI Decisions', isProtected: true, apiEndpoint: { method: 'POST', path: '/api/meta/v1/approval-queue' } },
        ],
      },
    ],
  },
  {
    id: 'automation',
    name: '⚡ Visual Automation & EAP',
    iconName: 'Rocket',
    description: 'Drag & drop flows, trigger events, scheduled crons, and action engines.',
    features: [
      {
        id: 'visual_flows',
        name: 'Visual Flow Builder',
        description: 'Build node-based automation workflows, branch conditions, and API webhooks.',
        actions: [
          { key: 'automation:flows_view', label: 'View Automation Flows', apiEndpoint: { method: 'GET', path: '/api/flows' } },
          { key: 'automation:flows_edit', label: 'Design & Build Flow Nodes', dependsOn: ['automation:flows_view'], apiEndpoint: { method: 'POST', path: '/api/flows' } },
          { key: 'automation:flows_activate', label: 'Activate Flow to Production', isProtected: true, dangerousWarning: 'Activates live automated execution triggers on inbound events.', dependsOn: ['automation:flows_edit'], apiEndpoint: { method: 'POST', path: '/api/flows/[id]/activate' } },
          { key: 'automation:flows_delete', label: 'Delete Automation Flow', isProtected: true, dependsOn: ['automation:flows_view'], apiEndpoint: { method: 'DELETE', path: '/api/flows' } },
        ],
      },
    ],
  },
  {
    id: 'analytics',
    name: '📊 Analytics & Intelligence',
    iconName: 'TrendingUp',
    description: 'Agent scorecard, department metrics, revenue forecasts, and CSAT reports.',
    features: [
      {
        id: 'reports_scorecards',
        name: 'Leaderboards & Scorecards',
        description: 'Evaluate agent response latency, deals won, meetings held, and CSAT scores.',
        actions: [
          { key: 'analytics:view_scorecards', label: 'View Team Leaderboards & Agent Scorecards', apiEndpoint: { method: 'GET', path: '/api/analytics/scorecard' } },
          { key: 'analytics:revenue_forecast', label: 'View AI Revenue Forecasting', apiEndpoint: { method: 'GET', path: '/api/analytics/intelligence' } },
          { key: 'analytics:export_reports', label: 'Export Analytics Reports (PDF / CSV)', isProtected: true, apiEndpoint: { method: 'GET', path: '/api/analytics' } },
        ],
      },
    ],
  },
  {
    id: 'integrations',
    name: '🔌 Universal Integrations Hub',
    iconName: 'Plug',
    description: 'Meta Business Manager, WhatsApp Cloud API, Shopify, Google Sheets, and Webhooks.',
    features: [
      {
        id: 'connectors',
        name: 'Platform Connectors & Sync',
        description: 'Manage OAuth connections, webhook endpoints, and data synchronizers.',
        actions: [
          { key: 'integrations:view', label: 'View Connected Apps', apiEndpoint: { method: 'GET', path: '/api/whatsapp/config' } },
          { key: 'integrations:connect', label: 'Connect New Integration (Meta, WhatsApp, Shopify)', isProtected: true, apiEndpoint: { method: 'POST', path: '/api/whatsapp/embedded-signup/confirm' } },
          { key: 'integrations:disconnect', label: 'Disconnect Integration', isProtected: true, dangerousWarning: 'Stops automated data sync from third-party provider.', apiEndpoint: { method: 'DELETE', path: '/api/whatsapp/config' } },
        ],
      },
    ],
  },
  {
    id: 'settings',
    name: '⚙️ Security & Workspace Settings',
    iconName: 'Sliders',
    description: 'Team roster, role assignment, active sessions, API keys, and rate limits.',
    features: [
      {
        id: 'team_roster',
        name: 'Team Members & Roster',
        description: 'Invite new users, assign roles, and manage permissions.',
        actions: [
          { key: 'team:view', label: 'View Team Member Roster', apiEndpoint: { method: 'GET', path: '/api/account/members' } },
          { key: 'team:manage', label: 'Invite New Teammate & Assign Roles', isProtected: true, apiEndpoint: { method: 'POST', path: '/api/account/invitations' } },
          { key: 'team:suspend', label: 'Suspend Agent (Out-of-Office Freeze)', isProtected: true, apiEndpoint: { method: 'PATCH', path: '/api/account/members' } },
          { key: 'team:remove', label: 'Remove / Offboard Team Member', isProtected: true, dangerousWarning: 'Permanently revokes workspace credentials and session tokens.', apiEndpoint: { method: 'DELETE', path: '/api/account/members' } },
        ],
      },
      {
        id: 'security_governance',
        name: 'Security & PBAC Engine',
        description: 'Configure PBAC matrix, remote session kill, and crypto audit logs.',
        actions: [
          { key: 'security:read', label: 'View Security Overview & Audit Logs', apiEndpoint: { method: 'GET', path: '/api/admin/security-advisor' } },
          { key: 'sessions:manage', label: 'Remote Revoke Active Device Sessions', isProtected: true, apiEndpoint: { method: 'POST', path: '/api/admin/break-glass' } },
          { key: 'api_keys:manage', label: 'Issue & Revoke API Keys', isProtected: true, dangerousWarning: 'Immediately invalidates connected backend services using this key.', apiEndpoint: { method: 'POST', path: '/api/account/api-keys' } },
          { key: 'rbac:manage', label: 'Modify Role Permission Matrix & Data Scopes', isProtected: true, dangerousWarning: 'Alters access control permissions across the entire organization.', apiEndpoint: { method: 'POST', path: '/api/admin/permissions' } },
          { key: 'settings:write', label: 'Edit Workspace Branding & System Configs', isProtected: true, apiEndpoint: { method: 'PUT', path: '/api/account' } },
          { key: 'billing:manage', label: 'Manage Workspace Subscription & Plan', isProtected: true, apiEndpoint: { method: 'POST', path: '/api/admin/pricing/plans' } },
        ],
      },
    ],
  },
]

/**
 * Flatten all individual action keys for typing and lookup.
 */
export const ALL_ACTION_KEYS = ENTERPRISE_WORKSPACES.flatMap((w) =>
  w.features.flatMap((f) => f.actions.map((a) => a.key))
)

export type Permission = (typeof ALL_ACTION_KEYS)[number] | 'all'

/**
 * 8 Standard Reusable Permission Templates
 */
export interface ReusableTemplate {
  id: string
  name: string
  category: string
  description: string
  defaultScope: DataScope
  permissions: string[]
}

export const REUSABLE_PERMISSION_TEMPLATES: ReusableTemplate[] = [
  {
    id: 'tmpl_sales_exec',
    name: 'Sales Executive',
    category: 'Sales',
    description: 'Deals, proposals, 18% GST quotations, WhatsApp chat, Customer 360, and playbooks.',
    defaultScope: 'assigned',
    permissions: [
      'home:view',
      'contacts:read',
      'contacts:create',
      'contacts:update',
      'messages:read',
      'messages:send',
      'messages:internal_notes',
      'deals:read',
      'deals:manage',
      'deals:close_won',
      'proposals:read',
      'proposals:manage',
      'proposals:export_pdf',
      'quotations:read',
      'quotations:manage',
      'quotations:send_whatsapp',
      'playbooks:view',
      'lead_hub:view_all',
      'ai:copilot_use',
      'ai:summarize_chat',
    ],
  },
  {
    id: 'tmpl_sales_mgr',
    name: 'Sales Manager',
    category: 'Sales',
    description: 'Manages sales team, discounts, full pipeline, leaderboards, and routing queues.',
    defaultScope: 'department',
    permissions: [
      'home:view',
      'contacts:read',
      'contacts:create',
      'contacts:update',
      'messages:read',
      'messages:send',
      'deals:read',
      'deals:manage',
      'deals:close_won',
      'proposals:read',
      'proposals:manage',
      'proposals:approve',
      'proposals:export_pdf',
      'quotations:read',
      'quotations:manage',
      'quotations:send_whatsapp',
      'quotations:approve_discount',
      'playbooks:view',
      'playbooks:activate',
      'analytics:view_scorecards',
      'analytics:revenue_forecast',
      'ai:copilot_use',
      'team:view',
    ],
  },
  {
    id: 'tmpl_finance_exec',
    name: 'Finance Executive',
    category: 'Finance',
    description: 'Tax invoices, collections ledger, payment settlements, and GST reporting.',
    defaultScope: 'all',
    permissions: [
      'home:view',
      'finance:invoice_view',
      'finance:invoice_create',
      'finance:invoice_approve',
      'finance:collections_read',
      'finance:collections_remind',
      'finance:record_payment',
      'finance:credit_note_issue',
      'quotations:read',
      'proposals:read',
      'billing:manage',
      'analytics:export_reports',
    ],
  },
  {
    id: 'tmpl_marketing_exec',
    name: 'Marketing Executive',
    category: 'Marketing',
    description: 'Meta Ads Manager, AI creatives, lookalike audiences, and bulk WhatsApp broadcasts.',
    defaultScope: 'all',
    permissions: [
      'home:view',
      'marketing:campaign_view',
      'marketing:campaign_create',
      'marketing:campaign_edit',
      'marketing:campaign_publish',
      'marketing:audience_view',
      'marketing:audience_manage',
      'marketing:creative_view',
      'marketing:creative_generate',
      'marketing:creative_upload',
      'marketing:lead_forms_view',
      'marketing:lead_forms_manage',
      'marketing:budget_view',
      'lead_hub:view_all',
      'broadcasts:launch',
      'automation:flows_view',
      'ai:copilot_use',
    ],
  },
  {
    id: 'tmpl_support_agent',
    name: 'Customer Support Agent',
    category: 'Support',
    description: 'Shared inbox, assigned contacts, ticket summaries, and customer history.',
    defaultScope: 'assigned',
    permissions: [
      'home:view',
      'contacts:read',
      'contacts:update',
      'messages:read',
      'messages:send',
      'messages:internal_notes',
      'ai:copilot_use',
      'ai:summarize_chat',
    ],
  },
  {
    id: 'tmpl_agency_partner',
    name: 'Agency Partner',
    category: 'Partner',
    description: 'Meta Ads campaigns, creative generation, lead intake, and campaign reporting.',
    defaultScope: 'all',
    permissions: [
      'marketing:campaign_view',
      'marketing:campaign_create',
      'marketing:campaign_edit',
      'marketing:creative_view',
      'marketing:creative_generate',
      'marketing:audience_view',
      'lead_hub:view_all',
      'analytics:view_scorecards',
    ],
  },
  {
    id: 'tmpl_client_portal',
    name: 'Client Portal (External)',
    category: 'Client',
    description: 'Proposal review/export, quotation preview, tax invoices, and chat.',
    defaultScope: 'own',
    permissions: [
      'proposals:read',
      'proposals:export_pdf',
      'quotations:read',
      'finance:invoice_view',
      'messages:read',
      'messages:send',
    ],
  },
  {
    id: 'tmpl_read_only',
    name: 'Read Only Auditor',
    category: 'Audit',
    description: 'Read-only access across audit logs, security center, system health, and scorecards.',
    defaultScope: 'all',
    permissions: [
      'home:view',
      'security:read',
      'contacts:read',
      'marketing:campaign_view',
      'finance:invoice_view',
      'finance:collections_read',
      'analytics:view_scorecards',
      'analytics:export_reports',
      'integrations:view',
    ],
  },
]

export const ROLE_TEMPLATES = REUSABLE_PERMISSION_TEMPLATES

/**
 * Base Role Mapping for Out-of-the-box Evaluation
 */
export const ROLE_PERMISSION_MAP: Record<string, Set<string>> = {
  owner: new Set(['all']),
  admin: new Set(['all', ...ALL_ACTION_KEYS]),
  manager: new Set([
    'home:view',
    'contacts:read',
    'contacts:create',
    'contacts:update',
    'messages:read',
    'messages:send',
    'messages:internal_notes',
    'broadcasts:launch',
    'marketing:campaign_view',
    'marketing:campaign_create',
    'marketing:campaign_edit',
    'marketing:campaign_publish',
    'marketing:audience_view',
    'marketing:creative_view',
    'marketing:creative_generate',
    'marketing:lead_forms_view',
    'marketing:budget_view',
    'marketing:campaign_approve',
    'lead_hub:view_all',
    'lead_hub:import_csv',
    'lead_hub:assign_agent',
    'lead_hub:scoring_view',
    'deals:read',
    'deals:manage',
    'deals:close_won',
    'proposals:read',
    'proposals:manage',
    'proposals:approve',
    'proposals:export_pdf',
    'quotations:read',
    'quotations:manage',
    'quotations:send_whatsapp',
    'quotations:approve_discount',
    'playbooks:view',
    'playbooks:activate',
    'finance:invoice_view',
    'finance:collections_read',
    'finance:collections_remind',
    'success:view',
    'ai:copilot_use',
    'ai:summarize_chat',
    'automation:flows_view',
    'analytics:view_scorecards',
    'analytics:revenue_forecast',
    'analytics:export_reports',
    'integrations:view',
    'team:view',
  ]),
  agent: new Set([
    'home:view',
    'contacts:read',
    'contacts:create',
    'contacts:update',
    'messages:read',
    'messages:send',
    'messages:internal_notes',
    'marketing:campaign_view',
    'marketing:creative_view',
    'lead_hub:view_all',
    'lead_hub:scoring_view',
    'deals:read',
    'deals:manage',
    'deals:close_won',
    'proposals:read',
    'proposals:manage',
    'proposals:export_pdf',
    'quotations:read',
    'quotations:manage',
    'quotations:send_whatsapp',
    'playbooks:view',
    'ai:copilot_use',
    'ai:summarize_chat',
  ]),
  client: new Set([
    'proposals:read',
    'proposals:export_pdf',
    'quotations:read',
    'finance:invoice_view',
    'messages:read',
    'messages:send',
  ]),
  viewer: new Set([
    'home:view',
    'contacts:read',
    'messages:read',
    'marketing:campaign_view',
    'deals:read',
    'finance:invoice_view',
    'analytics:view_scorecards',
  ]),
}

/**
 * Organization-Wide Top-Level Security Policies
 */
export interface OrgSecurityPolicy {
  id: string
  title: string
  description: string
  enabled: boolean
  blockedActionKeys: string[]
}

export const DEFAULT_ORG_POLICIES: OrgSecurityPolicy[] = [
  {
    id: 'org_policy_disable_invoice_delete',
    title: 'Disable Statutory Tax Invoice Deletion',
    description: 'Enforces compliance: tax invoices can only be voided via formal credit notes, never hard-deleted.',
    enabled: true,
    blockedActionKeys: ['finance:invoice_delete'],
  },
  {
    id: 'org_policy_enforce_phone_masking',
    title: 'Strict Phone Privacy Masking for Frontline Agents',
    description: 'Hides raw customer phone numbers from non-admin staff in shared inbox and contacts.',
    enabled: true,
    blockedActionKeys: ['contacts:unmask_phone'],
  },
  {
    id: 'org_policy_require_campaign_approval',
    title: 'Two-Man Rule for Meta Ad Account Publishing',
    description: 'Direct publishing to Meta Graph requires explicit supervisor approval.',
    enabled: false,
    blockedActionKeys: ['marketing:campaign_publish'],
  },
]

/**
 * Inherited permission engine helper
 */
export function getInheritedPermissions(level: PermissionLevel, feature: FeatureDefinition): string[] {
  if (level === 'none') return []
  if (level === 'read') {
    return feature.actions
      .filter((a) => a.key.includes('view') || a.key.includes('read'))
      .map((a) => a.key)
  }
  if (level === 'write') {
    return feature.actions
      .filter((a) => !a.isProtected || a.key.includes('create') || a.key.includes('manage') || a.key.includes('view') || a.key.includes('read') || a.key.includes('edit'))
      .map((a) => a.key)
  }
  if (level === 'admin') {
    return feature.actions.map((a) => a.key)
  }
  return []
}

/**
 * Evaluates whether a role possesses a specific action permission.
 */
export function evaluateRoleHasPermission(
  role: string,
  permissionKey: string,
  activeOverrides?: Set<string>,
  orgPolicies: OrgSecurityPolicy[] = DEFAULT_ORG_POLICIES
): boolean {
  if (role === 'owner') return true

  // Check if blocked by high-priority Organization Policy
  const isBlockedByOrg = orgPolicies.some((p) => p.enabled && p.blockedActionKeys.includes(permissionKey))
  if (isBlockedByOrg) return false

  if (activeOverrides && activeOverrides.has('all')) return true
  if (activeOverrides && activeOverrides.has(permissionKey)) return true

  const basePerms = ROLE_PERMISSION_MAP[role]
  if (basePerms) {
    if (basePerms.has('all')) return true
    return basePerms.has(permissionKey)
  }
  return false
}

/**
 * Role Comparator: Compares permissions between two roles across all workspaces
 */
export function compareRoles(roleA: string, roleB: string) {
  const setA = ROLE_PERMISSION_MAP[roleA] || new Set()
  const setB = ROLE_PERMISSION_MAP[roleB] || new Set()

  const isFullA = roleA === 'owner' || setA.has('all')
  const isFullB = roleB === 'owner' || setB.has('all')

  const breakdown = ENTERPRISE_WORKSPACES.map((w) => {
    const wsActions = w.features.flatMap((f) => f.actions.map((a) => a.key))
    const countA = isFullA ? wsActions.length : wsActions.filter((k) => setA.has(k)).length
    const countB = isFullB ? wsActions.length : wsActions.filter((k) => setB.has(k)).length
    const diff = countA - countB

    return {
      workspaceId: w.id,
      name: w.name,
      countA,
      countB,
      diff,
      diffFormatted: diff > 0 ? `+${diff}` : `${diff}`,
    }
  })

  const totalA = isFullA ? ALL_ACTION_KEYS.length : Array.from(setA).filter((k) => k !== 'all').length
  const totalB = isFullB ? ALL_ACTION_KEYS.length : Array.from(setB).filter((k) => k !== 'all').length

  return {
    roleA,
    roleB,
    totalA,
    totalB,
    totalDiff: totalA - totalB,
    breakdown,
  }
}

/**
 * Super Admin Lockout Prevention
 */
export function preventOwnerLockout(
  action: 'remove_member' | 'demote_member',
  targetRole: string,
  allMembers: { id: string; role: string }[]
): { allowed: boolean; reason?: string } {
  if (targetRole !== 'owner') return { allowed: true }

  const ownerCount = allMembers.filter((m) => m.role === 'owner').length
  if (ownerCount <= 1) {
    return {
      allowed: false,
      reason: 'CRITICAL LOCKOUT GUARD: Cannot remove or demote the last remaining Owner of the workspace.',
    }
  }

  return { allowed: true }
}

/**
 * Sensitive Permission Audit Counter
 */
export function getSensitivePermissionReport() {
  const protectedActions = ENTERPRISE_WORKSPACES.flatMap((w) =>
    w.features.flatMap((f) => f.actions.filter((a) => a.isProtected))
  )

  const roles = ['owner', 'admin', 'manager', 'agent', 'client', 'viewer']

  return roles.map((role) => {
    const baseSet = ROLE_PERMISSION_MAP[role] || new Set()
    const count = role === 'owner' || baseSet.has('all')
      ? protectedActions.length
      : protectedActions.filter((a) => baseSet.has(a.key)).length

    return {
      role,
      protectedCount: count,
      totalProtected: protectedActions.length,
      percentage: Math.round((count / (protectedActions.length || 1)) * 100),
    }
  })
}

export function invalidatePermissionCache(): void {
  // In-memory cache invalidated
}

export async function hasPermission(
  role: AccountRole,
  requiredPermission: string,
  _userId?: string,
  _accountId?: string
): Promise<boolean> {
  if (role === 'owner') return true
  return evaluateRoleHasPermission(role, requiredPermission)
}

export const PERMISSIONS = ['all', ...ALL_ACTION_KEYS] as const

export const PERMISSION_DEPENDENCIES: Record<string, string> = {
  'marketing:campaign_create': 'marketing:campaign_view',
  'marketing:campaign_edit': 'marketing:campaign_view',
  'marketing:campaign_publish': 'marketing:campaign_edit',
  'contacts:create': 'contacts:read',
  'contacts:update': 'contacts:read',
  'contacts:delete_any': 'contacts:read',
  'messages:send': 'messages:read',
  'broadcasts:launch': 'messages:send',
  'deals:manage': 'deals:read',
  'proposals:manage': 'proposals:read',
  'quotations:manage': 'quotations:read',
  'finance:invoice_create': 'finance:invoice_view',
}
