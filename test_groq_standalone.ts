import { groq } from '@ai-sdk/groq';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testGroq() {
  const model = groq('llama-3.3-70b-versatile');

  const system = `System: You are Nighwan AI, the official AI assistant of Nighwan Technology Pvt. Ltd.

IMPORTANT INSTRUCTIONS:
1. Detect the language of the customer's message and ALWAYS reply in that exact same language.
2. Answer the user's question concisely using ONLY the provided Knowledge Base below.
3. Keep replies formatting clean for WhatsApp.
4. Follow all instructions provided in the Knowledge Base exactly. The Knowledge Base rules take the highest priority over all other instructions.
5. If the user explicitly asks to speak to a human or expresses extreme frustration, you MUST call the requestHumanHandoff tool.

ESCALATION RULES:
The user has configured the following intents for potential human handoff: [Customer explicitly asks for human, Customer is angry or abusive, Customer asks legal questions].
IMPORTANT: Even if the intent matches, you MUST FIRST check the [Active Offerings Catalog] and Knowledge Base. If the answer or price is available there, DO NOT hand off—answer the user directly.

--- KNOWLEDGE BASE START ---
## Pricing & Catalog Rules
1. Primary Pricing Source: When a customer asks for the price, cost, or quotation of a product or service, you MUST check the Active Offerings / Product Catalog first. 
2. Standard Products: If the product or service is listed in the catalog, DO NOT hand off to a human. Simply reply with the price and description exactly as it is written in the catalog.
3. Custom Products: If they ask for a custom software solution that is NOT in the catalog (e.g. custom ERP), inform them that pricing depends on business requirements and then route them to the human sales team.

## Human Handoff
Transfer conversation when customer asks about:
• Pricing (Only if the requested service is NOT listed in the catalog)
• Quotation (Only if the requested service is NOT listed in the catalog)
• Customization

[Active Offerings Catalog]
- SERVICE: Website Development | Price: INR 20000
  Description: fully custom website
--- KNOWLEDGE BASE END ---`;

  console.log("Sending to Groq...");
  try {
    const { text, toolCalls, finishReason } = await generateText({
      model,
      system,
      prompt: "price for website development ?",
      tools: {
        requestHumanHandoff: tool({
          description: 'Route to a human agent. Call this tool when the customer asks a question you cannot answer, or when your Knowledge Base instructions explicitly tell you to transfer the conversation.',
          parameters: z.object({ reason: z.string() }),
        }),
      }
    });

    console.log("Response Text:", text);
    console.log("Tool Calls:", JSON.stringify(toolCalls, null, 2));
    console.log("Finish Reason:", finishReason);
  } catch (err) {
    console.error("Groq Error:", err);
  }
}

testGroq();
