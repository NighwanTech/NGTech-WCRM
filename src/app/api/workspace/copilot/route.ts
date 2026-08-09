import { NextResponse } from 'next/server'
import { generateText } from 'ai'
import { groq } from '@ai-sdk/groq'
import { getFeatureRouting } from '@/lib/ai/ai-provider-manager'
import { searchKnowledgeDocuments } from '@/app/api/admin/knowledge-base/route'

interface CopilotStep {
  title: string
  description: string
  actionUrl?: string
  actionLabel?: string
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json()
    const text = (query || '').toLowerCase().trim()

    const routing = await getFeatureRouting()
    // Exclude Super Admin routes (/admin/*) from normal user workspace Copilot
    const matchedDocs = searchKnowledgeDocuments(text).filter(
      (doc) => !doc.sourceUrl.startsWith('/admin') && !doc.sourceUrl.startsWith('http://localhost:3000/admin')
    )

    let responseText = ''
    let steps: CopilotStep[] = []
    let primaryActionUrl: string | undefined
    let primaryActionLabel: string | undefined

    // 1. First check if any Knowledge Base items match via weighted RAG search!
    if (matchedDocs.length > 0) {
      const primaryDoc = matchedDocs[0]
      
      // Call Groq LLM to generate dynamic AI answer using Knowledge Base RAG context
      try {
        const kbContext = matchedDocs
          .slice(0, 3)
          .map((d) => `Document: ${d.title}\nCategory: ${d.category}\nURL: ${d.sourceUrl}\nContent: ${d.content}`)
          .join('\n\n')

        const { text: aiGeneratedText } = await generateText({
          model: groq('llama-3.1-8b-instant'),
          prompt: `You are WCRM AI Saathi, the official smart assistant for AIWCRM.
User asked: "${query}"

Knowledge Base Context:
${kbContext}

Strict Instructions:
1. Provide a direct, 2-sentence response explaining how the user can accomplish this in WCRM.
2. NEVER invent or shorten standalone URLs (such as "/members" or "/ai-keys"). ALWAYS use ONLY the exact full URLs provided in the Knowledge Base context (e.g. "/settings?tab=departments" or "/settings?tab=members").
3. Ensure every path mentioned matches the real WCRM UI exactly.
4. Keep it clear, professional, and 100% accurate.`,
        })

        if (aiGeneratedText && aiGeneratedText.trim().length > 10) {
          responseText = aiGeneratedText.trim()
        } else {
          responseText = `Knowledge Base (${primaryDoc.title}): ${primaryDoc.content}`
        }
      } catch (aiErr) {
        console.warn('Groq LLM RAG fallback:', aiErr)
        responseText = `Knowledge Base (${primaryDoc.title}): ${primaryDoc.content}`
      }

      steps = matchedDocs.slice(0, 4).map((doc, idx) => ({
        title: `Guide ${idx + 1}: ${doc.title}`,
        description: doc.content,
        actionUrl: doc.sourceUrl,
        actionLabel: 'Open Feature',
      }))
      primaryActionUrl = primaryDoc.sourceUrl
      primaryActionLabel = `Go To ${primaryDoc.title}`
    } 
    // 2. Sales Pipelines & Kanban
    else if (text.includes('pipeline') || text.includes('deal') || text.includes('kanban') || text.includes('stage') || text.includes('funnel')) {
      responseText = 'Here is how to manage Sales Pipelines & Kanban Deal Stages:'
      steps = [
        { title: 'Step 1: Open Sales Pipelines', description: 'Go to Pipelines in your dashboard sidebar.', actionUrl: '/pipelines', actionLabel: 'Go to Pipelines' },
        { title: 'Step 2: Create Custom Deal Stages', description: 'Add stages like New Lead, Contacted, Proposal Sent, Closed Won, Closed Lost.' },
        { title: 'Step 3: Drag & Drop Deals', description: 'Move lead cards across columns to update deal stages seamlessly.' },
        { title: 'Step 4: Track Pipeline Revenue', description: 'Monitor total deal values and forecast sales conversions.' },
      ]
      primaryActionUrl = '/pipelines'
      primaryActionLabel = 'Take Me To Pipelines'
    } 
    // 3. Broadcasts & Campaigns
    else if (text.includes('broadcast') || text.includes('campaign') || text.includes('bulk') || text.includes('blast')) {
      responseText = 'Here is how to create and send a WhatsApp Broadcast Campaign:'
      steps = [
        { title: 'Step 1: Open Broadcast Manager', description: 'Navigate to Broadcasts in your dashboard navigation.', actionUrl: '/broadcasts', actionLabel: 'Go to Broadcasts' },
        { title: 'Step 2: Click Create New Campaign', description: 'Select "New Broadcast Campaign" button.', actionUrl: '/broadcasts/new', actionLabel: 'Create Campaign' },
        { title: 'Step 3: Choose Target Audience', description: 'Select your contact tags, segments, or import CSV list.' },
        { title: 'Step 4: Select Approved WhatsApp Template', description: 'Choose your pre-approved Meta WhatsApp template.' },
        { title: 'Step 5: Send or Schedule', description: 'Review estimated costs and click Send Now or set Schedule.' },
      ]
      primaryActionUrl = '/broadcasts/new'
      primaryActionLabel = 'Take Me To Broadcasts'
    } 
    // 4. Visual Flow Builder & Automations
    else if (text.includes('flow') || text.includes('bot') || text.includes('builder') || text.includes('automation') || text.includes('canvas')) {
      responseText = 'Here is how to build automated visual AI workflows:'
      steps = [
        { title: 'Step 1: Open Flow Builder', description: 'Go to Flows & Automations in the sidebar.', actionUrl: '/flows', actionLabel: 'Open Flow Builder' },
        { title: 'Step 2: Create New Canvas Flow', description: 'Click Create Flow and drag Trigger nodes (e.g. Keyword, New Lead).' },
        { title: 'Step 3: Connect AI Auto-Reply Nodes', description: 'Drag AI Response or Condition nodes and connect edges.' },
        { title: 'Step 4: Publish Flow', description: 'Click Publish to activate 24/7 AI automated replies.' },
      ]
      primaryActionUrl = '/flows'
      primaryActionLabel = 'Open Flow Builder'
    } 
    // 5. Shared Team Inbox
    else if (text.includes('inbox') || text.includes('chat') || text.includes('message') || text.includes('conversation') || text.includes('team inbox')) {
      responseText = 'Here is how to manage the Shared Team Inbox & Agent Roles:'
      steps = [
        { title: 'Step 1: Open Shared Inbox', description: 'Click Inbox in the main navigation bar.', actionUrl: '/inbox', actionLabel: 'Open Shared Inbox' },
        { title: 'Step 2: Assign Conversations', description: 'Select any chat and assign to specific sales reps.' },
        { title: 'Step 3: Invite Team Members', description: 'Go to Settings -> Department Team to invite members.', actionUrl: '/settings/departments', actionLabel: 'Manage Team' },
      ]
      primaryActionUrl = '/inbox'
      primaryActionLabel = 'Open Shared Inbox'
    } 
    // 6. Contacts & CSV Import
    else if (text.includes('contact') || text.includes('customer') || text.includes('lead') || text.includes('audience') || text.includes('csv') || text.includes('import') || text.includes('tag')) {
      responseText = 'Here is how to manage contacts, import CSV lists, and tag leads:'
      steps = [
        { title: 'Step 1: Open Contacts Manager', description: 'Navigate to Contacts in the main dashboard sidebar.', actionUrl: '/contacts', actionLabel: 'Go to Contacts' },
        { title: 'Step 2: Import CSV Contacts List', description: 'Click "Import CSV" button to upload customer phone lists.', actionUrl: '/contacts', actionLabel: 'Import CSV' },
        { title: 'Step 3: Tag & Segment Leads', description: 'Apply custom tags, custom fields, and audience segments.' },
        { title: 'Step 4: View Customer 360 Timeline', description: 'Click any contact to view past messages, notes, and activity timeline.' },
      ]
      primaryActionUrl = '/contacts'
      primaryActionLabel = 'Manage Contacts'
    } 
    // 7. Drip Sequences
    else if (text.includes('sequence') || text.includes('drip') || text.includes('nurture') || text.includes('cadence') || text.includes('followup')) {
      responseText = 'Here is how to create automated drip sequences:'
      steps = [
        { title: 'Step 1: Open Drip Sequences', description: 'Go to Sequences in your dashboard sidebar.', actionUrl: '/sequences', actionLabel: 'Open Sequences' },
        { title: 'Step 2: Add Sequence Messages & Delays', description: 'Configure multi-day message schedules (e.g. Wait 1 hour, Send Intro).' },
        { title: 'Step 3: Enroll Contacts', description: 'Automatically enroll new leads into sequence campaigns.' },
      ]
      primaryActionUrl = '/sequences'
      primaryActionLabel = 'Take Me To Sequences'
    } 
    // 8. E-Commerce Orders
    else if (text.includes('order') || text.includes('ecommerce') || text.includes('product') || text.includes('catalog') || text.includes('cart')) {
      responseText = 'Here is how to manage WhatsApp E-Commerce Orders & Catalogs:'
      steps = [
        { title: 'Step 1: Open Orders Manager', description: 'Go to Orders in the dashboard sidebar.', actionUrl: '/orders', actionLabel: 'View Orders' },
        { title: 'Step 2: Track Native WhatsApp Carts', description: 'View incoming product orders placed inside WhatsApp chats.' },
        { title: 'Step 3: Send Instant Payment Links', description: 'Generate UPI/Razorpay payment links directly in chat.' },
      ]
      primaryActionUrl = '/orders'
      primaryActionLabel = 'View E-Commerce Orders'
    } 
    // 9. Analytics & Delivery
    else if (text.includes('analytic') || text.includes('report') || text.includes('metric') || text.includes('delivery') || text.includes('chart') || text.includes('stats')) {
      responseText = 'Here is how to view WhatsApp Analytics & Delivery Metrics:'
      steps = [
        { title: 'Step 1: Open Analytics Dashboard', description: 'Click Analytics in your dashboard sidebar.', actionUrl: '/analytics', actionLabel: 'View Analytics' },
        { title: 'Step 2: Check Delivery & Read Rates', description: 'Monitor message sent, delivered, read, and failed rates.' },
        { title: 'Step 3: Review Campaign Conversion ROI', description: 'Analyze broadcast performance and response metrics.' },
      ]
      primaryActionUrl = '/analytics'
      primaryActionLabel = 'View Analytics Reports'
    } 
    // 10. Team Performance & SLA
    else if (text.includes('performance') || text.includes('sla') || text.includes('scorecard') || text.includes('resolution')) {
      responseText = 'Here is how to monitor Team Performance & SLA metrics:'
      steps = [
        { title: 'Step 1: Open Team Performance', description: 'Go to Team Performance in the sidebar.', actionUrl: '/team-performance', actionLabel: 'Team Performance' },
        { title: 'Step 2: Review Agent Speed & Resolution Rate', description: 'Track response time per agent and SLA compliance.' },
      ]
      primaryActionUrl = '/team-performance'
      primaryActionLabel = 'View Team Scorecard'
    } 
    // 11. BYOK API Keys
    else if (text.includes('byok') || text.includes('key') || text.includes('api key') || text.includes('groq') || text.includes('openai') || text.includes('gemini') || text.includes('claude')) {
      responseText = 'Here is how to configure your BYOK (Bring Your Own Key) API credentials:'
      steps = [
        { title: 'Step 1: Open AI Assistant', description: 'Go to AI Assistant (/ai-assistant) in the sidebar.', actionUrl: '/ai-assistant', actionLabel: 'Open AI Assistant' },
        { title: 'Step 2: Go to General Settings', description: 'Select the General Settings tab -> locate API Key Credentials section.' },
        { title: 'Step 3: Toggle "Use My Own API Key"', description: 'Enable "Use My Own API Key", paste your OpenAI, Groq, Gemini, or Claude key, and click Test Connection.' },
      ]
      primaryActionUrl = '/ai-assistant'
      primaryActionLabel = 'Configure BYOK Keys'
    } 
    // 12. Meta WhatsApp Official API Setup
    else if (text.includes('meta') || text.includes('waba') || text.includes('whatsapp api') || text.includes('channel')) {
      responseText = 'Here is how to connect Meta WhatsApp Business API:'
      steps = [
        { title: 'Step 1: Open Channel Settings', description: 'Go to Settings -> WhatsApp Channels.', actionUrl: '/settings/channels', actionLabel: 'Channel Settings' },
        { title: 'Step 2: Click Embedded Signup', description: 'Complete Meta Embedded Signup to link your official phone number.' },
      ]
      primaryActionUrl = '/settings/channels'
      primaryActionLabel = 'WhatsApp API Setup'
    } 
    // 13. Billing & Invoices
    else if (text.includes('pay') || text.includes('bill') || text.includes('invoice') || text.includes('plan') || text.includes('upgrade') || text.includes('subscription') || text.includes('payment')) {
      responseText = 'Here is how to pay your bill, view invoices, or upgrade your WCRM plan:'
      steps = [
        { title: 'Step 1: Open Billing & Subscription Settings', description: 'Go to Settings -> Billing & Invoices tab.', actionUrl: '/settings?tab=invoices', actionLabel: 'View Billing & Invoices' },
        { title: 'Step 2: Choose Your Desired Plan', description: 'Select Starter Plan (₹2,249/mo) or Pro Plan (₹5,999/mo).', actionUrl: '/pricing', actionLabel: 'Compare Pricing Plans' },
        { title: 'Step 3: Complete Instant Checkout', description: 'Pay via UPI, Credit/Debit Card, NetBanking, or Razorpay.' },
        { title: 'Step 4: Download Tax Invoices', description: 'Access past GST invoices anytime under Settings -> Invoices.', actionUrl: '/settings?tab=invoices', actionLabel: 'Download Invoices' },
      ]
      primaryActionUrl = '/settings?tab=invoices'
      primaryActionLabel = 'Go To Billing & Invoices'
    } 
    // 14. Contact Support
    else if (text.includes('contact') || text.includes('support') || text.includes('help') || text.includes('phone') || text.includes('call') || text.includes('human')) {
      responseText = 'Here is how to reach human support & platform representatives:'
      steps = [
        { title: 'WhatsApp Direct Chat', description: 'Connect with our engineering & support team instantly.', actionUrl: 'https://wa.me/918092225777', actionLabel: 'Open WhatsApp (+91 8092225777)' },
        { title: 'Phone Support Line', description: 'Call us directly at +91 8985025794 for urgent setup assistance.' },
        { title: 'Email Support', description: 'Email info@nighwantech.com for custom enterprise inquiries.' },
      ]
      primaryActionUrl = 'https://wa.me/918092225777'
      primaryActionLabel = 'Chat on WhatsApp (+91 8092225777)'
    } 
    // 15. Dynamic Fallback via Groq LLM
    else {
      try {
        const { text: aiGeneratedText } = await generateText({
          model: groq('llama-3.1-8b-instant'),
          prompt: `You are WCRM AI Saathi, the official smart assistant for AIWCRM.
You are embedded in the user's dashboard (pathname: ${reqBody.pathname}).
The user is asking a question about a specific page or feature.
Explain how to use or navigate this in AIWCRM in a friendly, 2-3 sentence response.`,
        })

        responseText = aiGeneratedText ? aiGeneratedText.trim() : `I can help you navigate and master any feature in WCRM!`
      } catch (err) {
        responseText = `I can help you navigate and master any feature in WCRM! Try asking about Sales Pipelines, Broadcasts, Contacts, Flow Builder, BYOK Keys, or Billing & Invoices.`
      }

      steps = [
        { title: 'Quick Guide: Sales Pipelines', description: 'Manage Kanban deal stages and track sales funnel.', actionUrl: '/pipelines', actionLabel: 'Pipelines' },
        { title: 'Quick Guide: WhatsApp Broadcasts', description: 'Send targeted campaigns to thousands of contacts.', actionUrl: '/broadcasts/new', actionLabel: 'New Broadcast' },
        { title: 'Quick Guide: Visual Flow Builder', description: 'Build automated AI chatbots and lead scoring.', actionUrl: '/flows', actionLabel: 'Flow Builder' },
        { title: 'Quick Guide: Contacts & CSV Import', description: 'Upload contact lists and manage 360 customer views.', actionUrl: '/contacts', actionLabel: 'Contacts' },
        { title: 'Quick Guide: Billing & Invoices', description: 'Pay bill, upgrade plan, or download tax invoices.', actionUrl: '/settings?tab=invoices', actionLabel: 'Billing & Invoices' },
      ]
      primaryActionUrl = '/pipelines'
      primaryActionLabel = 'Go To Sales Pipelines'
    }

    return NextResponse.json({
      success: true,
      query: query,
      modelUsed: routing.copilotModel,
      responseText,
      steps,
      primaryActionUrl,
      primaryActionLabel,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Copilot endpoint error' },
      { status: 500 }
    )
  }
}
