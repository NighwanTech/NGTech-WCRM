/**
 * AIWCRM Voice AI Platform — System Prompt Builder
 *
 * Loads the same KB, AI Rules, Personality, Business Hours, and System
 * Prompt that the WhatsApp AI Assistant uses, then adapts the content
 * for spoken voice (removes markdown, converts lists to natural speech).
 *
 * This ensures consistent AI behavior across WhatsApp, Website Chatbot,
 * and Voice AI channels — Voice is not a separate island.
 */

import { getAdminClient } from '@/lib/admin-supabase';

const MAX_KB_CHARS  = 4000; // keep voice prompts concise
const MAX_RULES_LEN = 1500;

interface AiAssistantConfig {
  system_prompt?:    string | null;
  personality?:      string | null;
  business_name?:    string | null;
  business_hours?:   string | null;
  language?:         string | null;
}

interface KnowledgeBaseEntry {
  title:   string;
  content: string;
}

/**
 * Converts markdown text to plain, spoken-word friendly text.
 * - Strips **bold**, _italic_, # headings, `code`
 * - Converts bullet lists to "First..., Second..., Third..."
 * - Strips URLs, tables, horizontal rules
 */
function adaptForVoice(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, '')                        // strip headings
    .replace(/\*\*(.*?)\*\*/g, '$1')                   // strip bold
    .replace(/\*(.*?)\*/g, '$1')                       // strip italic
    .replace(/`{1,3}[^`]*`{1,3}/g, '')                 // strip code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')           // strip links, keep label
    .replace(/^[-*]\s+(.+)/gm, (_, item) => item)      // strip list bullets
    .replace(/\|[^\n]+\|/g, '')                        // strip tables
    .replace(/---+/g, '')                              // strip horizontal rules
    .replace(/\n{3,}/g, '\n\n')                        // collapse blank lines
    .trim();
}

/**
 * Build a voice-optimised system prompt for a given account.
 * Falls back to a sensible default if no KB or AI rules are configured.
 */
export async function buildVoiceSystemPrompt(accountId: string): Promise<string> {
  const db = getAdminClient() as any;

  // 1. Load AI Assistant configuration
  const { data: aiConfig } = await db
    .from('ai_assistant_config')
    .select('system_prompt, personality, business_name, business_hours, language')
    .eq('account_id', accountId)
    .maybeSingle() as { data: AiAssistantConfig | null };

  // 2. Load Knowledge Base entries
  const { data: kbEntries } = await db
    .from('knowledge_base')
    .select('title, content')
    .eq('account_id', accountId)
    .eq('is_active', true)
    .order('order_index', { ascending: true })
    .limit(20) as { data: KnowledgeBaseEntry[] | null };

  // 3. Load AI Rules
  const { data: aiRules } = await db
    .from('ai_rules')
    .select('rule_text')
    .eq('account_id', accountId)
    .eq('is_active', true) as { data: Array<{ rule_text: string }> | null };

  // 4. Assemble the prompt
  const businessName = aiConfig?.business_name ?? 'our business';
  const personality  = aiConfig?.personality   ?? 'professional, warm, and helpful';
  const language     = aiConfig?.language      ?? 'English';
  const basePrompt   = aiConfig?.system_prompt
    ? adaptForVoice(aiConfig.system_prompt)
    : `You are a helpful AI voice assistant for ${businessName}.`;

  let kbSection = '';
  if (kbEntries && kbEntries.length > 0) {
    const kbText = kbEntries
      .map((e) => `${e.title}:\n${adaptForVoice(e.content)}`)
      .join('\n\n')
      .slice(0, MAX_KB_CHARS);
    kbSection = `\n\nKNOWLEDGE BASE:\n${kbText}`;
  }

  let rulesSection = '';
  if (aiRules && aiRules.length > 0) {
    const rulesText = aiRules.map((r) => `- ${r.rule_text}`).join('\n').slice(0, MAX_RULES_LEN);
    rulesSection = `\n\nRULES YOU MUST FOLLOW:\n${rulesText}`;
  }

  const businessHoursSection = aiConfig?.business_hours
    ? `\n\nBUSINESS HOURS:\n${aiConfig.business_hours}`
    : '';

  const voiceGuidelines = `

VOICE GUIDELINES (IMPORTANT — always follow these):
- You are speaking out loud on a phone call. Keep responses short — under 30 words.
- Never use markdown, bullet points, or numbered lists in your spoken responses.
- Speak in ${language}. Be ${personality}.
- If a question requires a long answer, summarise it in 1-2 sentences and offer to send details via WhatsApp.
- If you cannot help, say: "Let me connect you with a team member who can help."`;

  return (
    basePrompt +
    kbSection +
    rulesSection +
    businessHoursSection +
    voiceGuidelines
  ).trim();
}
