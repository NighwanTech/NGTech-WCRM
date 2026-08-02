import { NextResponse } from 'next/server'

export interface KnowledgeDocument {
  id: string
  title: string
  category: string
  sourceUrl: string
  content: string
  publishStatus: 'draft' | 'published'
  checksum: string
  crawledAt: string
  updatedAt: string
}

let memoryKB: KnowledgeDocument[] = [
  {
    id: 'kb-1',
    title: 'Sales Pipelines & Kanban Deal Stages',
    category: 'feature',
    sourceUrl: '/pipelines',
    content: 'In Sales Pipelines (/pipelines), view and drag deal cards across Kanban columns (New Lead, Contacted, Proposal Sent, Closed Won, Closed Lost). Click "Add Deal" to enter deal values, expected close dates, and assign sales reps.',
    publishStatus: 'published',
    checksum: 'p1102939912093',
    crawledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-2',
    title: 'WhatsApp Broadcast Campaigns & Audience Filtering',
    category: 'onboarding',
    sourceUrl: '/broadcasts/new',
    content: 'In WhatsApp Broadcasts (/broadcasts/new), click "New Broadcast Campaign", select target audience tags or CSV lists, attach Meta-approved template messages with dynamic variables {{1}} and {{2}}, and click Send Now or Schedule.',
    publishStatus: 'published',
    checksum: 'b2239401294',
    crawledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-3',
    title: 'Visual No-Code AI Flow Builder',
    category: 'feature',
    sourceUrl: '/flows',
    content: 'In Automations (/flows), drag trigger nodes (Keyword, New Lead), AI response nodes, delay timers, and condition branches on the visual canvas to build 24/7 automated lead qualification workflows.',
    publishStatus: 'published',
    checksum: 'f332019482',
    crawledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-4',
    title: 'Shared Multi-Agent Team Inbox & Canned Replies',
    category: 'feature',
    sourceUrl: '/inbox',
    content: 'In Shared Inbox (/inbox), multiple sales & support agents manage conversations from 1 official WhatsApp number. Type / in the message box for quick canned replies, assign threads to reps, add internal notes, and star priority chats.',
    publishStatus: 'published',
    checksum: 'i440291039',
    crawledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-5',
    title: 'Contact Management & CSV Import',
    category: 'onboarding',
    sourceUrl: '/contacts',
    content: 'In Contacts (/contacts), click "Import CSV" to upload customer phone lists from Excel/CSV. View customer 360 timelines, assign custom tags, filter by audience segments, and manage custom attributes.',
    publishStatus: 'published',
    checksum: 'c55029193',
    crawledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-6',
    title: 'Automated Drip Sequences & Cadences',
    category: 'feature',
    sourceUrl: '/sequences',
    content: 'In Drip Sequences (/sequences), create multi-day automated follow-up sequences. Add delay nodes (Wait 1 hour, Wait 2 days) to automatically nurture leads.',
    publishStatus: 'published',
    checksum: 's66029192',
    crawledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-7',
    title: 'WhatsApp E-Commerce Orders & Catalogs',
    category: 'feature',
    sourceUrl: '/orders',
    content: 'In Orders (/orders), view native WhatsApp cart purchases placed inside WhatsApp chats. Send instant Razorpay/UPI payment collection links and update order fulfillment status.',
    publishStatus: 'published',
    checksum: 'o77029194',
    crawledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-8',
    title: 'WhatsApp Delivery & Message Analytics',
    category: 'feature',
    sourceUrl: '/analytics',
    content: 'In Advanced Analytics (/analytics), monitor sent, delivered, read, and failed message rates. Analyze campaign ROI, lead conversion charts, and AI response times.',
    publishStatus: 'published',
    checksum: 'a88029195',
    crawledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-9',
    title: 'Team Performance & SLA Scorecards',
    category: 'feature',
    sourceUrl: '/team-performance',
    content: 'In Team Performance (/team-performance), track individual agent response speed, resolution rates, SLA compliance scores, and active conversations per rep.',
    publishStatus: 'published',
    checksum: 't99029196',
    crawledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-10',
    title: 'AI Assistant General Settings & BYOK Keys',
    category: 'feature',
    sourceUrl: '/ai-assistant',
    content: 'In AI Assistant (/ai-assistant) -> General Settings tab: Select AI Provider (Gemini, OpenAI, Groq, DeepSeek) and Model (gemini-2.5-pro, gpt-4o, llama-3.1-8b-instant). Toggle "Use My Own API Key" (BYOK), enter secret key, click "Test Connection". Adjust Temperature (0.3), Max Tokens (145), Top P (0.95), Response Language Override (Auto, English, Hindi), Instant Greeting Cache (0-token fast replies), and Custom Welcome Greeting.',
    publishStatus: 'published',
    checksum: 'a10029197',
    crawledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-11',
    title: 'AI Assistant Personality, System Prompts & Guardrails',
    category: 'feature',
    sourceUrl: '/ai-assistant',
    content: 'In AI Assistant (/ai-assistant): Use "Personality" tab to select Business Tone (Professional, Friendly, Empathetic, Sales-Driven) and brand persona. Use "System Prompt" tab to edit custom system instructions, company context, and safety guardrails.',
    publishStatus: 'published',
    checksum: 'p11029198',
    crawledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-12',
    title: 'AI Assistant Knowledge Base Training & FAQs',
    category: 'feature',
    sourceUrl: '/ai-assistant',
    content: 'In AI Assistant (/ai-assistant) -> Knowledge Base tab: Upload training FAQ documents, business context text, and product information for the AI chatbot to automatically learn and use when answering customer queries.',
    publishStatus: 'published',
    checksum: 'k12029199',
    crawledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-13',
    title: 'AI Rules, Lead Qualification & Human Handoff',
    category: 'feature',
    sourceUrl: '/ai-assistant',
    content: 'In AI Assistant (/ai-assistant): Use "AI Rules" tab to configure sentiment scoring thresholds and automatic lead qualification tags (Hot/Warm/Cold). Use "Human Handoff" tab to configure triggers for transferring live WhatsApp chats from AI Bot to Human Reps.',
    publishStatus: 'published',
    checksum: 'r13029200',
    crawledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-14',
    title: 'AI Playground Sandbox & Analytics',
    category: 'feature',
    sourceUrl: '/ai-assistant',
    content: 'In AI Assistant (/ai-assistant): Use "Playground" tab to test chatbot responses interactively with custom prompts. Use "Analytics" tab to view real-time AI token usage, sentiment metrics, and cost charts.',
    publishStatus: 'published',
    checksum: 'a14029201',
    crawledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-15',
    title: 'Hot Leads Filter & AI Lead Scoring',
    category: 'feature',
    sourceUrl: '/contacts',
    content: 'In Contacts (/contacts), click the 🔥 Hot Leads toggle button at top to instantly filter high-intent contacts with AI lead scores (Hot or Warm) or tags like hot, interested, urgent, and pricing.',
    publishStatus: 'published',
    checksum: 'h15029199',
    crawledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-16',
    title: 'Direct Phone Call Button & Contact Toolbar',
    category: 'feature',
    sourceUrl: '/contacts',
    content: 'In Contacts table & Customer Sidebar, click the 📞 Direct Phone Call button (tel:) next to any contact to immediately dial and call the customer directly from your device softphone.',
    publishStatus: 'published',
    checksum: 'c16029200',
    crawledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-17',
    title: 'Meta Official WhatsApp API Setup',
    category: 'onboarding',
    sourceUrl: '/settings?tab=whatsapp',
    content: 'Go to Settings -> WhatsApp Config (/settings?tab=whatsapp). Click Meta Embedded Signup to link your official phone number with Meta WhatsApp Business API.',
    publishStatus: 'published',
    checksum: 'm17029201',
    crawledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-18',
    title: 'Department Team Management & Agent Roles',
    category: 'feature',
    sourceUrl: '/settings?tab=departments',
    content: 'Go to Settings -> Departments (/settings?tab=departments) or Members (/settings?tab=members) to invite sales and support agents, set roles (Admin, Agent, Manager), and configure auto-routing rules.',
    publishStatus: 'published',
    checksum: 'd18029202',
    crawledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-19',
    title: 'Settings Rail & Workspace Configuration',
    category: 'feature',
    sourceUrl: '/settings',
    content: 'In Settings (/settings), access Profile, Security, Appearance (Dark/Light mode), WhatsApp Config, Approved Templates, Custom Fields & Tags, Deals, Team Members, Departments, Developer API Keys & Webhooks, Plan & Subscription, and GST Invoices.',
    publishStatus: 'published',
    checksum: 's19029203',
    crawledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-20',
    title: 'Billing, Plan Upgrades & GST Invoices',
    category: 'pricing',
    sourceUrl: '/settings?tab=invoices',
    content: 'Go to Settings -> Invoices & Billing (/settings?tab=invoices). Compare plans (Starter ₹2,249/mo, Pro ₹5,999/mo, Enterprise) and download official GST tax invoices anytime.',
    publishStatus: 'published',
    checksum: 'b20029204',
    crawledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-21',
    title: 'Official Contact & Human Support Numbers',
    category: 'contact',
    sourceUrl: '/contact',
    content: 'Phone Support: +91 8985025794, WhatsApp Direct Support: +91 8092225777, Email: info@nighwantech.com, Website: https://nighwantech.com/',
    publishStatus: 'published',
    checksum: '77a1129990184499011cbb001188443e',
    crawledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-22',
    title: 'WooCommerce & E-Commerce Webhook Integration',
    category: 'feature',
    sourceUrl: '/settings?tab=api-keys',
    content: 'To integrate WooCommerce or Shopify with WhatsApp in NGTech WCRM, go to Settings -> Developer API Keys & Webhooks (/settings?tab=api-keys). Copy your Webhook Endpoint URL and secret API key to trigger automated WhatsApp order updates, abandoned cart recovery, and shipping notifications.',
    publishStatus: 'published',
    checksum: 'w22029205',
    crawledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-23',
    title: 'Exporting Chat History & Contacts to Excel / CSV',
    category: 'feature',
    sourceUrl: '/contacts',
    content: 'To export contacts and chat history to Excel or CSV, go to Contacts (/contacts) or Shared Inbox (/inbox), select the desired contacts or conversation threads, and click "Export CSV" from the top action toolbar to download a complete spreadsheet file.',
    publishStatus: 'published',
    checksum: 'e23029206',
    crawledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

let memoryGaps = [
  { id: 'gap-1', query: 'How to integrate WooCommerce with WhatsApp?', count: 14, status: 'unresolved' },
  { id: 'gap-2', query: 'Can I export chat history to Excel?', count: 8, status: 'unresolved' },
]

export async function GET(req: Request) {
  return NextResponse.json({
    success: true,
    documents: memoryKB,
    gaps: memoryGaps,
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, document } = body

    if (action === 'save' || action === 'create' || action === 'update') {
      const docId = document.id || `kb-${Date.now()}`
      const existingIdx = memoryKB.findIndex((d) => d.id === docId)

      const updatedDoc: KnowledgeDocument = {
        id: docId,
        title: document.title,
        category: document.category || 'faq',
        sourceUrl: document.sourceUrl || 'http://localhost:3000/',
        content: document.content,
        publishStatus: document.publishStatus || 'published',
        checksum: document.checksum || `chk-${Date.now()}`,
        crawledAt: document.crawledAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      if (existingIdx >= 0) {
        memoryKB[existingIdx] = updatedDoc
      } else {
        memoryKB.unshift(updatedDoc)
      }

      if (document.gapId) {
        memoryGaps = memoryGaps.filter((g) => g.id !== document.gapId)
      }

      return NextResponse.json({ success: true, document: updatedDoc })
    }

    if (action === 'delete') {
      memoryKB = memoryKB.filter((d) => d.id !== document.id)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export function getKnowledgeDocuments(): KnowledgeDocument[] {
  return memoryKB.filter((d) => d.publishStatus === 'published')
}

export function searchKnowledgeDocuments(query: string): KnowledgeDocument[] {
  const cleanQuery = query.toLowerCase().trim()
  if (!cleanQuery) return []

  const stopWords = new Set(['in', 'to', 'is', 'on', 'at', 'of', 'by', 'or', 'an', 'and', 'the', 'a', 'how', 'what', 'where', 'why', 'do', 'can', 'i'])
  const terms = cleanQuery.split(/\s+/).filter((t) => t.length > 0 && !stopWords.has(t))
  
  if (terms.length === 0) return []

  const scoredDocs: { doc: KnowledgeDocument; score: number }[] = []

  for (const doc of memoryKB) {
    if (doc.publishStatus !== 'published') continue
    const title = doc.title.toLowerCase()
    const content = doc.content.toLowerCase()
    const category = doc.category.toLowerCase()

    let score = 0

    if (title.includes(cleanQuery)) score += 50
    if (content.includes(cleanQuery)) score += 20

    for (const term of terms) {
      try {
        const pattern = term.length <= 2 ? `\\b${term}\\b` : term
        const regex = new RegExp(pattern, 'i')
        
        if (regex.test(title)) score += 20
        if (regex.test(category)) score += 15
        if (regex.test(content)) score += 5
      } catch (e) {
        if (title.includes(term)) score += 10
      }
    }

    if (score >= 10) {
      scoredDocs.push({ doc, score })
    }
  }

  scoredDocs.sort((a, b) => b.score - a.score)

  if (scoredDocs.length === 0) return []
  const topScore = scoredDocs[0].score
  return scoredDocs.filter((s) => s.score >= Math.max(15, topScore * 0.6)).map((s) => s.doc)
}
