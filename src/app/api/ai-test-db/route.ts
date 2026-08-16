import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/flows/admin-client';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Endpoint disabled in production' }, { status: 403 });
  }

  const { data } = await supabaseAdmin().from('accounts').select('id, business_hours').limit(5);
  return NextResponse.json({ accounts: data, ts: Date.now() });
}
