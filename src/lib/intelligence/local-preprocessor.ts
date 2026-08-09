/**
 * Local Preprocessing Pipeline for WhatsApp Conversation Intelligence
 * 
 * Responsibilities:
 * 1. PII Redaction: Removes emails, phone numbers, and credit cards locally.
 * 2. Noise Removal: Filters out extremely short or generic greetings (hi, ok, thanks).
 * 3. Aggregation: Groups messages to form anonymous, dense context batches for the LLM.
 */

export interface RawMessage {
  id: string;
  text: string;
  sender_type: string;
  created_at: string;
}

export interface PreprocessedBatch {
  messageCount: number;
  anonymizedText: string;
}

const PII_REGEX = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  phone: /(?:\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/g, // Basic generic phone matching
  creditCard: /\b(?:\d[ -]*?){13,16}\b/g, // Rough pattern for CC numbers
  ssn: /\b\d{3}[- ]?\d{2}[- ]?\d{4}\b/g, // US SSN pattern
};

const NOISE_WORDS = new Set([
  'hi', 'hello', 'hey', 'ok', 'okay', 'thanks', 'thank you', 'thx', 'yes', 'no', 'cool', 'awesome', 'bye'
]);

export class LocalPreprocessor {
  /**
   * Redacts all identifiable patterns from a string.
   */
  static redactPII(text: string): string {
    let scrubbed = text;
    scrubbed = scrubbed.replace(PII_REGEX.email, '[EMAIL]');
    scrubbed = scrubbed.replace(PII_REGEX.phone, '[PHONE]');
    scrubbed = scrubbed.replace(PII_REGEX.creditCard, '[CREDIT_CARD]');
    scrubbed = scrubbed.replace(PII_REGEX.ssn, '[SSN]');
    return scrubbed;
  }

  /**
   * Determines if a message contains meaningful content.
   */
  static isNoise(text: string): boolean {
    const cleaned = text.trim().toLowerCase().replace(/[.,!?]/g, '');
    if (cleaned.length < 2) return true;
    if (NOISE_WORDS.has(cleaned)) return true;
    return false;
  }

  /**
   * Processes a raw array of database messages into a safe, anonymized text block for the LLM.
   */
  static processMessages(messages: RawMessage[]): PreprocessedBatch {
    const validMessages: string[] = [];

    for (const msg of messages) {
      if (!msg.text || msg.sender_type !== 'customer') continue;
      
      if (this.isNoise(msg.text)) continue;

      const scrubbedText = this.redactPII(msg.text);
      // We do not include the sender ID or any other PII metadata.
      validMessages.push(`- ${scrubbedText}`);
    }

    return {
      messageCount: validMessages.length,
      anonymizedText: validMessages.join('\n')
    };
  }
}
