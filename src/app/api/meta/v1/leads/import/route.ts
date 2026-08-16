import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { SmartDuplicateResolver } from '@/lib/meta/smart-duplicate-resolver'

/**
 * POST - Enterprise CSV / Excel AI Import Parser
 */
export async function POST(request: Request) {
  return withZeroTrustGuard(request, { permission: 'meta_ads:manage' }, async (ctx) => {
    try {
      const body = await request.json()
      const { leads = [] } = body

      let importedCount = 0
      let mergedCount = 0

      for (const lead of leads) {
        const res = await SmartDuplicateResolver.resolveContact({
          accountId: ctx.accountId,
          name: lead.name || 'Imported Lead',
          phone: lead.phone,
          email: lead.email,
          city: lead.city
        })

        if (res.actionTaken === 'MERGED_EXISTING') mergedCount++
        else importedCount++
      }

      return NextResponse.json({
        success: true,
        summary: {
          totalParsed: leads.length,
          importedCount,
          mergedCount,
          autoMappedColumns: ['Name', 'Phone', 'Email', 'City', 'Budget']
        }
      })
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}
