import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/flows/admin-client'
import { processQueueBatch } from '@/lib/meta/queue-worker'

/**
 * FIX 13 — Workers API Root Endpoint (/api/meta/workers)
 * Forward/proxy request to queue worker logic or redirect to /api/meta/workers/queue
 */
export async function GET(request: Request) {
  try {
    const db = supabaseAdmin()
    const result = await processQueueBatch(db, 50)
    return NextResponse.json({
      success: true,
      endpoint: '/api/meta/workers',
      queueResult: result
    })
  } catch (error: any) {
    console.error('Workers API root worker failed:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
