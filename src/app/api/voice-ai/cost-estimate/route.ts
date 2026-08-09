import { NextResponse } from 'next/server';
import { requireRole, toErrorResponse } from '@/lib/auth/account';
import { estimateCallCost } from '@/lib/voice-ai/provider-service';
import type { VoiceProvider } from '@/lib/voice-ai/types';

/** POST /api/voice-ai/cost-estimate
 *  Body: { provider: 'retell' | 'elevenlabs', duration_seconds: number }
 *  Returns: { estimated_cost_inr: number }
 */
export async function POST(req: Request) {
  try {
    await requireRole('agent');
    const { provider, duration_seconds } = await req.json();

    if (!provider || typeof duration_seconds !== 'number') {
      return NextResponse.json({ error: 'provider and duration_seconds required' }, { status: 400 });
    }

    const estimatedCostInr = estimateCallCost(provider as VoiceProvider, duration_seconds);
    return NextResponse.json({ estimated_cost_inr: estimatedCostInr });
  } catch (error) {
    return toErrorResponse(error);
  }
}
