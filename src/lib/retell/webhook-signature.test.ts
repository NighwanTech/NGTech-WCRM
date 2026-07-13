import crypto from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { verifyRetellWebhookSignature } from './webhook-signature'

const KEY = 'retell-webhook-key'
const NOW = 1_700_000_000_000

function signature(body: string, timestamp = NOW) {
  const digest = crypto.createHmac('sha256', KEY).update(body + timestamp).digest('hex')
  return `v=${timestamp},d=${digest}`
}

describe('verifyRetellWebhookSignature', () => {
  it('accepts a signed raw payload within the replay window', () => {
    const body = '{"event":"call_analyzed"}'
    expect(verifyRetellWebhookSignature(body, signature(body), KEY, NOW)).toBe(true)
  })

  it('rejects tampered, malformed, and replayed requests', () => {
    const body = '{"event":"call_analyzed"}'
    expect(verifyRetellWebhookSignature('{}', signature(body), KEY, NOW)).toBe(false)
    expect(verifyRetellWebhookSignature(body, 'not-a-signature', KEY, NOW)).toBe(false)
    expect(verifyRetellWebhookSignature(body, signature(body, NOW - 300_001), KEY, NOW)).toBe(false)
  })
})
