import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/flows/admin-client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data } = await supabaseAdmin().from('accounts').select('id, business_hours').limit(5);
  return NextResponse.json({ accounts: data, ts: Date.now() });
}
