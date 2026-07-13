import crypto from 'node:crypto'

/** Verify Retell's timestamped HMAC-SHA256 webhook signature. */
export function verifyRetellWebhookSignature(
  rawBody: string,
  signature: string | null,
  apiKey: string,
  now = Date.now(),
): boolean {
  if (!signature || !apiKey) return false
  const match = /^v=(\d+),d=([a-f0-9]{64})$/i.exec(signature)
  if (!match) return false

  const [, timestamp, digest] = match
  if (Math.abs(now - Number(timestamp)) > 5 * 60 * 1000) return false

  const expected = crypto
    .createHmac('sha256', apiKey)
    .update(rawBody + timestamp)
    .digest('hex')
  return crypto.timingSafeEqual(Buffer.from(digest, 'hex'), Buffer.from(expected, 'hex'))
}
