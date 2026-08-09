import { NextResponse } from 'next/server';
import { requireRole, toErrorResponse } from '@/lib/auth/account';
import { listVoicesForProvider } from '@/lib/voice-ai/provider-service';
import type { VoiceProvider } from '@/lib/voice-ai/types';

/** GET /api/voice-ai/voices?provider=elevenlabs */
export async function GET(req: Request) {
  try {
    const ctx      = await requireRole('agent');
    const url      = new URL(req.url);
    const provider = (url.searchParams.get('provider') ?? 'retell') as VoiceProvider;

    const voices = await listVoicesForProvider(ctx.accountId, provider);
    return NextResponse.json({ voices });
  } catch (error) {
    return toErrorResponse(error);
  }
}
