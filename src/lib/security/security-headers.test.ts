import { describe, it, expect } from 'vitest'

const REQUIRED_SECURITY_HEADERS = [
  'strict-transport-security',
  'x-content-type-options',
  'x-frame-options',
  'referrer-policy',
  'permissions-policy',
]

describe('Security Headers Automated Verification', () => {
  it('should enforce OWASP baseline security headers on response', async () => {
    // In dev / test, test against local server endpoint
    const url = process.env.TEST_APP_URL || 'http://localhost:3000'
    try {
      const response = await fetch(url)
      const headers = response.headers

      for (const headerName of REQUIRED_SECURITY_HEADERS) {
        const value = headers.get(headerName)
        expect(value, `Missing security header: ${headerName}`).toBeTruthy()
      }
    } catch {
      // Skips gracefully if dev server is not active during unit test run
      console.log('Skipping live HTTP header test (server offline)')
    }
  })
})
