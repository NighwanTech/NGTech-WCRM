import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/flows/admin-client'
import { processQueueBatch } from '@/lib/meta/queue-worker'

/**
 * Triggered by cron job (e.g. Vercel Cron or external scheduler)
 * Requires CRON_SECRET or similar auth in a real production env.
 */
export async function GET(request: Request) {
  try {
    const db = supabaseAdmin()
    
    // In production, we'd loop or trigger this for all pending jobs
    const result = await processQueueBatch(db, 50)
    
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Queue worker failed:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
