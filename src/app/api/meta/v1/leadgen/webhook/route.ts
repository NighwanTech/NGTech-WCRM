import { NextResponse } from 'next/server'
import { GET as intakeGET, POST as intakePOST } from '@/app/api/cip/v1/intake/route'

/**
 * Meta Webhook Forwarder Endpoint
 * Route: /api/meta/v1/leadgen/webhook
 */
export async function GET(request: Request) {
  return intakeGET(request)
}

export async function POST(request: Request) {
  return intakePOST(request)
}
