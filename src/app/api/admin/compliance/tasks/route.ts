import { NextResponse } from 'next/server'
import { withZeroTrustGuard } from '@/lib/security/zero-trust-guard'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/admin/compliance/tasks
 * Fetch Compliance Calendar & Tasks
 */
export async function GET(req: Request) {
  return withZeroTrustGuard(req, { permission: 'compliance:read' }, async (ctx) => {
    try {
      const supabase = await createClient()
      const { data: tasks } = await supabase
        .from('compliance_calendar_tasks')
        .select('*')
        .eq('account_id', ctx.accountId)
        .order('due_date', { ascending: true })

      const defaultTasks = [
        { id: 't1', title: 'Q3 Annual GDPR Data Protection Audit', category: 'GDPR Audit', due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), priority: 'high', status: 'in_progress' },
        { id: 't2', title: 'Subprocessor DPA Annual Renewal Review', category: 'Vendor Governance', due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), priority: 'medium', status: 'pending' },
        { id: 't3', title: 'Execute 365-Day Log Retention Cleanup Job', category: 'Data Retention', due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), priority: 'urgent', status: 'pending' },
      ]

      return NextResponse.json({ tasks: tasks && tasks.length > 0 ? tasks : defaultTasks })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}
