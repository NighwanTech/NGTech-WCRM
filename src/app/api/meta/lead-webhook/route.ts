import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/flows/admin-client'
import { enqueueWebhookEvent, processPendingQueueItems } from '@/lib/meta/webhook-queue'

/**
 * GET - Meta Webhook Verification Handshake
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('hub.mode')
    const challenge = searchParams.get('hub.challenge')
    const verifyToken = searchParams.get('hub.verify_token')

    const expectedToken = process.env.META_WEBHOOK_VERIFY_TOKEN || 'Nighwan@804421'

    if (mode === 'subscribe' && verifyToken === expectedToken && challenge) {
      console.log('[Meta Webhook] Verification successful!')
      return new Response(challenge, { status: 200 })
    }

    console.warn('[Meta Webhook] Verification failed mismatch:', { mode, verifyToken, expectedToken })
    return NextResponse.json({ error: 'Forbidden verification token' }, { status: 403 })
  } catch (error: any) {
    console.error('[Meta Webhook] GET Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * POST - Realtime Webhook Receiver (Asynchronous Event-Driven Queue)
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json()

    // Enqueue raw event payload for reliable async execution
    const db = supabaseAdmin()
    await enqueueWebhookEvent(db, payload)

    // Trigger async worker in background (non-blocking)
    processPendingQueueItems(db, 5).catch((err) =>
      console.error('[Meta Webhook Queue Worker Error]:', err)
    )

    // Respond immediately to Meta within <100ms
    return NextResponse.json({ success: true, message: 'Event queued' }, { status: 200 })
  } catch (error: any) {
    console.error('[Meta Webhook] POST Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
