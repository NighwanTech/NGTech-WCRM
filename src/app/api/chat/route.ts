import { streamText } from 'ai'
import { groq } from '@ai-sdk/groq'
import { searchKnowledgeDocuments } from '@/app/api/admin/knowledge-base/route'

export const maxDuration = 30

const SYSTEM_PROMPT = `You are the official AI assistant for AIWCRM, India's leading WhatsApp CRM platform.
Your primary goal is to help users understand our features, pricing, and capabilities, and encourage them to book a demo or start a free trial.

**About AIWCRM**:
- We provide a Shared Team Inbox for WhatsApp, meaning multiple agents can manage conversations from one number.
- We offer a No-Code Visual Workflow Builder for creating automated chatbots.
- Users can send personalized Broadcast Messaging to thousands of contacts with one click.
- We offer deep analytics and contact management.
- We integrate officially with the Meta WhatsApp Business API.

**Pricing & Plans**:
1. **Free Plan (7-Day Free Trial)**:
   - Price: ₹0 for 7 days (7-day free trial limit)
   - Includes: 500 Contacts, 1,000 Messages, Basic CRM features, 1 Team Member
   - Duration: 7 days only. After 7 days, users must upgrade to a paid plan.
2. **Starter Plan** (For small teams getting started):
   - Monthly Billing: ₹2,249 / month (Standard price ₹2,499, currently 10% off)
   - Annual Billing: ₹22,490 / year (Standard price ₹24,990, currently 10% off)
   - Includes: 2,000 Contacts, 5,000 Messages/month, Advanced CRM Workflows, Shared Team Inbox
3. **Pro Plan** (For growing businesses):
   - Monthly Billing: ₹5,999 / month
   - Annual Billing: ₹59,990 / year
   - Includes: 10,000 Contacts, 30,000 Messages/month, Advanced CRM Workflows, Shared Team Inbox, AI Chatbot Builder, Dedicated Account Manager
4. **Enterprise Plan** (For unlimited requirements):
   - Price: Custom pricing (Contact human team via WhatsApp at +91 8092225777)
   - Includes: Unlimited Contacts, Unlimited Messages, Everything in Pro, Custom SLAs

**Your rules**: 
1. Answer questions concisely, professionally, and accurately.
2. If asked about contact or human support, share phone: +91 8985025794 / WhatsApp +91 8092225777 or email info@nighwantech.com.
`

function getFallbackAnswer(lastMsg: string): string {
  const query = lastMsg.toLowerCase();
  const matchedDocs = searchKnowledgeDocuments(query);

  if (matchedDocs.length > 0) {
    const doc = matchedDocs[0];
    return `**${doc.title}**:

${doc.content}

For further assistance, reach our team on WhatsApp at +91 8092225777 or call +91 8985025794!`;
  }
  
  if (query.includes('price') || query.includes('plan') || query.includes('cost') || query.includes('charge') || query.includes('rate')) {
    return `Here are the official **AIWCRM** pricing plans:

1. **7-Day Free Trial**: ₹0 for 7 days (500 Contacts, 1,000 Messages).
2. **Starter Plan**: ₹2,249/month (2,000 Contacts, 5,000 Messages/mo, Shared Team Inbox).
3. **Pro Plan**: ₹5,999/month (10,000 Contacts, 30,000 Messages/mo, AI Chatbot Builder).
4. **Enterprise Plan**: Custom Pricing for unlimited scale.

You can start your 7-Day Free Trial right away from our website or book a live demo!`;
  }

  if (query.includes('trial') || query.includes('free') || query.includes('demo')) {
    return `Yes! We offer a **7-Day Free Trial** with ₹0 commitment. You get 500 contacts and 1,000 messages to test all features including Shared Team Inbox and AI Workflows. You can also book a live demo with our solution engineers!`;
  }

  if (query.includes('feature') || query.includes('what') || query.includes('how') || query.includes('crm') || query.includes('whatsapp')) {
    return `AIWCRM is India's leading AI-powered WhatsApp CRM platform featuring:
- **Shared Team Inbox**: Multiple agents managing 1 WhatsApp number.
- **No-Code AI Bot Builder**: Automated lead qualification & 24/7 auto-replies.
- **Broadcast Campaigns**: Send targeted bulk WhatsApp messages.
- **Multi-LLM BYOK Engine**: Power your AI with Gemini, OpenAI, Claude, Groq, or DeepSeek.

Would you like to start a 7-Day Free Trial or speak with our sales team?`;
  }

  if (query.includes('contact') || query.includes('phone') || query.includes('call') || query.includes('number') || query.includes('human') || query.includes('support') || query.includes('help')) {
    return `You can reach our official human support team directly:
- **Call**: +91 8985025794
- **WhatsApp**: +91 8092225777
- **Email**: info@nighwantech.com
- **Website**: https://nighwantech.com/`;
  }

  return `AIWCRM helps businesses automate sales, marketing, and support on WhatsApp using AI agents, shared team inbox, and broadcast automation. 

How can I assist you today? You can ask about our **Pricing Plans**, **Free Trial**, **AI Features**, or **Live Demo**!`;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const lastUserMessage = messages?.[messages.length - 1]?.content || messages?.[messages.length - 1]?.parts?.[0]?.text || '';

    // If Groq API Key is present, stream via LLM
    if (process.env.GROQ_API_KEY) {
      try {
        const matchedKbDocs = searchKnowledgeDocuments(lastUserMessage)
        const kbContext = matchedKbDocs.map(d => `Document Title: ${d.title}\nContent: ${d.content}`).join('\n\n')

        const result = await streamText({
          model: groq('llama-3.1-8b-instant'),
          system: `${SYSTEM_PROMPT}\n\nRelevant Knowledge Base Articles:\n${kbContext || 'No additional documents.'}`,
          messages: messages,
          temperature: 0.3,
        })
        return result.toTextStreamResponse()
      } catch (err) {
        console.warn("Groq streaming failed, using fallback assistant:", err);
      }
    }

    // Fallback streaming response if key is missing or endpoint is offline
    const responseText = getFallbackAnswer(lastUserMessage);
    const encoder = new TextEncoder();

    const customStream = new ReadableStream({
      async start(controller) {
        // Stream text in small chunks to simulate typing
        const words = responseText.split(' ');
        for (let i = 0; i < words.length; i++) {
          const chunk = (i === 0 ? '' : ' ') + words[i];
          controller.enqueue(encoder.encode(`0:${JSON.stringify(chunk)}\n`));
          await new Promise((r) => setTimeout(r, 25));
        }
        controller.close();
      },
    });

    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'x-vercel-ai-ui-stream': '1',
      },
    });
  } catch (error: any) {
    console.error("Error in AI Chat Route:", error)
    return new Response(JSON.stringify({ error: error.message || "An error occurred during chat processing." }), { status: 500 })
  }
}
