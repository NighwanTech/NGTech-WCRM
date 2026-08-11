import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getActiveMetaAdAccounts,
  saveMetaAdAccount,
  disconnectSingleMetaAdAccount,
  updateMetaPixelId,
  disconnectMetaAdAccounts,
} from './db-adapter'

// Mock Supabase admin client
vi.mock('@/lib/admin-supabase', () => {
  const mockData: Record<string, any[]> = {
    meta_ad_accounts: [
      {
        id: 'acc_1',
        account_id: 'tenant_alpha',
        workspace_id: 'tenant_alpha',
        ad_account_id: 'act_1001',
        account_name: 'Tenant Alpha Ads',
        access_token: 'secret_token_alpha',
        status: 'active',
        user_id: 'user_alpha',
      },
      {
        id: 'acc_2',
        account_id: 'tenant_beta',
        workspace_id: 'tenant_beta',
        ad_account_id: 'act_2002',
        account_name: 'Tenant Beta Ads',
        access_token: 'secret_token_beta',
        status: 'active',
        user_id: 'user_beta',
      },
    ],
  }

  return {
    getAdminClient: () => ({
      from: (tableName: string) => {
        const rows = mockData[tableName] || []
        return {
          select: () => ({
            eq: (col: string, val: string) => ({
              eq: (col2: string, val2: string) => ({
                order: () => Promise.resolve({
                  data: rows.filter(r => r[col] === val && r[col2] === val2),
                  error: null
                }),
              }),
            }),
          }),
          update: (payload: any) => ({
            eq: (col: string, val: string) => ({
              or: (orCond: string) => Promise.resolve({ data: [payload], error: null }),
            }),
          }),
          insert: (payload: any) => ({
            select: () => ({
              maybeSingle: () => Promise.resolve({ data: { id: 'new_acc', ...payload }, error: null }),
            }),
          }),
        }
      },
    }),
  }
})

describe('Zero-Trust Meta Ads Tenant Isolation & Security Audit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('P0-1: Returns empty array when accountId is missing or empty (no global fallbacks)', async () => {
    const resultsEmpty = await getActiveMetaAdAccounts('')
    expect(resultsEmpty).toEqual([])

    const resultsUnmatched = await getActiveMetaAdAccounts('non_existent_tenant_999')
    expect(resultsUnmatched).toEqual([])
  })

  it('P0-2: Isolates Tenant Alpha data so Tenant Beta cannot see it', async () => {
    const alphaAccounts = await getActiveMetaAdAccounts('tenant_alpha')
    expect(alphaAccounts.length).toBe(1)
    expect(alphaAccounts[0].ad_account_id).toBe('act_1001')
    expect(alphaAccounts[0].account_name).toBe('Tenant Alpha Ads')

    const betaAccounts = await getActiveMetaAdAccounts('tenant_beta')
    expect(betaAccounts.length).toBe(1)
    expect(betaAccounts[0].ad_account_id).toBe('act_2002')

    // Cross-tenant verification: Beta query never yields Alpha ad account
    const crossAccountMatch = betaAccounts.find(a => a.ad_account_id === 'act_1001')
    expect(crossAccountMatch).toBeUndefined()
  })

  it('P0-3: Refuses saveMetaAdAccount operations with missing accountId', async () => {
    const result = await saveMetaAdAccount({
      accountId: '',
      userId: 'user_test',
      adAccountId: 'act_9999',
      accountName: 'Unauth Ads',
      encryptedAccessToken: 'token',
    })
    expect(result).toBeNull()
  })

  it('P0-4: Refuses disconnect and pixel update calls with empty accountId', async () => {
    const disconnectResult = await disconnectSingleMetaAdAccount('act_1001', '')
    expect(disconnectResult).toBe(false)

    const pixelResult = await updateMetaPixelId('', '123456789')
    expect(pixelResult).toBe(false)

    const disconnectAllResult = await disconnectMetaAdAccounts('')
    expect(disconnectAllResult).toBe(false)
  })
})
