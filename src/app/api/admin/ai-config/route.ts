import { NextResponse } from 'next/server'
import {
  getGlobalAIConfigs,
  getFeatureRouting,
  getAIAuditLogs,
  updateAIProviderConfig,
  updateAIFeatureRouting,
} from '@/lib/ai/ai-provider-manager'

export async function GET() {
  try {
    const configs = await getGlobalAIConfigs()
    const routing = await getFeatureRouting()
    const logs = await getAIAuditLogs()

    return NextResponse.json({
      success: true,
      configs,
      routing,
      logs,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch AI configuration' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, provider, updates, routing } = body

    if (action === 'update_provider' && provider) {
      const updated = await updateAIProviderConfig(provider, updates || {})
      return NextResponse.json({ success: true, updated })
    }

    if (action === 'update_routing' && routing) {
      const updatedRouting = await updateAIFeatureRouting(routing)
      return NextResponse.json({ success: true, routing: updatedRouting })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update AI configuration' },
      { status: 500 }
    )
  }
}
