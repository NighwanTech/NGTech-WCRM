/**
 * Enterprise PII Masking Utility (FIX 14)
 * Sanitizes sensitive personally identifiable information (PII)
 * before sending context/messages to LLM Providers.
 */

export class PIIMasker {
  /**
   * Mask Emails, Phone Numbers, Credit Cards, PAN, and Aadhaar numbers
   */
  public static maskText(text: string): string {
    if (!text || typeof text !== 'string') return text

    let masked = text

    // 1. Email Masking: user@domain.com -> u***r@domain.com
    masked = masked.replace(/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, (_, user, domain) => {
      if (user.length <= 2) return `${user[0]}*@${domain}`
      return `${user[0]}***${user[user.length - 1]}@${domain}`
    })

    // 2. Phone Number Masking (10-12 digits / Indian formats): +91 9876543210 -> +91 98*** **210
    masked = masked.replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, (match) => {
      const clean = match.replace(/\D/g, '')
      if (clean.length < 10) return match
      return match.slice(0, 4) + '******' + match.slice(-3)
    })

    // 3. Credit Card Masking: 16 digits -> ****-****-****-1234
    masked = masked.replace(/\b\d{4}[-.\s]?\d{4}[-.\s]?\d{4}[-.\s]?\d{4}\b/g, (match) => {
      const clean = match.replace(/\D/g, '')
      return `****-****-****-${clean.slice(-4)}`
    })

    // 4. Indian PAN Card Masking (5 letters, 4 digits, 1 letter): ABCDE1234F -> ABCDE****F
    masked = masked.replace(/\b[A-Z]{5}\d{4}[A-Z]{1}\b/g, (match) => {
      return `${match.slice(0, 5)}****${match.slice(-1)}`
    })

    // 5. Indian Aadhaar Card Masking (12 digits): 1234 5678 9012 -> **** **** 9012
    masked = masked.replace(/\b\d{4}[-.\s]?\d{4}[-.\s]?\d{4}\b/g, (match) => {
      const clean = match.replace(/\D/g, '')
      return `****-****-${clean.slice(-4)}`
    })

    return masked
  }

  /**
   * Mask an array of message objects while preserving exact type structure
   */
  public static maskMessages<T extends { role: any; content: string }>(messages: T[]): T[] {
    return messages.map((m) => ({
      ...m,
      content: PIIMasker.maskText(m.content),
    }))
  }
}
