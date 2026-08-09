import { z } from 'zod'
import { NextResponse } from 'next/server'

/**
 * XSS Sanitizer for plain text strings
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return input
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * Common Zod validation schemas across AIWCRM
 */
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).transform(sanitizeString),
  phone: z.string().min(5, 'Valid phone number required').max(30),
  email: z.string().email('Invalid email address').optional().nullable(),
  company: z.string().max(255).optional().nullable().transform((v) => (v ? sanitizeString(v) : v)),
})

export const sequenceEnrollSchema = z.object({
  sequenceId: z.string().uuid('Invalid sequence ID'),
  contactIds: z.array(z.string().uuid()).min(1, 'At least one contact must be selected').max(500),
})

export const broadcastCreateSchema = z.object({
  name: z.string().min(1).max(255).transform(sanitizeString),
  templateName: z.string().min(1),
  language: z.string().default('en'),
  recipients: z.array(z.string()).min(1, 'At least one recipient is required'),
})

export const whatsappConfigSchema = z.object({
  phoneNumberId: z.string().min(1, 'Phone Number ID is required'),
  wabaId: z.string().min(1, 'WABA ID is required'),
  accessToken: z.string().min(1, 'Access Token is required'),
  verifyToken: z.string().optional(),
})

export const aiAssistantSettingsSchema = z.object({
  model: z.string().min(1),
  systemPrompt: z.string().max(10000).optional(),
  temperature: z.number().min(0).max(2).optional(),
  useCustomKeys: z.boolean().optional(),
  openaiApiKey: z.string().optional().nullable(),
  geminiApiKey: z.string().optional().nullable(),
  claudeApiKey: z.string().optional().nullable(),
  groqApiKey: z.string().optional().nullable(),
})

/**
 * Helper to validate incoming Request body against a Zod schema
 */
export async function validateRequest<T>(
  schema: z.ZodSchema<T>,
  request: Request
): Promise<{ data: T } | { errorResponse: NextResponse }> {
  try {
    const body = await request.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      const formattedErrors = result.error.flatten()
      return {
        errorResponse: NextResponse.json(
          {
            error: 'Invalid request payload',
            details: formattedErrors.fieldErrors,
          },
          { status: 400 }
        ),
      }
    }

    return { data: result.data }
  } catch {
    return {
      errorResponse: NextResponse.json(
        { error: 'Malformed JSON payload' },
        { status: 400 }
      ),
    }
  }
}
