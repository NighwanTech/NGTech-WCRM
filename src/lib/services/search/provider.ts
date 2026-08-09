export interface SearchResult {
  id: string
  title: string
  subtitle?: string
  type: 'MODULE' | 'CONTACT' | 'PIPELINE' | 'CAMPAIGN' | 'AI_ACTION' | 'RECENT'
  url: string
}

export class SearchProvider {
  /**
   * Omni-Search Implementation
   * Queries local config for modules and uses debounced Supabase for DB entities.
   * Built as a provider so it can be swapped with Algolia or Typesense later.
   */
  static async search(query: string, localModules: SearchResult[]): Promise<SearchResult[]> {
    if (!query) return []
    
    const lowerQuery = query.toLowerCase()
    
    // 1. Local Search (Instant)
    const localResults = localModules.filter(m => 
      m.title.toLowerCase().includes(lowerQuery) || 
      m.subtitle?.toLowerCase().includes(lowerQuery)
    )

    // 2. Debounced Remote Search (Mocked for now)
    // In production, this fires parallel queries to contacts, pipelines, etc via Supabase
    const remoteResults = await this._debouncedSupabaseSearch(lowerQuery)

    return [...localResults, ...remoteResults]
  }

  private static async _debouncedSupabaseSearch(query: string): Promise<SearchResult[]> {
    // Simulating network delay and parallel querying
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResults: SearchResult[] = []
        if (query.includes('john') || query.includes('doe')) {
          mockResults.push({ id: 'c1', title: 'John Doe', subtitle: 'john@example.com', type: 'CONTACT', url: '/contacts/c1' })
        }
        if (query.includes('q3')) {
          mockResults.push({ id: 'p1', title: 'Q3 Enterprise Deal', subtitle: '$50,000 Pipeline', type: 'PIPELINE', url: '/pipelines/p1' })
        }
        resolve(mockResults)
      }, 300)
    })
  }
}
